import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                chili: {
                    DEFAULT: '#C62828',
                    dark: '#8E0000',
                },
                turmeric: {
                    DEFAULT: '#F9A825',
                    light: '#FBC02D',
                },
                sesame: {
                    DEFAULT: '#D4A574',
                    dark: '#B8860B',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'spice-gradient': 'linear-gradient(135deg, #C62828 0%, #F9A825 100%)',
            },
        },
    },
    plugins: [],
};

export default config;
