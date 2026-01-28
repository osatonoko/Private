"use client";

import React, { useState } from 'react';
import { User, Settings, Award, History, Database, Edit2, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { seedDemoData } from '@/lib/seeding';

export default function MyPageView() {
    const { user } = useAuth();
    const [seeding, setSeeding] = useState(false);

    const handleSeed = async () => {
        if (!confirm('デモデータを追加しますか？')) return;
        setSeeding(true);
        try {
            await seedDemoData();
            alert('デモデータを追加しました！ホーム画面に反映されます。');
        } catch (e) {
            alert('追加に失敗しました。');
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Upper Profile Section */}
            <div className="bg-white px-6 pt-16 pb-8 rounded-b-[40px] shadow-sm mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <h2 className="text-2xl font-bold text-gray-800">マイページ</h2>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                            <Settings size={22} />
                        </button>
                        <button onClick={() => auth.signOut()} className="p-2 hover:bg-red-50 rounded-full text-red-400">
                            <LogOut size={22} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-6 relative z-10">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-[32px] p-1 shadow-lg shadow-teal-100">
                            <div className="w-full h-full bg-white rounded-[28px] overflow-hidden flex items-center justify-center">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} className="text-teal-600" />
                                )}
                            </div>
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-sm active:scale-90 transition-transform">
                            <Edit2 size={14} />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 mb-1">{user?.displayName || 'ゲストユーザー'}</h3>
                        <div className="flex items-center gap-2">
                            <span className="bg-teal-50 text-teal-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Verified</span>
                            <p className="text-xs text-gray-400 font-bold">信頼スコア: ⭐️ 4.8</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="px-6 grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-5 rounded-[32px] shadow-sm flex flex-col items-center gap-2 border border-gray-50">
                    <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-500 mb-1">
                        <Award size={20} />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Organized</span>
                    <span className="text-2xl font-black text-gray-800">12</span>
                </div>
                <div className="bg-white p-5 rounded-[32px] shadow-sm flex flex-col items-center gap-2 border border-gray-50">
                    <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-1">
                        <History size={20} />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Attended</span>
                    <span className="text-2xl font-black text-gray-800">48</span>
                </div>
            </div>

            {/* Developer Section */}
            <div className="px-6 space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Developer Zone</h4>
                <button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="w-full bg-white border border-gray-100 p-5 rounded-[32px] flex items-center justify-between active:scale-[0.98] transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-500 transition-colors">
                            <Database size={24} />
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-gray-800">デモデータを追加</span>
                            <span className="block text-[10px] text-gray-400 font-medium">Firestoreに5件のサンプルを投稿します</span>
                        </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center transition-all ${seeding ? 'animate-spin' : ''}`}>
                        <span className="text-gray-300 font-bold">→</span>
                    </div>
                </button>
            </div>

            <div className="px-12 py-8">
                <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">MONOs App v0.1.0-alpha</p>
            </div>
        </div>
    );
}
