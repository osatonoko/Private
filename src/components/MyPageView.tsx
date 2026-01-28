"use client";

import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, auth, db } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { seedDemoData } from '@/lib/seeding';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { User, Settings, Award, History, Database, Edit2, LogOut, Save, X, Trash2, ChevronRight, Camera, MapPin } from 'lucide-react';
import ParticipationModal from './ParticipationModal';

interface UserProfile {
    displayName: string;
    bio: string;
    photoURL?: string;
    selectedArea?: string;
}

export default function MyPageView() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile>({ displayName: '', bio: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [myEvents, setMyEvents] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'organized' | 'joined'>('organized');
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isParticipationModalOpen, setIsParticipationModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchMyEvents();
        }
    }, [user, activeTab]);

    const fetchProfile = async () => {
        if (!user) return;
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                setProfile(userDoc.data() as UserProfile);
            } else {
                setProfile({ displayName: user.displayName || '', bio: '' });
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
        }
    };

    const fetchMyEvents = async () => {
        if (!user) return;
        try {
            let q;
            if (activeTab === 'organized') {
                q = query(collection(db, "events"), where("hostId", "==", user.uid), orderBy("createdAt", "desc"));
            } else {
                q = query(collection(db, "events"), where("participants", "array-contains", user.uid), orderBy("createdAt", "desc"));
            }
            const snapshot = await getDocs(q);
            setMyEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Events fetch error:", error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setSaving(true);
        try {
            const storageRef = ref(storage, `profiles/${user.uid}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setProfile(prev => ({ ...prev, photoURL: url }));
            await setDoc(doc(db, "users", user.uid), { photoURL: url }, { merge: true });
        } catch (error) {
            console.error("Upload error:", error);
            alert("アップロードに失敗しました。");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await setDoc(doc(db, "users", user.uid), {
                ...profile,
                updatedAt: new Date()
            }, { merge: true });
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("保存に失敗しました。 ");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEvent = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('このイベントを削除しますか？')) return;
        try {
            await deleteDoc(doc(db, "events", id));
            fetchMyEvents();
        } catch (e) {
            alert('削除に失敗しました。');
        }
    };

    const handleSeed = async () => {
        if (!confirm('デモデータを追加しますか？')) return;
        setSeeding(true);
        try {
            await seedDemoData();
            fetchMyEvents();
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
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-orange-50 text-orange-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            title="プロフィール編集"
                        >
                            {isEditing ? <X size={22} /> : <Edit2 size={22} />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-[32px] p-1 shadow-lg shadow-teal-100 relative">
                                <div className="w-full h-full bg-white rounded-[28px] overflow-hidden flex items-center justify-center">
                                    {profile.photoURL ? (
                                        <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-teal-600" />
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[28px] cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={24} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={profile.displayName}
                                        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                        className="w-full text-2xl font-black text-gray-800 border-b-2 border-teal-500 focus:outline-none bg-transparent"
                                        placeholder="名前を入力"
                                    />
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full w-fit border border-gray-100">
                                        <MapPin size={14} className="text-teal-500" />
                                        <select
                                            value={profile.selectedArea || '東京都'}
                                            onChange={(e) => setProfile({ ...profile, selectedArea: e.target.value })}
                                            className="bg-transparent text-xs font-bold text-gray-600 outline-none"
                                        >
                                            {['東京都', '神奈川県', '埼玉県', '千葉県', '大阪府', '京都府', '福岡県', '北海道'].map(area => (
                                                <option key={area} value={area}>{area}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-black text-gray-800 mb-1">{profile.displayName || 'ゲストユーザー'}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-teal-50 text-teal-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                                            <MapPin size={10} />
                                            {profile.selectedArea || '東京都'}
                                        </div>
                                        <p className="text-xs text-gray-400 font-bold">信頼スコア: ⭐️ 4.8</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm text-gray-600 focus:ring-2 focus:ring-teal-500 outline-none h-24 resize-none"
                                placeholder="自己紹介文を入力してください..."
                            />
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-teal-100 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {saving ? '保存中...' : 'プロフィールを保存'}
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 leading-relaxed font-medium px-1 underline decoration-teal-100 decoration-2 underline-offset-4">
                            {profile.bio || '自己紹介がまだありません。編集ボタンから追加しましょう！'}
                        </p>
                    )}
                </div>
            </div>

            {/* Stats Tags Section */}
            {!isEditing && (
                <div className="px-6 flex gap-3 mb-6 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('organized')}
                        className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 shrink-0 ${activeTab === 'organized' ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-100' : 'bg-white border-gray-100 text-gray-500'}`}
                    >
                        <Award size={16} />
                        <span className="text-xs font-bold">主催: {myEvents.length}回</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('joined')}
                        className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 shrink-0 ${activeTab === 'joined' ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-100' : 'bg-white border-gray-100 text-gray-500'}`}
                    >
                        <History size={16} />
                        <span className="text-xs font-bold">参加履歴</span>
                    </button>
                </div>
            )}

            {/* My Events Section */}
            <div className="px-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">
                        {activeTab === 'organized' ? '主催したイベント' : '参加中のイベント'}
                    </h3>
                </div>

                <div className="space-y-4">
                    {myEvents.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 text-sm font-medium">
                            イベントがありません
                        </div>
                    ) : (
                        myEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer"
                                onClick={() => {
                                    setSelectedEvent(event);
                                    setIsParticipationModalOpen(true);
                                }}
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                                    {event.imageUrl ? (
                                        <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🖼️</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-800 truncate mb-1">{event.title}</h4>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{event.category}</p>
                                        <span className="text-[10px] text-teal-600 font-bold">¥{event.price}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {activeTab === 'organized' && !isEditing && (
                                        <button
                                            onClick={(e) => handleDeleteEvent(event.id, e)}
                                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                    <ChevronRight size={18} className="text-gray-300" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Developer Section */}
            {!isEditing && (
                <div className="px-6 space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Settings</h4>
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
                                <span className="block text-[10px] text-gray-400 font-medium">サンプルを投稿して賑やかにします</span>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => auth.signOut()}
                        className="w-full bg-red-50 p-5 rounded-[32px] flex items-center gap-4 active:scale-[0.98] transition-all group"
                    >
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm">
                            <LogOut size={24} />
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-red-600">ログアウト</span>
                            <span className="block text-[10px] text-red-400 font-medium">セッションを終了して戻ります</span>
                        </div>
                    </button>
                </div>
            )}

            <div className="px-12 py-8">
                <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">MONOs App v0.1.0-alpha</p>
            </div>

            <ParticipationModal
                isOpen={isParticipationModalOpen}
                onClose={() => setIsParticipationModalOpen(false)}
                event={selectedEvent}
            />
        </div>
    );
}
