"use client";

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { X, Calendar, Clock, MapPin, Users, Flame, Star, BookOpen } from 'lucide-react';

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form States
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('sports');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [deadline, setDeadline] = useState('');
    const [locationName, setLocationName] = useState('');
    const [locationArea, setLocationArea] = useState('東京都');
    const [capacity, setCapacity] = useState('4');
    const [price, setPrice] = useState('0');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('初心者歓迎');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setImageUrl(url);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setError('');

        // Basic Time Validation
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);
        const limitAt = deadline ? new Date(deadline) : new Date(start.getTime() - 24 * 60 * 60 * 1000); // Default 1 day before

        if (end <= start) {
            setError('終了時間は開始時間より後に設定してください。');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "events"), {
                title,
                category,
                description,
                startAt: Timestamp.fromDate(start),
                endAt: Timestamp.fromDate(end),
                deadlineAt: Timestamp.fromDate(limitAt),
                locationName,
                locationArea,
                price: parseInt(price),
                deposit: 50, // Fixed deposit as per design
                capacity: parseInt(capacity),
                currentCount: 0,
                status: 'recruiting',
                tags,
                imageUrl,
                hostId: user.uid,
                hostName: user.displayName,
                hostAvatar: user.photoURL,
                createdAt: serverTimestamp(),
            });
            onClose();
        } catch (e) {
            console.error("Error adding document: ", e);
            setError('送信に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
            <div className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">募集を作成</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto no-scrollbar space-y-8">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-2xl font-medium animate-in fade-in slide-in-from-top-2">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Image Upload UI */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700">メイン画像</label>
                        <div className="relative group">
                            <label className={`w-full h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-[32px] cursor-pointer transition-all overflow-hidden ${imageUrl ? 'border-transparent' : 'border-gray-200 bg-gray-50 hover:bg-teal-50/50 hover:border-teal-200'}`}>
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-teal-600 mb-3 group-hover:scale-110 transition-transform">
                                            <Camera size={24} />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400">タップして画像をアップロード</p>
                                    </>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                            </label>
                            {imageUrl && (
                                <button
                                    type="button"
                                    onClick={() => setImageUrl('')}
                                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            {loading && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-[32px]">
                                    <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Genre Selector */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">カテゴリー <span className="text-red-500">*</span></label>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                            {[
                                { id: 'sports', label: 'マイナー競技', icon: '🏃' },
                                { id: 'monozukuri', label: 'ものづくり', icon: '🛠️' },
                                { id: 'boardgame', label: 'ボドゲ', icon: '🎲' },
                                { id: 'outdoor', label: 'アウトドア', icon: '🌲' },
                                { id: 'tech', label: 'テック', icon: '💻' }
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all whitespace-nowrap ${category === cat.id
                                        ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-100 scale-105'
                                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                        }`}
                                >
                                    <span className="text-base">{cat.icon}</span>
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Level Selector */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">募集レベル <span className="text-red-500">*</span></label>
                        <div className="flex gap-3">
                            {[
                                { id: '初心者歓迎', label: '初心者歓迎', icon: <BookOpen size={16} />, color: 'teal' },
                                { id: '経験者向け', label: '経験者向け', icon: <Star size={16} />, color: 'yellow' },
                                { id: 'ガチ勢のみ', label: 'ガチ勢のみ', icon: <Flame size={16} />, color: 'orange' }
                            ].map((lvl) => (
                                <button
                                    key={lvl.id}
                                    type="button"
                                    onClick={() => setLevel(lvl.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${level === lvl.id
                                        ? 'bg-teal-50 border-teal-500 text-teal-600'
                                        : 'bg-white border-gray-100 text-gray-500'
                                        }`}
                                >
                                    {lvl.icon}
                                    {lvl.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">開催日 <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">開始時刻 <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="time"
                                    required
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">終了時刻 <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="time"
                                    required
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">開催場所 (エリア名) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                required
                                placeholder="例: 代々木公園"
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">募集人数 <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-3">
                            <div className="relative w-32">
                                <input
                                    type="number"
                                    required
                                    min="2"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                />
                            </div>
                            <span className="text-sm text-gray-500">名</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">参加費 <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 underline decoration-pink-300">デポジット</label>
                            <div className="w-full bg-pink-50/50 border border-pink-100 rounded-2xl py-3.5 px-4 text-sm text-pink-600 font-bold flex items-center justify-between">
                                <span>参加証拠金</span>
                                <span>¥50</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">募集締め切り <span className="text-gray-400 font-normal">(任意: 未入力は開始24時間前)</span></label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">タイトル <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            placeholder="例: モルック体験会！"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">タグ付け <span className="text-gray-400 font-normal">(Enterで追加)</span></label>
                        <input
                            type="text"
                            placeholder="タグを入力..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag) => (
                                <span key={tag} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                    {tag}
                                    <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))}>
                                        <X size={10} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">詳細</label>
                        <textarea
                            placeholder="詳細を記入"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
                        />
                    </div>

                    <div className="space-y-2 text-center pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 text-white font-bold py-4 rounded-3xl hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all disabled:opacity-50"
                        >
                            {loading ? '送信中...' : '公開する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
