"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FaUser, FaEnvelope, FaShoppingBag, FaRupeeSign,
    FaCalendarAlt, FaBox, FaCheckCircle, FaTruck, FaClock, FaBan
} from "react-icons/fa";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersByUser, Order } from "@/lib/firestore";

const STATUS_CONFIG = {
    processing: { label: "Processing", icon: FaClock, color: "text-amber-600", bg: "bg-amber-50" },
    shipped: { label: "Shipped", icon: FaTruck, color: "text-blue-600", bg: "bg-blue-50" },
    delivered: { label: "Delivered", icon: FaCheckCircle, color: "text-green-600", bg: "bg-green-50" },
    cancelled: { label: "Cancelled", icon: FaBan, color: "text-red-600", bg: "bg-red-50" },
};

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading: authLoading, logOut } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;
        const fetchOrders = async () => {
            try {
                const data = await getOrdersByUser(user.uid);
                setOrders(data);
            } catch (e) {
                console.error("Failed to fetch orders:", e);
            } finally {
                setOrdersLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="w-12 h-12 border-4 border-chili border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const memberSince = user.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
        : "—";
    const initials = (user.displayName || user.email || "U")
        .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/40 to-white pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6"
                    >
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-chili to-turmeric flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg">
                            {initials}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                {user.displayName || "Pickle Lover"}
                            </h1>
                            <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mb-4">
                                <FaEnvelope className="text-chili" />
                                {user.email}
                            </p>
                            <p className="text-sm text-gray-400 flex items-center justify-center md:justify-start gap-2">
                                <FaCalendarAlt />
                                Member since {memberSince}
                            </p>
                        </div>

                        {/* Sign Out */}
                        <button
                            onClick={async () => { await logOut(); router.push("/"); }}
                            className="px-5 py-2 text-sm font-semibold text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition-colors"
                        >
                            Sign Out
                        </button>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-3 gap-4"
                    >
                        {[
                            { icon: FaShoppingBag, label: "Total Orders", value: orders.length.toString(), color: "text-chili" },
                            { icon: FaRupeeSign, label: "Total Spent", value: `₹${totalSpent.toFixed(0)}`, color: "text-turmeric" },
                            { icon: FaUser, label: "Account", value: user.emailVerified ? "Verified" : "Unverified", color: "text-green-600" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow p-5 text-center">
                                <stat.icon className={`text-2xl mx-auto mb-2 ${stat.color}`} />
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Order History */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FaBox className="text-chili" /> Order History
                        </h2>

                        {ordersLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-10 h-10 border-4 border-chili border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow p-12 text-center">
                                <div className="text-6xl mb-4">🫙</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet!</h3>
                                <p className="text-gray-500 mb-6">Time to stock up on some authentic Andhra flavors.</p>
                                <Link href="/#heroProducts">
                                    <button className="px-8 py-3 bg-gradient-to-r from-chili to-chili-dark text-white font-semibold rounded-full shadow hover:shadow-lg transition-all">
                                        Shop Now
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order, idx) => {
                                    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing;
                                    const StatusIcon = status.icon;
                                    const date = order.createdAt?.toDate?.()
                                        ? new Date(order.createdAt.toDate()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                        : "—";

                                    return (
                                        <motion.div
                                            key={order.orderId}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.06 }}
                                            className="bg-white rounded-2xl shadow p-6"
                                        >
                                            {/* Order Header */}
                                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                                                    <p className="font-mono font-semibold text-gray-800 text-sm">{order.orderId}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400 mb-0.5">{date}</p>
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                                                        <StatusIcon className="text-xs" />
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Items */}
                                            <div className="space-y-2 mb-4">
                                                {order.items.map((item, j) => (
                                                    <div key={j} className="flex justify-between text-sm text-gray-700">
                                                        <span>{item.name} ({item.size}) × {item.quantity}</span>
                                                        <span className="font-medium">₹{(item.price * item.quantity).toFixed(0)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Totals */}
                                            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                                                <div className="text-xs text-gray-500 space-x-3">
                                                    <span>Subtotal ₹{order.subtotal?.toFixed(0)}</span>
                                                    <span>· Tax ₹{order.tax?.toFixed(0)}</span>
                                                    <span>· Ship {order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span>
                                                </div>
                                                <p className="text-lg font-bold text-chili">₹{order.total?.toFixed(0)}</p>
                                            </div>

                                            {/* Delivery Address */}
                                            {order.address && (
                                                <p className="text-xs text-gray-400 mt-2">
                                                    📍 {order.address.street}, {order.address.city}, {order.address.state} – {order.address.pincode}
                                                </p>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
        </>
    );
}
