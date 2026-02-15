"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AvakaiSpecialSection from "@/components/AvakaiSpecialSection";
import PickleCarousel from "@/components/PickleCarousel";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";
import MobileBottomSection from "@/components/MobileBottomSection";
import { Product, getProductsFromFirestore } from "@/lib/firestore";

export default function Home() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [heroProduct, setHeroProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProductsFromFirestore();
                if (data && data.length > 0) {
                    setProducts(data);
                    const avakai = data.find(p => p.id === 'avakai') || data[0];
                    setHeroProduct(avakai);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const switchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const switchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    return (
        <main className="min-h-screen bg-white">
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

            {/* Loading State */}
            {loading && (
                <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-chili/10 via-turmeric/10 to-sesame/10 pt-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-chili mx-auto mb-4"></div>
                        <p className="text-xl text-gray-600">Loading pickles...</p>
                    </div>
                </section>
            )}

            {/* Empty State — No products added by admin yet */}
            {!loading && products.length === 0 && (
                <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-chili/10 via-turmeric/10 to-sesame/10 pt-20">
                    <div className="text-center px-6">
                        <div className="text-8xl mb-6">🫙</div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">No Pickles Yet!</h2>
                        <p className="text-xl text-gray-600 max-w-md mx-auto">
                            Products will appear here once the admin adds them through the dashboard.
                        </p>
                    </div>
                </section>
            )}

            {/* Hero Section — only show when heroProduct exists */}
            {heroProduct && (
                <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-chili/10 via-turmeric/10 to-sesame/10 pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-center px-6 max-w-5xl"
                    >
                        <h1 className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-chili via-chili-dark to-turmeric bg-clip-text text-transparent leading-tight">
                            Andhra Pickles
                        </h1>
                        <p className="text-3xl md:text-5xl text-gray-700 font-light mb-8">
                            Tradition. Authenticity. Flavor.
                        </p>
                        <p className="text-xl md:text-2xl text-gray-600 mb-12">
                            Handcrafted with heritage recipes and premium ingredients
                        </p>

                        <div className="flex flex-wrap justify-center gap-8 mb-16">
                            {heroProduct.stats?.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                                    className="text-center"
                                >
                                    <div className="text-4xl font-bold text-chili mb-2">
                                        {stat.val}
                                    </div>
                                    <div className="text-sm text-gray-600 uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.a
                            href="#heroProducts"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="inline-block text-gray-500 hover:text-chili transition-colors"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-sm uppercase tracking-widest">Scroll to Explore</span>
                                <svg
                                    className="w-6 h-6 animate-bounce"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            </div>
                        </motion.a>
                    </motion.div>
                </section>
            )}

            {/* Product Carousel Section */}
            <section id="heroProducts" className="py-20 bg-gradient-to-br from-white via-orange-50/30 to-red-50/30">
                <PickleCarousel products={products} onLoginRequired={() => setShowLoginModal(true)} />
            </section>

            {/* Avakai Story Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-32 px-6 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
            >
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-chili via-chili-dark to-turmeric bg-clip-text text-transparent">
                            The Legend of Avakai
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-chili to-turmeric mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h3 className="text-3xl font-bold text-gray-900">A Culinary Heritage</h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                In the heart of Andhra Pradesh, where the sun blazes fierce and the soil runs rich with spice,
                                Avakai is more than just a pickle—it&apos;s a ritual passed down through generations. Made from raw,
                                unripe mangoes cut at their peak tartness, this legendary condiment embodies the bold spirit of
                                Telugu cuisine.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                The word &quot;Avakai&quot; itself comes from the Telugu words <span className="font-semibold text-chili">avakaya</span>,
                                meaning &quot;that which is mixed.&quot; But this humble description belies the complexity within each jar—a
                                symphony of fire, tang, and umami that awakens every sense.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <AvakaiSpecialSection />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-chili/10 to-turmeric/10 rounded-3xl p-10 text-center border-2 border-chili/20"
                    >
                        <p className="text-2xl md:text-3xl font-light text-gray-800 italic leading-relaxed">
                            &quot;Every spoonful of Avakai tells the story of Andhra—where tradition meets fearless flavor,
                            and every meal becomes a celebration.&quot;
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Details, Freshness, and Buy Now Sections — only show when heroProduct exists */}
            {heroProduct && (<>
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="py-32 px-6 bg-gradient-to-br from-gray-50 to-white"
                >
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                                Heritage in a Jar
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                {heroProduct.detailsSection?.description || heroProduct.longDescription}
                            </p>
                            <div className="bg-gradient-to-r from-turmeric/10 to-chili/10 p-6 rounded-2xl border-l-4 border-chili mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    <span className="text-chili">బాగా చూసుకో!</span> The Glass Jar Secret
                                </h3>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    In Andhra, we say <span className="font-semibold italic">&quot;మంచి సీసా పెట్టె అంటే అర్ధం వాసన ఉండదు&quot;</span> (a good glass jar means the flavor stays pure).
                                    Our pickles rest in premium, spotless glass jars — <span className="font-semibold">manta seesa</span> (crystal clear glass) that locks in the <span className="font-semibold">kaaram</span> (spice) and keeps every bite as fresh as the day it was made.
                                    No plastic, no shortcuts — just the traditional Telugu way of preserving <span className="font-semibold">pachchadi</span> that our <span className="font-semibold">ammamma</span> taught us.
                                </p>
                            </div>
                            <ul className="space-y-4">
                                {heroProduct.features?.map((feature, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                                        viewport={{ once: true }}
                                        className="flex items-center gap-3 text-lg text-gray-700"
                                    >
                                        <span className="w-2 h-2 bg-chili rounded-full"></span>
                                        {feature}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/Jar_image/Jar_image_black.jpeg"
                                alt="Traditional Glass Jar for Andhra Pickles"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </motion.section>

                {/* Freshness Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="py-32 px-6 bg-gray-900 text-white"
                >
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-turmeric to-sesame bg-clip-text text-transparent">
                            {heroProduct.freshnessSection?.title || "Naturally Preserved"}
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            {heroProduct.freshnessSection?.description || "Preserved with traditional methods"}
                        </p>
                    </div>
                </motion.section>

                {/* Buy Now Section */}
                <motion.section
                    id="buy-now"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="py-32 px-6 bg-gradient-to-br from-white via-turmeric/5 to-chili/5"
                >
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">
                                Get Your Jar
                            </h2>
                            <div className="flex items-baseline justify-center gap-2 mb-2">
                                <span className="text-5xl font-bold text-chili">
                                    {heroProduct.buyNowSection?.price || "₹220"}
                                </span>
                                <span className="text-xl text-gray-600">
                                    {heroProduct.buyNowSection?.unit || "per 250g"}
                                </span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {(heroProduct.buyNowSection?.processingParams || ["Sun Cured", "Stone Ground", "Oil Preserved"]).map((param, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-2xl p-6 shadow-lg text-center"
                                >
                                    <div className="text-4xl mb-3">
                                        {idx === 0 ? "☀️" : idx === 1 ? "🪨" : "🫙"}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">{param}</h3>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
                            <div className="space-y-4 text-gray-700">
                                <div className="flex items-start gap-3">
                                    <svg
                                        className="w-6 h-6 text-chili flex-shrink-0 mt-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <p className="text-lg">{heroProduct.buyNowSection?.deliveryPromise || "Carefully packed and shipped across India."}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <svg
                                        className="w-6 h-6 text-chili flex-shrink-0 mt-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <p className="text-lg">{heroProduct.buyNowSection?.returnPolicy || "Authentic taste guaranteed."}</p>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-6 bg-gradient-to-r from-chili to-chili-dark text-white text-2xl font-bold rounded-2xl shadow-2xl hover:shadow-chili/50 transition-all duration-300"
                        >
                            Add to Cart — {heroProduct.buyNowSection?.price || "₹220"}
                        </motion.button>
                    </div>
                </motion.section>
            </>)}

            {/* Final CTA */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-32 px-6 bg-gradient-to-br from-chili via-chili-dark to-turmeric text-white text-center"
            >
                <h2 className="text-6xl md:text-8xl font-bold mb-8">
                    Bring Andhra Home
                </h2>
                <p className="text-2xl md:text-3xl font-light mb-12 max-w-3xl mx-auto">
                    Experience the authentic taste of tradition. Every jar tells a story.
                </p>
                <motion.a
                    href="#buy-now"
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="inline-block px-12 py-6 bg-white text-chili text-xl font-bold rounded-full shadow-2xl hover:shadow-white/30 transition-all"
                >
                    Order Now
                </motion.a>
            </motion.section>

            <Footer />

            <MobileBottomSection onLoginClick={() => setShowLoginModal(true)} />
        </main>
    );
}
