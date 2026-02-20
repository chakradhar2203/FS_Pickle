"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaRegUser } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

interface NavbarProps {
    onLoginClick?: () => void;
    onRegisterClick?: () => void;
}

export default function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logOut } = useAuth();
    const { totalItems } = useCart();

    const handleLogout = async () => {
        await logOut();
        setShowUserMenu(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-[90px] md:h-[110px] backdrop-blur-xl bg-white/80 border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-center md:justify-between">
                {/* Logo Container - Expanded for better centering */}
                <Link href="/" className="flex items-center justify-center group h-full transition-all">
                    <div className="relative w-[320px] sm:w-[500px] md:w-[650px] h-[120px] sm:h-[160px] md:h-[200px] mt-2 transition-transform group-hover:scale-105">
                        <Image
                            src="/rj_header.png"
                            alt="Andhra Avakai Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-4">
                    {/* Cart Icon */}
                    <Link href="/cart" className="relative">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative p-2"
                        >
                            <FaShoppingCart className="text-2xl text-gray-700" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-chili text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </motion.button>
                    </Link>

                    {/* User Section */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chili to-turmeric flex items-center justify-center text-white font-semibold">
                                    {user.displayName?.[0] || user.email?.[0] || "U"}
                                </div>
                                <span className="hidden md:block text-gray-700 font-medium">
                                    {user.displayName || user.email?.split("@")[0]}
                                </span>
                            </button>

                            {/* User Dropdown Menu */}
                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                                    >
                                        <div className="p-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {user.displayName || "User"}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            onClick={() => setShowUserMenu(false)}
                                            className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <FaRegUser />
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                        >
                                            <FaSignOutAlt />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onLoginClick}
                                className="px-4 py-2 text-gray-700 font-semibold hover:text-chili transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={onRegisterClick}
                                className="px-6 py-3 bg-gradient-to-r from-chili to-chili-dark text-white font-semibold rounded-full hover:shadow-lg hover:shadow-chili/30 transition-all duration-300 hover:scale-105"
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
