"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    HiOutlineHome,
    HiOutlineShoppingBag,
    HiOutlineHeart,
    HiOutlineUser,
    HiOutlineChatBubbleLeftRight
} from "react-icons/hi2";
import { useAuth } from "@/contexts/AuthContext";

interface MobileBottomSectionProps {
    onLoginClick?: () => void;
}

export default function MobileBottomSection({ onLoginClick }: MobileBottomSectionProps) {
    const router = useRouter();
    const { user } = useAuth();

    const sections = [
        { icon: HiOutlineHome, label: "Home", href: "/", color: "text-chili" },
        { icon: HiOutlineShoppingBag, label: "Shop", href: "/shop", color: "text-turmeric" },
        { icon: HiOutlineHeart, label: "Favorites", href: "#", color: "text-red-500", requiresAuth: true },
        { icon: HiOutlineChatBubbleLeftRight, label: "Chat", href: "#", color: "text-green-600" },
        { icon: HiOutlineUser, label: "Account", href: "/profile", color: "text-gray-700", requiresAuth: true },
    ];

    const handleClick = (section: typeof sections[0]) => {
        if (section.requiresAuth && !user) {
            // Not logged in → open login modal
            onLoginClick?.();
        } else {
            // Logged in (or no auth required) → navigate
            router.push(section.href);
        }
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50"
        >
            <div className="grid grid-cols-5 gap-1 px-2 py-3">
                {sections.map((section, idx) => {
                    const Icon = section.icon;
                    return (
                        <motion.button
                            key={idx}
                            onClick={() => handleClick(section)}
                            whileTap={{ scale: 0.9 }}
                            className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Icon className={`w-6 h-6 ${section.color} stroke-[1.5]`} />
                            <span className="text-xs text-gray-600 font-medium">
                                {section.label}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}
