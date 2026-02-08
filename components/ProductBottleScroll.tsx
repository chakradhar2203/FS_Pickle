"use client";

import { useEffect, useRef, useState } from "react";

interface ProductBottleScrollProps {
    totalFrames?: number;
    folderPath: string;
}

export default function ProductBottleScroll({
    totalFrames = 200,
    folderPath,
}: ProductBottleScrollProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const lastFrameRef = useRef(-1); // Cache last rendered frame

    // Preload all images
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            const frameNumber = i.toString().padStart(3, "0");
            img.src = `${folderPath}/ezgif-frame-${frameNumber}.jpg`;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalFrames) {
                    setImagesLoaded(true);
                }
            };

            loadedImages.push(img);
        }

        setImages(loadedImages);
    }, [totalFrames, folderPath]);

    // Handle canvas sizing on resize only (NOT on scroll)
    useEffect(() => {
        if (!imagesLoaded || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const updateCanvasSize = () => {
            const scale = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * scale;
            canvas.height = window.innerHeight * scale;
            ctx.scale(scale, scale);

            // Re-render current frame after resize
            lastFrameRef.current = -1; // Force re-render
        };

        // Initial sizing
        updateCanvasSize();

        // Only update on window resize, not scroll
        window.addEventListener("resize", updateCanvasSize);
        return () => window.removeEventListener("resize", updateCanvasSize);
    }, [imagesLoaded]);

    // Handle scroll-based frame rendering
    useEffect(() => {
        if (!imagesLoaded || !canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const container = containerRef.current;

        if (!ctx) return;

        // Cache canvas dimensions to avoid repeated lookups
        let canvasWidth = window.innerWidth;
        let canvasHeight = window.innerHeight;

        const render = () => {
            const rect = container.getBoundingClientRect();
            const scrollProgress = Math.max(
                0,
                Math.min(1, -rect.top / (rect.height - window.innerHeight))
            );

            const frameIndex = Math.min(
                totalFrames - 1,
                Math.floor(scrollProgress * totalFrames)
            );

            // Skip render if frame hasn't changed (frame caching)
            if (frameIndex === lastFrameRef.current) return;
            lastFrameRef.current = frameIndex;

            const img = images[frameIndex];
            if (img && img.complete) {
                // Enable smooth rendering with anti-aliasing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Calculate to cover entire viewport with no black bars
                const imgAspect = img.width / img.height;
                const canvasAspect = canvasWidth / canvasHeight;

                let drawWidth, drawHeight, offsetX, offsetY;

                // Cover: ensure image fills entire canvas, crop overflow
                if (imgAspect > canvasAspect) {
                    // Image is wider - fit to height, crop sides
                    drawHeight = canvasHeight;
                    drawWidth = drawHeight * imgAspect;
                    offsetX = (canvasWidth - drawWidth) / 2;
                    offsetY = 0;
                } else {
                    // Image is taller - fit to width, crop top/bottom
                    drawWidth = canvasWidth;
                    drawHeight = drawWidth / imgAspect;
                    offsetX = 0;
                    offsetY = (canvasHeight - drawHeight) / 2;
                }

                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        };

        const handleScroll = () => {
            requestAnimationFrame(render);
        };

        // Passive listener tells browser we won't preventDefault
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial render

        return () => window.removeEventListener("scroll", handleScroll);
    }, [images, imagesLoaded, totalFrames]);

    return (
        <div ref={containerRef} className="relative h-[500vh]">
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                {!imagesLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-chili border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white font-medium">Loading frames...</p>
                        </div>
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{
                        opacity: imagesLoaded ? 1 : 0,
                        transition: "opacity 0.5s",
                        willChange: "transform" // GPU acceleration hint
                    }}
                />
            </div>
        </div>
    );
}
