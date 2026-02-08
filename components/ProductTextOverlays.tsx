"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface TextSection {
    title: string;
    subtitle: string;
}

interface ProductTextOverlaysProps {
    section1: TextSection;
    section2: TextSection;
    section3: TextSection;
    section4: TextSection;
}

interface SingleSectionProps {
    section: TextSection;
    index: number;
    totalSections: number;
    scrollYProgress: any;
}

function SingleSection({ section, index, totalSections, scrollYProgress }: SingleSectionProps) {
    const start = index / totalSections;
    const end = (index + 1) / totalSections;

    const opacity = useTransform(
        scrollYProgress,
        [start, start + 0.1, end - 0.1, end],
        [0, 1, 1, 0]
    );

    const y = useTransform(
        scrollYProgress,
        [start, start + 0.1, end - 0.1, end],
        [100, 0, 0, -100]
    );

    return (
        <motion.section
            style={{ opacity, y }}
            className="min-h-screen flex items-center justify-center px-6 py-20"
        >
            <div className="max-w-5xl text-center">
                <h2 className="text-6xl md:text-8xl font-bold text-gray-900 mb-6 leading-tight">
                    {section.title}
                </h2>
                {section.subtitle && (
                    <p className="text-2xl md:text-4xl text-gray-600 font-light">
                        {section.subtitle}
                    </p>
                )}
            </div>
        </motion.section>
    );
}

export default function ProductTextOverlays({
    section1,
    section2,
    section3,
    section4,
}: ProductTextOverlaysProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const sections = [section1, section2, section3, section4];

    return (
        <div ref={containerRef} className="relative">
            {sections.map((section, index) => (
                <SingleSection
                    key={index}
                    section={section}
                    index={index}
                    totalSections={sections.length}
                    scrollYProgress={scrollYProgress}
                />
            ))}
        </div>
    );
}
