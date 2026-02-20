"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Product, getProductsFromFirestore } from "@/lib/firestore";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";
import MobileBottomSection from "@/components/MobileBottomSection";
import { useAuth } from "@/contexts/AuthContext";

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();

    const categories = ["All", "Pickles", "Podis", "Snacks"];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        // Add timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            setLoading(false);
            setError("Loading timeout. Please check your internet connection and try again.");
        }, 10000); // 10 second timeout

        try {
            const data = await getProductsFromFirestore();
            clearTimeout(timeoutId);
            setProducts(data);
            setLoading(false);
        } catch (error) {
            clearTimeout(timeoutId);
            console.error("Error fetching products:", error);
            setError("Failed to load products. Please try refreshing the page.");
            setLoading(false);
        }
    };

    const getMainCategory = (category: string): string => {
        if (category.toLowerCase().includes("pickle")) return "Pickles";
        if (category.toLowerCase().includes("podi")) return "Podis";
        if (["Murukku", "Mixture", "Chegodilu", "Chakli"].includes(category)) return "Snacks";
        return "Pickles"; // default
    };

    const filteredProducts = selectedCategory === "All"
        ? products
        : products.filter(p => getMainCategory(p.category) === selectedCategory);

    const handleAddToCart = (product: Product) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        const defaultSize = product.sizes?.[0];
        if (defaultSize) {
            addToCart({
                productId: product.id,
                name: product.name,
                price: defaultSize.price,
                quantity: 1,
                size: defaultSize.label,
                image: product.image
            });
        }
    };

    const switchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const switchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
            <Navbar
                onLoginClick={() => setShowLoginModal(true)}
                onRegisterClick={() => setShowRegisterModal(true)}
            />

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={switchToRegister}
            />

            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={switchToLogin}
            />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-chili via-chili-dark to-turmeric bg-clip-text text-transparent"
                    >
                        Our Collection
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-700 mb-12"
                    >
                        Authentic Andhra flavors crafted with tradition
                    </motion.p>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {categories.map((category, idx) => (
                            <motion.button
                                key={category}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-8 py-3 rounded-full font-semibold transition-all ${selectedCategory === category
                                    ? "bg-gradient-to-r from-chili to-chili-dark text-white shadow-lg shadow-chili/30"
                                    : "bg-white text-gray-700 hover:shadow-md"
                                    }`}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="pb-20 md:pb-20 pb-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-chili mb-4"></div>
                            <p className="text-gray-600">Loading delicious products...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <div className="text-8xl mb-6">⚠️</div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h3>
                            <p className="text-xl text-gray-600 mb-8">{error}</p>
                            <button
                                onClick={fetchProducts}
                                className="px-8 py-3 bg-gradient-to-r from-chili to-chili-dark text-white rounded-full font-semibold hover:shadow-lg transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-8xl mb-6">🫙</div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">No Products Found</h3>
                            <p className="text-xl text-gray-600">
                                {selectedCategory === "All"
                                    ? "No products available yet. Check back soon!"
                                    : `No ${selectedCategory.toLowerCase()} available at the moment.`}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                                >
                                    {/* Product Image */}
                                    <div className="relative h-64 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute top-4 left-4 bg-chili text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {getMainCategory(product.category)}
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                                        {/* Spice Level */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-sm text-gray-600">Spice:</span>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`text-lg ${i < product.spiceLevel ? "text-chili" : "text-gray-300"}`}>
                                                        🌶️
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price and Action */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div>
                                                <span className="text-3xl font-bold text-chili">₹{product.sizes?.[0]?.price || 0}</span>
                                                <span className="text-gray-500 text-sm ml-2">{product.sizes?.[0]?.label}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full mt-4 bg-gradient-to-r from-chili to-chili-dark text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-chili/30 transition-all"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />

            <MobileBottomSection onLoginClick={() => setShowLoginModal(true)} />
        </main>
    );
}
