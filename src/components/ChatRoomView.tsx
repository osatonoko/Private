"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronLeft, Calendar, MapPin } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    getDoc
} from 'firebase/firestore';

interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    senderPhoto?: string;
    createdAt: any;
}

interface ChatRoomViewProps {
    eventId: string;
    onBack: () => void;
}

export default function ChatRoomView({ eventId, onBack }: ChatRoomViewProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [eventTitle, setEventTitle] = useState('読み込み中...');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!eventId) return;

        // Fetch Event Title
        getDoc(doc(db, "events", eventId)).then(snap => {
            if (snap.exists()) {
                setEventTitle(snap.data().title);
            }
        });

        // Listen for Messages
        const q = query(
            collection(db, "events", eventId, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message));
            setMessages(msgs);

            // Auto scroll to bottom
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });

        return () => unsubscribe();
    }, [eventId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const text = newMessage;
        setNewMessage('');

        try {
            await addDoc(collection(db, "events", eventId, "messages"), {
                text,
                senderId: user.uid,
                senderName: user.displayName || 'ゲスト',
                senderPhoto: user.photoURL,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error sending message:", error);
            alert("メッセージの送信に失敗しました。");
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col sm:max-w-md sm:mx-auto sm:border-x">
            {/* Header */}
            <div className="h-16 px-4 border-b flex items-center gap-3 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-400">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-800 truncate">{eventTitle}</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">トークルーム</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-xs text-gray-300 font-medium italic">
                            メッセージはまだありません。<br />挨拶から始めましょう！
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${msg.senderId === user?.uid ? 'flex-row-reverse' : ''}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                {msg.senderPhoto ? (
                                    <img src={msg.senderPhoto} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-gray-400">👤</span>
                                )}
                            </div>
                            <div className={`max-w-[70%] space-y-1 ${msg.senderId === user?.uid ? 'items-end' : ''}`}>
                                <span className="text-[10px] text-gray-400 font-bold block ml-1">{msg.senderName}</span>
                                <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.senderId === user?.uid
                                        ? 'bg-teal-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                    } shadow-sm`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t shrink-0">
                <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 text-teal-600 disabled:text-gray-300 transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}
