"use client";

import React from 'react';
import { signInWithRedirect, GoogleAuthProvider, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginView() {
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            // モバイルブラウザの仕様（ITP等）によるエラーを防ぐため、リダイレクト方式を使用します
            await signInWithRedirect(auth, provider);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    // リダイレクト後の結果を確認
    React.useEffect(() => {
        getRedirectResult(auth).catch((error) => {
            console.error("Redirect login error:", error);
        });
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-100 p-4">
            {/* Background Section with Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-br from-teal-400 via-blue-500 to-blue-600 rounded-b-[40px] z-0" />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center">
                {/* App Icon */}
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                    <svg
                        className="w-10 h-10 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">MONOs</h1>
                <p className="text-gray-500 mb-10 text-sm">小さな出会いから、大きな熱狂を。</p>

                {/* Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm mb-4"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="w-6 h-6"
                    />
                    <span className="text-gray-700 font-medium">Googleでログイン</span>
                </button>

                {/* Footer Link */}
                <p className="text-gray-400 text-xs">
                    利用規約に同意したものとみなします
                </p>
            </div>
        </div>
    );
}
