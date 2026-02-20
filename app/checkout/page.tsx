"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import PaymentMethods from "@/components/PaymentMethods";
import { saveOrderToFirestore } from "@/lib/firestore";

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { items, totalPrice, clearCart } = useCart();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [paymentDetails, setPaymentDetails] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Redirect if not logged in
        if (!user) {
            router.push("/");
        }

        // Redirect if cart is empty
        if (items.length === 0) {
            router.push("/cart");
        }

        // Pre-fill name from user profile
        if (user?.displayName) {
            setName(user.displayName);
        }
    }, [user, items, router]);

    const TAX_RATE = 0.05;
    const SHIPPING_FEE = totalPrice > 500 ? 0 : 40;

    const subtotal = totalPrice;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + SHIPPING_FEE;

    const validateForm = () => {
        if (!name || !phone || !address || !city || !state || !pincode) {
            setError("Please fill in all shipping details");
            return false;
        }

        if (phone.length !== 10) {
            setError("Please enter a valid 10-digit phone number");
            return false;
        }

        if (pincode.length !== 6) {
            setError("Please enter a valid 6-digit pincode");
            return false;
        }

        if (paymentMethod === "card") {
            const { cardNumber, cardExpiry, cardCVV } = paymentDetails;
            if (!cardNumber || cardNumber.length < 13 || !cardExpiry || !cardCVV) {
                setError("Please enter valid card details");
                return false;
            }
        }

        if (paymentMethod === "upi" && !paymentDetails.upiId) {
            setError("Please enter a valid UPI ID");
            return false;
        }

        return true;
    };

    const handlePlaceOrder = async () => {
        setError("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate order ID
        const orderId = `ORD${Date.now()}`;

        // Save order to Firestore
        await saveOrderToFirestore({
            orderId,
            userId: user!.uid,
            items: items.map(i => ({
                productId: i.productId,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                size: i.size,
                image: i.image,
            })),
            subtotal,
            tax,
            shipping: SHIPPING_FEE,
            total,
            status: "processing",
            address: {
                name,
                phone,
                street: address,
                city,
                state,
                pincode,
            },
            createdAt: null,
        });

        // Clear cart and redirect to success page
        clearCart();
        router.push(`/order-success?orderId=${orderId}&total=${total.toFixed(2)}`);
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pt-32 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold text-gray-900 mb-8"
                    >
                        Checkout
                    </motion.h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Shipping and Payment Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-lg"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-chili focus:border-transparent"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-chili focus:border-transparent"
                                            placeholder="9876543210"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-chili focus:border-transparent"
                                            placeholder="Street address, apartment, building, floor, etc."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-chili focus:border-transparent"
                                            placeholder="Mumbai"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-chili focus:border-transparent"
                                            placeholder="Maharashtra"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                                        <input
                                            type="text"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-chili focus:border-transparent"
                                            placeholder="400001"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Payment Method */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg"
                            >
                                <PaymentMethods
                                    selectedMethod={paymentMethod}
                                    onSelectMethod={setPaymentMethod}
                                    onPaymentDetailsChange={setPaymentDetails}
                                />
                            </motion.div>
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
                                    {items.map((item) => (
                                        <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                                            <span className="text-gray-700">
                                                {item.name} ({item.size}) x {item.quantity}
                                            </span>
                                            <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal</span>
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
                                </div>

                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-chili">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-chili to-chili-dark text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Processing..." : "Place Order"}
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
