"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import CartItem from "@/components/CartItem";

export default function CartPage() {
    const { user } = useAuth();
    const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

    const TAX_RATE = 0.05; // 5% tax
    const SHIPPING_FEE = totalPrice > 500 ? 0 : 40; // Free shipping above ₹500

    const subtotal = totalPrice;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + SHIPPING_FEE;

    // Empty cart state
    if (items.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pt-32 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto text-center"
                    >
                        <div className="bg-white rounded-3xl p-12 shadow-2xl">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-chili/20 to-turmeric/20 rounded-full flex items-center justify-center mb-6">
                                <FaShoppingBag className="text-6xl text-chili" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Looks like you haven't added any delicious pickles to your cart yet!
                            </p>
                            <Link href="/#products">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-gradient-to-r from-chili to-chili-dark text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                                >
                                    Continue Shopping
                                    <FaArrowRight />
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pt-32 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold text-gray-900 mb-8"
                    >
                        Shopping Cart
                    </motion.h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {items.map((item) => (
                                    <CartItem
                                        key={`${item.productId}-${item.size}`}
                                        item={item}
                                        onUpdateQuantity={(quantity) =>
                                            updateQuantity(item.productId, item.size, quantity)
                                        }
                                        onRemove={() => removeFromCart(item.productId, item.size)}
                                    />
                                ))}
                            </AnimatePresence>

                            {/* Continue Shopping Link */}
                            <Link href="/#products">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    className="w-full py-3 border-2 border-chili text-chili font-semibold rounded-xl hover:bg-chili hover:text-white transition-all"
                                >
                                    Continue Shopping
                                </motion.button>
                            </Link>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-xl sticky top-32"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Tax (5%)</span>
                                        <span className="font-semibold">₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Shipping</span>
                                        <span className="font-semibold">
                                            {SHIPPING_FEE === 0 ? "FREE" : `₹${SHIPPING_FEE}`}
                                        </span>
                                    </div>
                                    {subtotal < 500 && (
                                        <p className="text-sm text-green-600">
                                            Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
                                        </p>
                                    )}
                                </div>

                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-chili">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {user ? (
                                    <Link href="/checkout">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full py-4 bg-gradient-to-r from-chili to-chili-dark text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                        >
                                            Proceed to Checkout
                                        </motion.button>
                                    </Link>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-3">Please login to checkout</p>
                                        <button
                                            onClick={() => window.location.href = "/#products"}
                                            className="w-full py-4 bg-gray-300 text-gray-600 font-bold rounded-xl cursor-not-allowed"
                                            disabled
                                        >
                                            Login Required
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
