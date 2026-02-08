"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMinus, FaPlus } from "react-icons/fa";

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    onQuantityChange,
    min = 1,
    max = 99,
    disabled = false
}) => {
    const handleDecrease = () => {
        if (quantity > min) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (quantity < max) {
            onQuantityChange(quantity + 1);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDecrease}
                disabled={disabled || quantity <= min}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
                <FaMinus className="text-gray-700" size={14} />
            </motion.button>

            <div className="w-16 text-center">
                <span className="text-xl font-bold text-gray-900">{quantity}</span>
            </div>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleIncrease}
                disabled={disabled || quantity >= max}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
                <FaPlus className="text-gray-700" size={14} />
            </motion.button>
        </div>
    );
};

export default QuantitySelector;
