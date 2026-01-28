"use client";

import React, { useState } from 'react';
import { X, CreditCard, Info, Users, CheckCircle2 } from 'lucide-react';

interface ParticipationModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: {
        id: string;
        title: string;
        price: number;
        deposit: number;
    } | null;
}

export default function ParticipationModal({ isOpen, onClose, event }: ParticipationModalProps) {
    const [step, setStep] = useState<'confirm' | 'payment' | 'success'>('confirm');
    const [guestCount, setGuestCount] = useState(0);
    const depositPerPerson = 50;

    if (!isOpen || !event) return null;

    const totalFee = event.price * (1 + guestCount);
    const totalDeposit = depositPerPerson * (1 + guestCount);

    const handleNext = () => {
        if (step === 'confirm') setStep('payment');
        else if (step === 'payment') setStep('success');
    };

    const resetAndClose = () => {
        setStep('confirm');
        setGuestCount(0);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
            <div className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                        {step === 'success' ? '申し込み完了' : '参加を確定する'}
                    </h2>
                    <button onClick={resetAndClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {step === 'confirm' && (
                        <>
                            <div className="bg-teal-50/50 border border-teal-100 p-6 rounded-[24px]">
                                <h3 className="font-bold text-teal-800 mb-2 truncate">{event.title}</h3>
                                <div className="flex items-center gap-4 text-xs text-teal-600 font-bold">
                                    <span>参加費: ¥{event.price} / 人</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Users size={18} className="text-gray-400" />
                                    同伴者を選択
                                </label>
                                <div className="flex gap-3">
                                    {[0, 1, 2, 3].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => setGuestCount(num)}
                                            className={`flex-1 py-3.5 rounded-2xl text-sm font-bold border transition-all ${guestCount === num
                                                    ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-100'
                                                    : 'bg-white border-gray-100 text-gray-400'
                                                }`}
                                        >
                                            {num === 0 ? '自分のみ' : `+${num}名`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-[24px] space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">合計参加費</span>
                                    <span className="font-bold text-gray-800">¥{totalFee}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5 font-bold underline decoration-pink-300">
                                        参加保証金 (デポジット)
                                        <Info size={14} className="text-gray-300" />
                                    </span>
                                    <span className="font-bold text-pink-500">¥{totalDeposit}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                    <span className="font-bold text-gray-800">合計支払額</span>
                                    <span className="text-xl font-black text-gray-800">¥{totalFee + totalDeposit}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                                    ※デポジットはイベント参加後に自動返金されます。無断欠席の場合は没収となります。
                                </p>
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full bg-teal-600 text-white font-bold py-4 rounded-3xl hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all"
                            >
                                次へ進む
                            </button>
                        </>
                    )}

                    {step === 'payment' && (
                        <>
                            <div className="space-y-6">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <CreditCard size={18} className="text-gray-400" />
                                    支払いカード情報
                                </label>

                                {/* Stripe Elements Mockup */}
                                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                        <span className="text-gray-300 font-mono tracking-widest">•••• •••• •••• ••••</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1 text-gray-300 font-mono">MM / YY</div>
                                        <div className="w-16 text-gray-300 font-mono text-right">CVC</div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-center text-gray-400">
                                    Secure payment powered by <b>Stripe</b>
                                </p>
                            </div>

                            <div className="space-y-3 pt-4">
                                <button
                                    onClick={handleNext}
                                    className="w-full bg-teal-600 text-white font-bold py-4 rounded-3xl hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all"
                                >
                                    確定して支払う
                                </button>
                                <button
                                    onClick={() => setStep('confirm')}
                                    className="w-full text-gray-400 font-bold py-2 text-sm"
                                >
                                    戻る
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                                <CheckCircle2 size={48} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">参加が確定しました！</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    ホストにメッセージを送って、<br />
                                    当日の待ち合わせ場所などを確認しましょう。
                                </p>
                            </div>
                            <button
                                onClick={resetAndClose}
                                className="w-full bg-teal-600 text-white font-bold py-4 rounded-3xl"
                            >
                                閉じる
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
