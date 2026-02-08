"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    logOut as authLogOut
} from "@/lib/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    googleSignIn: () => Promise<void>;
    logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signUp = async (email: string, password: string, displayName: string) => {
        await signUpWithEmail(email, password, displayName);
        // Sign out the user immediately so they must verify email before logging in
        await authLogOut();
    };

    const signIn = async (email: string, password: string) => {
        const result = await signInWithEmail(email, password);

        // Check if email is verified
        if (!result.user.emailVerified) {
            // Sign out the user since they shouldn't be logged in
            await authLogOut();
            throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
        }
    };

    const googleSignIn = async () => {
        await signInWithGoogle();
    };

    const logOut = async () => {
        await authLogOut();
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        googleSignIn,
        logOut
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
