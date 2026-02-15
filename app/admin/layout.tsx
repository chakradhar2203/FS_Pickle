"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

// Admin email allowlist (must match ADMIN_EMAILS in .env.local)
const ADMIN_EMAILS = ["chakradhart22@gmail.com"];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Check if the user's email is in the admin allowlist
                const userEmail = user.email?.toLowerCase() || "";
                if (ADMIN_EMAILS.includes(userEmail)) {
                    setAuthenticated(true);
                    setIsAdmin(true);
                } else {
                    setAuthenticated(true);
                    setIsAdmin(false);
                }
            } else {
                router.push("/login?redirect=/admin");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (authenticated && !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <div className="max-w-md text-center p-8 bg-gray-900 border border-gray-800 rounded-3xl">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-gray-400 mb-6">
                        You don&apos;t have admin privileges. Only authorized administrators can access this page.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        );
    }

    if (!authenticated) {
        return null; // Redirecting to login
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
            <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                        Andhra Avakai Admin
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-green-400 bg-green-900/30 px-3 py-1 rounded-full">
                            ✅ Admin
                        </span>
                        <button
                            onClick={() => auth.signOut()}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
