"use client";

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Bell, MapPin, Plus, Home, User, MessageCircle, X } from 'lucide-react';
import ParticipationModal from './ParticipationModal';

interface Event {
    id: string;
    title: string;
    genre: string; // Keep this in interface for backward compatibility if needed, but display category
    category: string;
    startAt: any;
    endAt: any;
    locationName: string;
    locationArea: string;
    currentCount: number;
    capacity: number;
    price: number;
    imageUrl?: string;
    hostName?: string;
    hostAvatar?: string;
    tags?: string[];
    level?: string;
}

interface HomeViewProps {
    onOpenCreateModal: () => void;
}

export default function HomeView({ onOpenCreateModal }: HomeViewProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedArea, setSelectedArea] = useState('東京都');
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isParticipationModalOpen, setIsParticipationModalOpen] = useState(false);

    const areas = ['東京都', '神奈川県', '埼玉県', '千葉県', '大阪府', '京都府', '福岡県', '北海道'];
    const categories = [
        { id: 'all', name: 'すべて', icon: <Search size={20} /> },
        { id: 'sports', name: 'マイナー競技', icon: '🏃' },
        { id: 'monozukuri', name: 'ものづくり', icon: '🛠️' },
        { id: 'boardgame', name: 'ボドゲ', icon: '🎲' },
        { id: 'outdoor', name: 'アウトドア', icon: '🌲' },
        { id: 'tech', name: 'テック', icon: '💻' },
    ];

    useEffect(() => {
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Event[];
            setEvents(eventsData);
        });
        return unsubscribe;
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-20 border-b border-gray-100">
                <button
                    onClick={() => setIsAreaModalOpen(true)}
                    className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600 font-medium active:scale-95 transition-transform"
                >
                    <MapPin size={16} className="text-teal-600" />
                    <span>{selectedArea}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="relative">
                    <Bell size={24} className="text-gray-400" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
            </header>

            {/* Area Selection Modal */}
            {isAreaModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-xs bg-white rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">エリアを選択</h3>
                            <button onClick={() => setIsAreaModalOpen(false)} className="text-gray-400 p-1">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                            {areas.map(area => (
                                <button
                                    key={area}
                                    onClick={() => {
                                        setSelectedArea(area);
                                        setIsAreaModalOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${selectedArea === area ? 'bg-teal-50 text-teal-600' : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    {area}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Banner */}
            <div className="px-6 py-4 mt-2">
                <div className="relative h-48 bg-gradient-to-br from-teal-500 via-blue-500 to-blue-600 rounded-[32px] p-8 flex flex-col justify-center overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-white text-2xl font-bold mb-2">週末、何する？</h2>
                        <p className="text-white/80 text-sm mb-4">まだ見ぬ「熱狂」を探しに行こう。</p>
                        <button className="bg-white text-teal-600 px-5 py-2 rounded-full text-sm font-bold shadow-sm">
                            特集を見る
                        </button>
                    </div>
                    {/* Subtle decoration */}
                    <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="px-6 py-4 overflow-x-auto flex gap-4 no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl transition-all ${activeCategory === cat.id ? 'bg-teal-50 border border-teal-100' : 'bg-white border border-gray-100'
                            }`}
                    >
                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-xl ${activeCategory === cat.id ? 'bg-teal-100 text-teal-600' : 'bg-gray-50'
                            }`}>
                            {cat.icon}
                        </div>
                        <span className={`text-xs font-medium whitespace-nowrap ${activeCategory === cat.id ? 'text-teal-600' : 'text-gray-500'}`}>
                            {cat.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Event List */}
            <div className="px-6 py-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
                        近日の募集
                    </h3>
                </div>

                {events.filter(e => activeCategory === 'all' || e.category === activeCategory).length === 0 ? (
                    <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                        イベントがまだありません。
                    </div>
                ) : (
                    <div className="space-y-6">
                        {events
                            .filter(e => activeCategory === 'all' || e.category === activeCategory)
                            .map((event) => (
                                <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 transition-transform active:scale-[0.98]">
                                    <div className="relative h-48 bg-gray-200">
                                        {event.imageUrl ? (
                                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-teal-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                            <MapPin size={10} />
                                            近所の募集
                                        </div>
                                        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm uppercase">
                                            {event.category}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            {event.level && (
                                                <span className="inline-block bg-teal-50 text-teal-600 text-[10px] font-bold px-2 py-1 rounded-md">
                                                    🔰 {event.level}
                                                </span>
                                            )}
                                            <span className="text-[10px] font-bold text-gray-400">
                                                {event.currentCount || 0} / {event.capacity}名
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-lg text-gray-800 mb-3 leading-tight leading-snug truncate">
                                            {event.title}
                                        </h4>
                                        <div className="flex items-center gap-4 text-gray-400 text-xs font-medium">
                                            <div className="flex items-center gap-1.5">
                                                📅 {event.startAt?.toDate().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' })}
                                            </div>
                                            <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                                                📍 {event.locationName}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
                                            <span className="text-teal-600 font-bold text-sm">¥{event.price}</span>
                                            <button
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setIsParticipationModalOpen(true);
                                                }}
                                                className="bg-teal-600 text-white text-[10px] font-bold px-4 py-2 rounded-xl active:scale-95 transition-transform"
                                            >
                                                参加する
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            <ParticipationModal
                isOpen={isParticipationModalOpen}
                onClose={() => setIsParticipationModalOpen(false)}
                event={selectedEvent}
            />
        </div>
    );
}
