"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, ChevronRight, Clock, Users } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { collection, query, where, getDocs, orderBy, onSnapshot, limit } from 'firebase/firestore';

interface ChatRoom {
    id: string;
    title: string;
    category: string;
    lastMessage?: string;
    lastMessageAt?: any;
    hostName: string;
    hostId: string;
}

export default function TalkView() {
    const { user } = useAuth();
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Fetch events where the user is the host
        // In a real app, we'd also fetch events where the user is a participant
        const q = query(
            collection(db, "events"),
            where("hostId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const roomsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ChatRoom));
            setRooms(roomsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 px-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">トーク</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white rounded-[32px] animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="bg-white px-6 pt-16 pb-6 rounded-b-[40px] shadow-sm mb-6">
                <h2 className="text-2xl font-bold text-gray-800">トーク</h2>
                <p className="text-xs text-gray-400 mt-1 font-bold">進行中のイベントチャット</p>
            </div>

            <div className="px-6 space-y-4">
                {rooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                            <MessageCircle size={32} />
                        </div>
                        <p className="text-gray-400 text-sm font-bold">まだ公開中のトークはありません</p>
                        <p className="text-[10px] text-gray-300 mt-1">イベントを作成・参加して会話を始めましょう</p>
                    </div>
                ) : (
                    rooms.map((room) => (
                        <button
                            key={room.id}
                            className="w-full bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 flex items-center gap-4 active:scale-[0.98] transition-all text-left"
                            onClick={() => alert('トークルーム機能は開発中です！もうすぐリリースされます 🚀')}
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl flex items-center justify-center text-teal-500 shrink-0">
                                <MessageCircle size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">{room.category}</span>
                                    <span className="text-[10px] text-gray-300 font-bold">12:34</span>
                                </div>
                                <h4 className="font-bold text-gray-800 truncate mb-1">{room.title}</h4>
                                <p className="text-xs text-gray-400 font-medium truncate">
                                    {room.lastMessage || 'まだメッセージはありません。挨拶してみましょう！'}
                                </p>
                            </div>
                            <ChevronRight size={18} className="text-gray-200 shrink-0" />
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
