"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";
import Navbar from "@/components/Navbar";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState("");
    const [total, setTotal] = useState("");

    useEffect(() => {
        const id = searchParams.get("orderId");
        const amount = searchParams.get("total");

        if (id) setOrderId(id);
        if (amount) setTotal(amount);
    }, [searchParams]);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pt-32 pb-16 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6"
                        >
                            <FaCheckCircle className="text-6xl text-white" />
                        </motion.div>

                        {/* Success Message */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold text-gray-900 mb-4"
                        >
                            Order Placed Successfully!
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-gray-600 mb-8"
                        >
                            Thank you for your purchase! Your order has been confirmed and will be delivered soon.
                        </motion.p>

                        {/* Order Details */}
                        {orderId && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-gradient-to-br from-chili/10 to-turmeric/10 rounded-2xl p-6 mb-8"
                            >
                                <div className="grid grid-cols-2 gap-4 text-left">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Order ID</p>
                                        <p className="font-bold text-gray-900">{orderId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                        <p className="font-bold text-chili text-xl">₹{total}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                                        <p className="font-bold text-gray-900">
                                            {estimatedDelivery.toLocaleDateString("en-IN", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Additional Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-3 mb-8"
                        >
                            <p className="text-sm text-gray-600">
                                📧 Order confirmation has been sent to your email
                            </p>
                            <p className="text-sm text-gray-600">
                                📦 You will receive tracking details soon
                            </p>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/#products">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-gradient-to-r from-chili to-chili-dark text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                                >
                                    <FaShoppingBag />
                                    Continue Shopping
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-chili border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
