# Andhra Avakai - Premium Scrollytelling Website

A production-ready, single-page scrollytelling e-commerce website for Andhra Avakai pickle brand built with Next.js 14+, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🎨 **Stunning Canvas Scroll Animation** - 200-frame image sequence that brings the pickle to life
- 🎭 **Scroll-based Text Reveals** - Narrative sections that appear with smooth animations
- 🎯 **Single Product Focus** - Pure vertical scrollytelling experience
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ⚡ **Static Export Ready** - Can be deployed to Netlify, Vercel, or any static host
- 🎨 **Premium Design** - Vibrant colors, custom fonts, and smooth animations

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Canvas:** HTML5 Canvas for image sequence
- **Font:** Outfit (Google Fonts)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Build for Production

```bash
npm run build
```

This will create a static export in the `out/` directory ready for deployment.

## Project Structure

```
andhra-avakai/
├── app/
│   ├── layout.tsx          # Root layout with Outfit font
│   ├── page.tsx            # Main scrollytelling page
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Premium header with logo
│   ├── Footer.tsx          # Footer with newsletter
│   ├── ProductBottleScroll.tsx   # Canvas scroll animation
│   └── ProductTextOverlays.tsx   # Scroll-synced text reveals
├── data/
│   └── products.ts         # Product data and content
├── public/
│   └── images/
│       └── avakai/         # 200 image frames (ezgif-frame-001.jpg to 200.jpg)
└── [config files]
```

## Key Components

### ProductBottleScroll
The visual engine that loads 200 image frames and renders them on a canvas synchronized with scroll progress.

### ProductTextOverlays
Four narrative text sections that fade and slide into view as you scroll through the canvas animation.

### Navbar
Fixed header with custom SVG logo (mango + chilli) and gradient brand text.

### Footer
Dark-themed footer with brand story, navigation, and newsletter signup.

## Customization

### Colors
Edit the color palette in `tailwind.config.ts`:
- `chili` - Red tones
- `turmeric` - Yellow tones
- `sesame` - Amber tones

### Content
Update product content in `data/products.ts`:
- Sections text
- Features list
- Pricing and delivery info
- Stats and specifications

## Deployment

### Netlify Drop
Simply drag and drop the `out/` folder after running `npm run build`.

### Vercel
```bash
vercel deploy
```

### Other Static Hosts
Deploy the `out/` directory to any static hosting service.

## License

© 2026 Andhra Avakai. All rights reserved.
