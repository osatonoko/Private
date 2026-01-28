"use client";

import { useAuth } from "@/lib/useAuth";
import LoginView from "@/components/LoginView";
import HomeView from "@/components/HomeView";
import SearchView from "@/components/SearchView";
import TalkView from "@/components/TalkView";
import MyPageView from "@/components/MyPageView";
import CreateEventModal from "@/components/CreateEventModal";
import { useState } from "react";
import { Plus, Home, Search, MessageCircle, User } from "lucide-react";

export default function Page() {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (currentTab) {
      case 'home': return <HomeView onOpenCreateModal={() => setIsModalOpen(true)} />;
      case 'search': return <SearchView />;
      case 'talk': return <TalkView />;
      case 'profile': return <MyPageView />;
      default: return <HomeView onOpenCreateModal={() => setIsModalOpen(true)} />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {renderView()}

      {/* Floating Action Button (Only on Home/Search) */}
      {(currentTab === 'home' || currentTab === 'search') && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-28 right-6 w-16 h-16 bg-gradient-to-tr from-pink-500 to-rose-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-200 active:scale-90 transition-transform z-30"
        >
          <Plus size={32} />
        </button>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center h-20 px-4 z-40">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'home' ? 'text-teal-600' : 'text-gray-400'}`}
        >
          <Home size={24} />
          <span className="text-[10px] font-bold">ホーム</span>
        </button>
        <button
          onClick={() => setCurrentTab('search')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'search' ? 'text-teal-600' : 'text-gray-400'}`}
        >
          <Search size={24} />
          <span className="text-[10px] font-medium">さがす</span>
        </button>
        <button
          onClick={() => setCurrentTab('talk')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'talk' ? 'text-teal-600' : 'text-gray-400'}`}
        >
          <MessageCircle size={24} />
          <span className="text-[10px] font-medium">トーク</span>
        </button>
        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'profile' ? 'text-teal-600' : 'text-gray-400'}`}
        >
          <User size={24} />
          <span className="text-[10px] font-medium">マイページ</span>
        </button>
      </nav>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
