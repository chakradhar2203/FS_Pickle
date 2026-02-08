"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { CartItem, saveCartToFirestore, getCartFromFirestore } from "@/lib/firestore";

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const { user } = useAuth();
    const isLoadingRef = useRef(false);
    const loadedUserIdRef = useRef<string | null>(null);

    // Load cart when user changes (login/logout)
    useEffect(() => {
        const loadCart = async () => {
            isLoadingRef.current = true;

            try {
                if (user) {
                    // User logged in - load from Firestore
                    console.log("Loading cart from Firestore for user:", user.uid);
                    const cartItems = await getCartFromFirestore(user.uid);
                    console.log("Loaded cart items:", cartItems);
                    setItems(cartItems);
                    loadedUserIdRef.current = user.uid;
                } else {
                    // No user - load from localStorage
                    const savedCart = localStorage.getItem("guestCart");
                    if (savedCart) {
                        console.log("Loading cart from localStorage");
                        setItems(JSON.parse(savedCart));
                    } else {
                        console.log("No guest cart found");
                        setItems([]);
                    }
                    loadedUserIdRef.current = null;
                }
            } catch (error) {
                console.error("Error loading cart:", error);
            } finally {
                isLoadingRef.current = false;
            }
        };

        loadCart();
    }, [user]);

    // Save cart whenever items change (but only after cart has been loaded)
    useEffect(() => {
        // Don't save if we're currently loading
        if (isLoadingRef.current) {
            console.log("Skipping save - cart is loading");
            return;
        }

        // Don't save if the current user hasn't been loaded yet
        const currentUserId = user?.uid || null;
        if (currentUserId !== loadedUserIdRef.current) {
            console.log("Skipping save - user mismatch", { currentUserId, loadedUserId: loadedUserIdRef.current });
            return;
        }

        const saveCart = async () => {
            try {
                if (user) {
                    // Save to Firestore for logged-in users
                    console.log("Saving cart to Firestore:", items);
                    await saveCartToFirestore(user.uid, items);
                    console.log("Cart saved successfully");
                } else {
                    // Save to localStorage for guest users
                    localStorage.setItem("guestCart", JSON.stringify(items));
                    console.log("Cart saved to localStorage");
                }
            } catch (error) {
                console.error("Error saving cart:", error);
            }
        };

        saveCart();
    }, [items, user]);

    const addToCart = (item: CartItem) => {
        setItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (i) => i.productId === item.productId && i.size === item.size
            );

            if (existingItemIndex >= 0) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += item.quantity;
                return newItems;
            } else {
                return [...prevItems, item];
            }
        });
    };

    const removeFromCart = (productId: string, size: string) => {
        setItems((prevItems) =>
            prevItems.filter((item) => !(item.productId === productId && item.size === size))
        );
    };

    const updateQuantity = (productId: string, size: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId, size);
            return;
        }

        setItems((prevItems) => {
            const newItems = [...prevItems];
            const itemIndex = newItems.findIndex(
                (i) => i.productId === productId && i.size === size
            );

            if (itemIndex >= 0) {
                newItems[itemIndex].quantity = quantity;
            }

            return newItems;
        });
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const value = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
