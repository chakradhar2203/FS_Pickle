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
    // Legacy properties for backward compatibility
    stats?: { label: string; val: string }[];
    detailsSection?: { title: string; description: string; imageAlt: string };
    freshnessSection?: { title: string; description: string };
    buyNowSection?: {
        price: string;
        unit: string;
        processingParams: string[];
        deliveryPromise: string;
        returnPolicy: string;
    };
}

export const products: Product[] = [
    {
        id: "avakai",
        name: "Andhra Avakai",
        subName: "Fire. Tradition. Flavor.",
        description: "Raw mango • Stone-ground spices • Cold-pressed sesame oil",
        longDescription: "Our Avakai follows a generations-old Andhra recipe using hand-cut raw mangoes, stone-ground mustard and Guntur red chillies. The pickle matures naturally in sesame oil, developing deep, layered heat and aroma that defines true Avakai.",
        image: "/PNG_LOGO.png",
        images: ["/PNG_LOGO.png"],
        sizes: [
            { label: "250g", price: 220, weight: "250g" },
            { label: "500g", price: 420, weight: "500g" },
            { label: "1kg", price: 800, weight: "1kg" }
        ],
        inStock: true,
        category: "Mango Pickle",
        spiceLevel: 5,
        features: [
            "Sun-cured raw mango",
            "Stone-ground spices",
            "Cold-pressed gingelly oil",
            "No preservatives"
        ],
        ingredients: ["Raw Mango", "Red Chilli", "Mustard Seeds", "Sesame Oil", "Salt", "Fenugreek", "Turmeric"],
        stats: [
            { label: "Preservatives", val: "0%" },
            { label: "Oil", val: "Sesame" },
            { label: "Authenticity", val: "100%" }
        ],
        detailsSection: {
            title: "Heritage in a Jar",
            description: "Our Avakai follows a generations-old Andhra recipe using hand-cut raw mangoes, stone-ground mustard and Guntur red chillies. The pickle matures naturally in sesame oil, developing deep, layered heat and aroma that defines true Avakai.",
            imageAlt: "Avakai Pickle Close Up"
        },
        freshnessSection: {
            title: "Naturally Preserved",
            description: "No vinegar. No chemicals. Salt, oil, and time do the work. Each batch is prepared seasonally and rested to allow the spices to bloom and bind, ensuring shelf stability through tradition—not shortcuts."
        },
        buyNowSection: {
            price: "₹220",
            unit: "per 250g glass jar",
            processingParams: ["Sun Cured", "Stone Ground", "Oil Preserved"],
            deliveryPromise: "Carefully packed and shipped across India. Leak-proof glass jars.",
            returnPolicy: "Authentic taste guaranteed. Replacement available for transit damage."
        }
    },
    {
        id: "gongura",
        name: "Gongura Pickle",
        subName: "Tangy. Bold. Authentic.",
        description: "Sorrel leaves • Red chillies • Traditional spices",
        longDescription: "Gongura (sorrel leaves) pickle is a beloved Andhra delicacy known for its distinctive tangy flavor. Each batch uses fresh gongura leaves carefully sorted and mixed with hand-ground spices, creating a perfect balance of sour and spicy notes.",
        image: "/pic_logo_main_try.png",
        images: ["/pic_logo_main_try.png"],
        sizes: [
            { label: "250g", price: 240, weight: "250g" },
            { label: "500g", price: 460, weight: "500g" },
            { label: "1kg", price: 880, weight: "1kg" }
        ],
        inStock: true,
        category: "Leaf Pickle",
        spiceLevel: 4,
        features: [
            "Fresh gongura leaves",
            "Naturally tangy",
            "Rich in vitamin C",
            "Authentic Andhra recipe"
        ],
        ingredients: ["Gongura Leaves", "Red Chilli", "Garlic", "Sesame Oil", "Salt", "Fenugreek", "Mustard Seeds"]
    },
    {
        id: "tomato",
        name: "Tomato Pickle",
        subName: "Sweet. Spicy. Delicious.",
        description: "Ripe tomatoes • Aromatic spices • Sesame oil",
        longDescription: "Our tomato pickle combines the natural sweetness of ripe tomatoes with the fiery kick of Andhra spices. Slow-cooked to perfection, this pickle offers a unique flavor profile that complements any meal.",
        image: "/PNG_LOGO.png",
        images: ["/PNG_LOGO.png"],
        sizes: [
            { label: "250g", price: 200, weight: "250g" },
            { label: "500g", price: 380, weight: "500g" },
            { label: "1kg", price: 720, weight: "1kg" }
        ],
        inStock: true,
        category: "Vegetable Pickle",
        spiceLevel: 3,
        features: [
            "Ripe, fresh tomatoes",
            "Perfect sweet-spicy balance",
            "No artificial colors",
            "Naturally preserved"
        ],
        ingredients: ["Tomatoes", "Red Chilli", "Garlic", "Curry Leaves", "Sesame Oil", "Salt", "Mustard Seeds"]
    }
];

// For backward compatibility with existing single product views
export const product = products[0];
