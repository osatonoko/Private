"use client";

import React from 'react';
import { User, Settings, Award, History } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';

export default function MyPageView() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="bg-white px-6 pt-16 pb-8 rounded-b-[40px] shadow-sm mb-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">マイページ</h2>
                    <button onClick={() => auth.signOut()} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                        <Settings size={24} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-teal-100 rounded-3xl flex items-center justify-center overflow-hidden">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                        ) : (
                            <User size={40} className="text-teal-600" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{user?.displayName || 'ゲストユーザー'}</h3>
                        <p className="text-sm text-gray-400">信頼レベル: ⭐️ 4.8</p>
                    </div>
                </div>
            </div>

            <div className="px-6 grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center gap-2">
                    <Award className="text-teal-500" size={24} />
                    <span className="text-xs font-bold text-gray-400">主催回数</span>
                    <span className="text-xl font-bold text-gray-800">0</span>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center gap-2">
                    <History className="text-blue-500" size={24} />
                    <span className="text-xs font-bold text-gray-400">参加回数</span>
                    <span className="text-xl font-bold text-gray-800">0</span>
                </div>
            </div>
        </div>
    );
}
