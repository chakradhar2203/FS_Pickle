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
    orderBy,
    DocumentData
} from "firebase/firestore";
import { db } from "./firebase";

export interface ProductSize {
    label: string;
    price: number;
    weight: string;
}

export interface Product {
    id: string;
    name: string;
    subName: string;
    description: string;
    longDescription: string;
    image: string;
    images: string[];
    sizes: ProductSize[];
    inStock: boolean;
    category: string;
    spiceLevel: number; // 1-5
    features: string[];
    ingredients: string[];
    updatedAt?: any;
    // Legacy/optional properties for homepage display
    stats?: { label: string; val: string }[];
    detailsSection?: { title: string; description: string; imageAlt?: string };
    freshnessSection?: { title: string; description: string };
    buyNowSection?: {
        price: string;
        unit: string;
        processingParams: string[];
        deliveryPromise: string;
        returnPolicy: string;
    };
}

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

// --- Product Management ---

// Get all products from Firestore
export const getProductsFromFirestore = async (): Promise<Product[]> => {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    })) as Product[];
};

// Save or Update a product
export const saveProductToFirestore = async (product: Partial<Product> & { id: string }): Promise<void> => {
    const productRef = doc(db, "products", product.id);
    await setDoc(productRef, {
        ...product,
        updatedAt: serverTimestamp()
    }, { merge: true });
};

// Delete a product
export const deleteProductFromFirestore = async (productId: string): Promise<void> => {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
};
