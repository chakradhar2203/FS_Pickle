"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FaGoogle, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { signIn, googleSignIn, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get("redirect") || "/";

    useEffect(() => {
        if (user) {
            router.push(redirectPath);
        }
    }, [user, router, redirectPath]);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signIn(email, password);
            // Router push handled by useEffect
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);
        try {
            await googleSignIn();
            // Router push handled by useEffect
        } catch (err: any) {
            setError(err.message || "Failed to sign in with Google");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative background flare */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/20 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-600/20 blur-3xl rounded-full"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400 mb-8">Sign in to access the dashboard</p>

                    {error && (
                        <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                    placeholder="admin@avakai.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : <>Sign In <FaArrowRight size={14} /></>}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-900 px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full bg-gray-800 border border-gray-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-700 transition-all disabled:opacity-50"
                    >
                        <FaGoogle className="text-red-500" />
                        Google Account
                    </button>

                    <p className="mt-8 text-center text-gray-500 text-sm">
                        Don't have an account?{" "}
                        <button
                            onClick={handleGoogleSignIn}
                            className="text-orange-500 hover:underline font-semibold"
                        >
                            Sign in with Google
                        </button>
                        {" "}or{" "}
                        <Link href="/" className="text-gray-400 hover:underline">
                            Return Home to Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
