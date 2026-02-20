"use client";

import { useState } from "react";

export default function Footer() {
    const [email, setEmail] = useState("");

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Newsletter signup logic would go here
        alert(`Thank you for subscribing with: ${email}`);
        setEmail("");
    };

    return (
        <footer className="bg-gray-900 text-gray-300 pb-20 md:pb-0">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Story */}
                    <div>
                        <h3 className="text-white font-bold text-xl mb-4 bg-gradient-to-r from-chili to-turmeric bg-clip-text text-transparent">
                            Andhra Avakai
                        </h3>
                        <p className="text-sm leading-relaxed">
                            Preserving authentic Andhra pickle traditions, one jar at a time.
                            Made with love, spice, and generations of culinary wisdom.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#buy-now" className="hover:text-turmeric transition-colors">
                                    Buy Avakai
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-turmeric transition-colors">
                                    Gift Hampers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-turmeric transition-colors">
                                    Bulk Orders
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-turmeric transition-colors">
                                    Subscriptions
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-turmeric transition-colors">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-turmeric transition-colors">
                                    Shipping Info
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-turmeric transition-colors">
                                    Returns Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-turmeric transition-colors">
                                    FAQs
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Spice Notes</h4>
                        <p className="text-sm mb-4">
                            Subscribe to our newsletter for recipes, stories, and exclusive offers.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email"
                                required
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-turmeric text-white text-sm"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-gradient-to-r from-chili to-turmeric text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>&copy; 2026 Andhra Avakai. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-turmeric transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-turmeric transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
