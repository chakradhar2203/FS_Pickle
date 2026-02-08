"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSeedling } from "react-icons/fa";
import { GiChiliPepper } from "react-icons/gi";
import { TbBottle } from "react-icons/tb";
import { IoTimeOutline } from "react-icons/io5";

interface FeatureDetail {
    id: string;
    title: string;
    shortDesc: string;
    longDesc: string;
    icon: React.ReactNode;
    color: string;
}

const features: FeatureDetail[] = [
    {
        id: "mango",
        title: "Raw Mango Magic",
        shortDesc: "Tangy, crisp mangoes preserved at their most potent",
        longDesc: "We source raw, unripe mangoes at the peak of their tartness, hand-cut into perfect pieces. These green gems are sun-dried to concentrate their natural acids, creating an intense sour foundation that balances perfectly with fiery spices. Each mango piece retains its firm texture, delivering that satisfying crunch with every bite.",
        icon: <FaSeedling className="w-8 h-8" />,
        color: "#F9A825"
    },
    {
        id: "chilli",
        title: "Guntur Chilli Fire",
        shortDesc: "Legendary red chillies that bring authentic Andhra heat",
        longDesc: "Guntur chillies are world-renowned for their deep red color and scorching heat. We use premium grade chillies, stone-ground to preserve their essential oils and aromatic compounds. The result is a complex, layered heat that builds gradually—warming rather than overwhelming your palate, with a subtle smoky undertone.",
        icon: <GiChiliPepper className="w-8 h-8" />,
        color: "#C62828"
    },
    {
        id: "oil",
        title: "Sesame Oil Richness",
        shortDesc: "Cold-pressed gingelly oil that carries flavor and preserves naturally",
        longDesc: "Traditional cold-pressed sesame oil (gingelly) is the heart of authentic Avakai. This golden oil doesn't just preserve—it actively enhances the pickle, carrying spice flavors deep into each mango piece. Rich in natural antioxidants, it protects the pickle while adding a distinctive nutty aroma that's quintessentially South Indian.",
        icon: <TbBottle className="w-8 h-8" />,
        color: "#D4AF37"
    },
    {
        id: "process",
        title: "Time-Honored Process",
        shortDesc: "Sun-cured and aged for weeks to develop deep, complex flavors",
        longDesc: "Great Avakai cannot be rushed. After mixing, the pickle rests for 3-4 weeks in ceramic or glass containers, allowing the ingredients to marry and mature. During this time, the spices bloom, the mangoes soften slightly while retaining their bite, and the oil penetrates every fiber. This patience creates the depth of flavor that industrial pickles can never achieve.",
        icon: <IoTimeOutline className="w-8 h-8" />,
        color: "#8B4513"
    }
];

export default function AvakaiSpecialSection() {
    const [selectedFeature, setSelectedFeature] = useState<string>("mango");

    const currentFeature = features.find(f => f.id === selectedFeature) || features[0];

    return (
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-chili/10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">What Makes Our Pickles Special</h3>

            {/* Feature Icons Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map((feature) => (
                    <button
                        key={feature.id}
                        onClick={() => setSelectedFeature(feature.id)}
                        className={`p-4 rounded-2xl transition-all duration-300 text-left ${selectedFeature === feature.id
                            ? "bg-gradient-to-br from-chili/10 to-turmeric/10 border-2 border-chili shadow-lg scale-105"
                            : "bg-gray-50 border-2 border-transparent hover:border-gray-300 hover:shadow-md"
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className={`transition-colors ${selectedFeature === feature.id ? "text-chili" : "text-gray-600"
                                    }`}
                                style={{ color: selectedFeature === feature.id ? feature.color : undefined }}
                            >
                                {feature.icon}
                            </div>
                            <h4 className={`font-semibold text-sm ${selectedFeature === feature.id ? "text-gray-900" : "text-gray-700"
                                }`}>
                                {feature.title}
                            </h4>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{feature.shortDesc}</p>
                    </button>
                ))}
            </div>

            {/* Detailed Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-l-4"
                    style={{ borderColor: currentFeature.color }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div style={{ color: currentFeature.color }}>
                            {currentFeature.icon}
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">
                            {currentFeature.title}
                        </h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        {currentFeature.longDesc}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
