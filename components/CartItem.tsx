"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { CartItem as CartItemType } from "@/lib/firestore";
import QuantitySelector from "./QuantitySelector";

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (quantity: number) => void;
    onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
    const subtotal = item.price * item.quantity;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex gap-4 bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
            {/* Product Image */}
            <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                />
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <p className="text-lg font-semibold text-chili mt-1">₹{item.price}</p>
                </div>

                {/* Quantity and Remove */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onUpdateQuantity(item.quantity - 1)}
                            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            -
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.quantity + 1)}
                            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={onRemove}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        aria-label="Remove item"
                    >
                        <FaTrash size={18} />
                    </button>
                </div>
            </div>

            {/* Subtotal */}
            <div className="flex flex-col items-end justify-between">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-xl font-bold text-gray-900">₹{subtotal}</p>
            </div>
        </motion.div>
    );
};

export default CartItem;
