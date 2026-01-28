"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function TalkView() {
    return (
        <div className="min-h-screen bg-gray-50 p-6 pb-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">トーク</h2>
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle size={40} />
                </div>
                <p>メッセージはまだありません</p>
            </div>
        </div>
    );
}
