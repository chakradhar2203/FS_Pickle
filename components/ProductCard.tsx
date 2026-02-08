"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFire, FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import { Product } from "@/data/products";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

interface ProductCardProps {
    product: Product;
    onLoginRequired?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onLoginRequired }) => {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();

    const handleAddToCart = () => {
        if (!user && onLoginRequired) {
            onLoginRequired();
            return;
        }

        addToCart({
            productId: product.id,
            name: product.name,
            price: selectedSize.price,
            quantity,
            size: selectedSize.label,
            image: product.image
        });

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        setQuantity(1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
        >
            {/* Product Image */}
            <div className="relative h-80 bg-gradient-to-br from-chili/10 to-turmeric/10">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                />
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-6">
                {/* Name and Spice Level */}
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.subName}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <FaFire
                                key={i}
                                className={i < product.spiceLevel ? "text-chili" : "text-gray-300"}
                                size={14}
                            />
                        ))}
                    </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                {/* Size Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <div className="flex gap-2">
                        {product.sizes.map((size) => (
                            <button
                                key={size.label}
                                onClick={() => setSelectedSize(size)}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedSize.label === size.label
                                        ? "border-chili bg-chili/10 text-chili font-semibold"
                                        : "border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                {size.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                    <span className="text-3xl font-bold text-chili">₹{selectedSize.price}</span>
                    <span className="text-gray-500 ml-2">/ {selectedSize.weight}</span>
                </div>

                {/* Quantity Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <QuantitySelector
                        quantity={quantity}
                        onQuantityChange={setQuantity}
                        disabled={!product.inStock}
                    />
                </div>

                {/* Add to Cart Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full bg-gradient-to-r from-chili to-chili-dark text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-chili/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <FaShoppingCart />
                    {showSuccess ? "Added to Cart!" : "Add to Cart"}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
