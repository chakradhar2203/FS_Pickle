"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCreditCard, FaMobileAlt, FaMoneyBillWave } from "react-icons/fa";

interface PaymentMethod {
    id: string;
    name: string;
    icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
    { id: "cod", name: "Cash on Delivery", icon: <FaMoneyBillWave /> },
    { id: "card", name: "Credit/Debit Card", icon: <FaCreditCard /> },
    { id: "upi", name: "UPI", icon: <FaMobileAlt /> }
];

interface PaymentMethodsProps {
    selectedMethod: string;
    onSelectMethod: (method: string) => void;
    onPaymentDetailsChange: (details: any) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
    selectedMethod,
    onSelectMethod,
    onPaymentDetailsChange
}) => {
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCVV, setCardCVV] = useState("");
    const [upiId, setUpiId] = useState("");

    const handleCardNumberChange = (value: string) => {
        const formatted = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
        setCardNumber(formatted);
        onPaymentDetailsChange({ cardNumber: value.replace(/\s/g, ""), cardExpiry, cardCVV });
    };

    const handleExpiryChange = (value: string) => {
        const formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 5);
        setCardExpiry(formatted);
        onPaymentDetailsChange({ cardNumber: cardNumber.replace(/\s/g, ""), cardExpiry: value, cardCVV });
    };

    const handleCVVChange = (value: string) => {
        const formatted = value.replace(/\D/g, "").slice(0, 3);
        setCardCVV(formatted);
        onPaymentDetailsChange({ cardNumber: cardNumber.replace(/\s/g, ""), cardExpiry, cardCVV: value });
    };

    const handleUpiChange = (value: string) => {
        setUpiId(value);
        onPaymentDetailsChange({ upiId: value });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Payment Method</h3>

            {/* Payment Method Selection */}
            <div className="space-y-3">
                {paymentMethods.map((method) => (
                    <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => onSelectMethod(method.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${selectedMethod === method.id
                                ? "border-chili bg-chili/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className={`text-2xl ${selectedMethod === method.id ? "text-chili" : "text-gray-400"}`}>
                            {method.icon}
                        </div>
                        <span className={`font-semibold ${selectedMethod === method.id ? "text-chili" : "text-gray-700"}`}>
                            {method.name}
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* Payment Details Forms */}
            {selectedMethod === "card" && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 mt-6"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-chili focus:border-transparent"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => handleExpiryChange(e.target.value)}
                                placeholder="MM/YY"
                                maxLength={5}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-chili focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                                type="text"
                                value={cardCVV}
                                onChange={(e) => handleCVVChange(e.target.value)}
                                placeholder="123"
                                maxLength={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-chili focus:border-transparent"
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {selectedMethod === "upi" && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6"
                >
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                    <input
                        type="text"
                        value={upiId}
                        onChange={(e) => handleUpiChange(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-chili focus:border-transparent"
                    />
                </motion.div>
            )}

            {selectedMethod === "cod" && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl"
                >
                    <p className="text-sm text-green-800">
                        <strong>Cash on Delivery:</strong> Pay with cash when your order is delivered to your doorstep.
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default PaymentMethods;
