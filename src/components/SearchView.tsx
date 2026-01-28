"use client";

import React from 'react';
import { Search } from 'lucide-react';

export default function SearchView() {
    return (
        <div className="min-h-screen bg-gray-50 p-6 pb-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">探す</h2>
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="キーワード、タグ、場所で検索"
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
            </div>

            <div className="space-y-6">
                <h3 className="font-bold text-gray-700">人気タグ</h3>
                <div className="flex flex-wrap gap-2">
                    {['#モルック', '#サバゲー', '#ボードゲーム', '#キャンプ', '#プログラミング'].map(tag => (
                        <span key={tag} className="bg-white border border-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-600 shadow-sm cursor-pointer hover:bg-teal-50 hover:border-teal-200 transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
