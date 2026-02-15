"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Product } from "@/lib/firestore";
import ProductCard from "./ProductCard";

interface PickleCarouselProps {
    onLoginRequired?: () => void;
    products: Product[];
}

const PickleCarousel: React.FC<PickleCarouselProps> = ({ onLoginRequired, products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    };

    // Don't render anything if no products
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="relative max-w-7xl mx-auto px-6 py-16">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-chili via-chili-dark to-turmeric bg-clip-text text-transparent"
            >
                Our Premium Collection
            </motion.h2>

            {/* Desktop: Show all products in grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onLoginRequired={onLoginRequired}
                    />
                ))}
            </div>

            {/* Mobile: Show carousel */}
            <div className="md:hidden">
                <div className="relative">
                    <div className="overflow-hidden">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProductCard
                                product={products[currentIndex]}
                                onLoginRequired={onLoginRequired}
                            />
                        </motion.div>
                    </div>

                    {/* Navigation Arrows */}
                    <motion.button
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-4 hover:bg-gray-50 transition-all z-10"
                    >
                        <FaChevronLeft className="text-chili" size={24} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-4 hover:bg-gray-50 transition-all z-10"
                    >
                        <FaChevronRight className="text-chili" size={24} />
                    </motion.button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {products.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? "bg-chili w-8" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PickleCarousel;
