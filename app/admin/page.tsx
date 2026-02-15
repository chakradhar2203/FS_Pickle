"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product, getProductsFromFirestore, saveProductToFirestore, deleteProductFromFirestore } from "@/lib/firestore";
import { uploadProductImage } from "@/lib/storage";
import { auth } from "@/lib/firebase";
import { FiPlus, FiTrash2, FiUpload, FiCheckCircle, FiLoader } from "react-icons/fi";

export default function AdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<Product>>({
        id: "",
        name: "",
        subName: "",
        description: "",
        longDescription: "",
        spiceLevel: 3,
        category: "Mango Pickle",
        inStock: true,
        features: [],
        ingredients: [],
        sizes: [
            { label: "250g", price: 0, weight: "250g" },
            { label: "500g", price: 0, weight: "500g" },
            { label: "1kg", price: 0, weight: "1kg" }
        ]
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const getAuthHeaders = async () => {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            return { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
        }
        return { "Content-Type": "application/json" };
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProductsFromFirestore();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizePriceChange = (index: number, price: number) => {
        const newSizes = [...(formData.sizes || [])];
        newSizes[index].price = price;
        setFormData(prev => ({ ...prev, sizes: newSizes }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let imageUrl = formData.image || "/PNG_LOGO.png";

            if (imageFile) {
                setUploading(true);
                imageUrl = await uploadProductImage(imageFile);
                setUploading(false);
            }

            const productToSave: Product = {
                ...formData as Product,
                id: formData.id || formData.name?.toLowerCase().replace(/\s+/g, '-') || Date.now().toString(),
                image: imageUrl,
                images: [imageUrl],
                features: typeof formData.features === 'string' ? (formData.features as string).split(',').map(s => s.trim()) : formData.features || [],
                ingredients: typeof formData.ingredients === 'string' ? (formData.ingredients as string).split(',').map(s => s.trim()) : formData.ingredients || [],
            };

            await saveProductToFirestore(productToSave);
            setShowForm(false);
            setImageFile(null);
            setFormData({
                id: "",
                name: "",
                subName: "",
                description: "",
                longDescription: "",
                spiceLevel: 3,
                category: "Mango Pickle",
                inStock: true,
                features: [],
                ingredients: [],
                sizes: [
                    { label: "250g", price: 0, weight: "250g" },
                    { label: "500g", price: 0, weight: "500g" },
                    { label: "1kg", price: 0, weight: "1kg" }
                ]
            });
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product. Check console.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this pickle?")) {
            try {
                await deleteProductFromFirestore(id);
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Manage Pickles</h2>
                    <p className="text-gray-400 mt-1">Add, edit or remove products from your store.</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold transition-all shadow-lg shadow-orange-900/20"
                    >
                        <FiPlus size={20} /> Add New Pickle
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">New Pickle Details</h3>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">Cancel</button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Spicy Mango Avakai"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Sub Headline</label>
                                <input
                                    type="text"
                                    name="subName"
                                    value={formData.subName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Traditional Andhra Heat"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Short Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Raw mango • Stone-ground spices"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Long Description</label>
                                <textarea
                                    name="longDescription"
                                    value={formData.longDescription}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option>Mango Pickle</option>
                                        <option>Leaf Pickle</option>
                                        <option>Vegetable Pickle</option>
                                        <option>Garlic Pickle</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Spice Level (1-5)</label>
                                    <input
                                        type="number"
                                        name="spiceLevel"
                                        min="1"
                                        max="5"
                                        value={formData.spiceLevel}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Product Image</label>
                                <div className="border-2 border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-orange-500 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {imageFile ? (
                                        <div className="flex items-center justify-center gap-2 text-orange-500">
                                            <FiCheckCircle /> {imageFile.name}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-500">
                                            <FiUpload className="text-2xl" />
                                            <span className="text-sm">Click or drag image to upload</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-400">Pricing (₹)</label>
                                {formData.sizes?.map((size, idx) => (
                                    <div key={size.label} className="flex items-center gap-3 bg-gray-800/50 p-2 rounded-lg border border-gray-800">
                                        <span className="text-sm text-gray-400 w-12">{size.label}</span>
                                        <input
                                            type="number"
                                            value={size.price}
                                            onChange={(e) => handleSizePriceChange(idx, Number(e.target.value))}
                                            placeholder="Price"
                                            className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white text-sm focus:outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                disabled={saving || uploading}
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                            >
                                {saving ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                                {saving ? "Saving Pickle..." : "Publish Pickle"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                    <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all group">
                        <div className="h-48 bg-gray-800 relative">
                            <Image src={p.image} alt={p.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="bg-gray-950/80 p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{p.category}</span>
                            <h4 className="text-lg font-bold text-white mt-1">{p.name}</h4>
                            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{p.description}</p>
                            <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-800">
                                <span className="text-white font-bold text-lg">₹{p.sizes[0].price}+</span>
                                <span className="text-xs px-2 py-1 bg-gray-800 rounded-md text-gray-400">Spice Level: {p.spiceLevel}/5</span>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 italic">
                        <FiLoader className="animate-spin text-3xl mb-4" />
                        Loading products...
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 italic border-2 border-dashed border-gray-800 rounded-2xl">
                        No pickles found. Add your first one above!
                    </div>
                )}
            </div>
        </div>
    );
}
