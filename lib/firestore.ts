import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    query,
    where,
    DocumentData
} from "firebase/firestore";
import { db } from "./firebase";

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
}

export interface UserCart {
    userId: string;
    items: CartItem[];
    updatedAt: any;
}

// Save cart to Firestore
export const saveCartToFirestore = async (
    userId: string,
    items: CartItem[]
): Promise<void> => {
    const cartRef = doc(db, "carts", userId);
    await setDoc(cartRef, {
        userId,
        items,
        updatedAt: serverTimestamp()
    });
};

// Get cart from Firestore
export const getCartFromFirestore = async (
    userId: string
): Promise<CartItem[]> => {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
        return cartSnap.data().items || [];
    }
    return [];
};

// Add item to cart
export const addItemToCart = async (
    userId: string,
    item: CartItem
): Promise<void> => {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
        const currentItems = cartSnap.data().items || [];
        const existingItemIndex = currentItems.findIndex(
            (i: CartItem) => i.productId === item.productId && i.size === item.size
        );

        if (existingItemIndex >= 0) {
            // Update quantity
            currentItems[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item
            currentItems.push(item);
        }

        await updateDoc(cartRef, {
            items: currentItems,
            updatedAt: serverTimestamp()
        });
    } else {
        // Create new cart
        await setDoc(cartRef, {
            userId,
            items: [item],
            updatedAt: serverTimestamp()
        });
    }
};

// Remove item from cart
export const removeItemFromCart = async (
    userId: string,
    productId: string,
    size: string
): Promise<void> => {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
        const currentItems = cartSnap.data().items || [];
        const updatedItems = currentItems.filter(
            (i: CartItem) => !(i.productId === productId && i.size === size)
        );

        await updateDoc(cartRef, {
            items: updatedItems,
            updatedAt: serverTimestamp()
        });
    }
};

// Clear cart
export const clearCart = async (userId: string): Promise<void> => {
    const cartRef = doc(db, "carts", userId);
    await setDoc(cartRef, {
        userId,
        items: [],
        updatedAt: serverTimestamp()
    });
};

// Update item quantity
export const updateItemQuantity = async (
    userId: string,
    productId: string,
    size: string,
    quantity: number
): Promise<void> => {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
        const currentItems = cartSnap.data().items || [];
        const itemIndex = currentItems.findIndex(
            (i: CartItem) => i.productId === productId && i.size === size
        );

        if (itemIndex >= 0) {
            if (quantity > 0) {
                currentItems[itemIndex].quantity = quantity;
            } else {
                currentItems.splice(itemIndex, 1);
            }

            await updateDoc(cartRef, {
                items: currentItems,
                updatedAt: serverTimestamp()
            });
        }
    }
};
