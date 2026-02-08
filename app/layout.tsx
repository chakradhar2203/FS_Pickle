import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ChatWidget from "@/components/ChatWidget";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Sarpuri Pickles | Tradition in Every Bite",
    description: "Authentic Andhra Avakai mango pickle made with traditional recipes, sun-cured raw mangoes, and cold-pressed sesame oil.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={outfit.className}>
                <AuthProvider>
                    <CartProvider>
                        {children}
                        <ChatWidget />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
