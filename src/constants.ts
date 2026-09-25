import { MotionPreset } from './types';

export const INDUSTRIES = [
  'Technology & AI',
  'Fintech & Finance',
  'Healthcare & Biotech',
  'Fashion & Apparel',
  'Food & Beverage',
  'Real Estate & Architecture',
  'Creative Studio & Media',
  'Eco & Renewable Energy',
  'Gaming & Esports',
  'Automotive & Aerospace',
  'Consulting & Services',
  'Fitness & Wellness',
];

export const LOGO_STYLES = [
  {
    id: 'modern-minimalist',
    label: 'Modern Minimalist',
    badge: 'Clean & Timeless',
    desc: 'Crisp geometry, smart negative space, balanced silhouette',
  },
  {
    id: 'tech-futuristic',
    label: 'Cyber & Futuristic',
    badge: 'Tech / AI / Web3',
    desc: 'Sleek cyber contours, luminescent lines, modern digital tech',
  },
  {
    id: 'luxury-prestige',
    label: 'Luxury & Haute Prestige',
    badge: 'High-End',
    desc: 'Sophisticated elegance, premium serif or monogram, gold/platinum tone',
  },
  {
    id: 'abstract-geometric',
    label: 'Abstract Geometric',
    badge: 'Iconic Mark',
    desc: 'Intersecting dimensional ribbons, optical harmony, pure shapes',
  },
  {
    id: 'organic-botanical',
    label: 'Organic Botanical',
    badge: 'Eco & Nature',
    desc: 'Soft hand-crafted lines, earthy curves, sustainable aesthetic',
  },
  {
    id: 'bold-typography',
    label: 'Bold Custom Wordmark',
    badge: 'Typographic',
    desc: 'Distinctive letterform ligatures, custom modern alphabet logotype',
  },
  {
    id: 'playful-mascot',
    label: 'Playful Mascot',
    badge: 'Charismatic',
    desc: 'Expressive vector character illustration, friendly and engaging',
  },
  {
    id: 'vintage-heritage',
    label: 'Vintage Heritage Emblem',
    badge: 'Artisanal Stamp',
    desc: 'Classic craft badge, detailed line engraving, timeless heritage',
  },
];

export const COLOR_PALETTES = [
  {
    id: 'electric-cyber',
    name: 'Electric Neon & Dark Indigo',
    colors: ['#06b6d4', '#6366f1', '#10b981'],
    desc: 'Tech, AI & Innovation',
  },
  {
    id: 'royal-luxury',
    name: 'Champagne Gold & Deep Obsidian',
    colors: ['#eab308', '#d97706', '#1e293b'],
    desc: 'Prestige, Real Estate, Fashion',
  },
  {
    id: 'emerald-growth',
    name: 'Forest Emerald & Mint Sage',
    colors: ['#059669', '#10b981', '#a7f3d0'],
    desc: 'Sustainability, Health, Eco',
  },
  {
    id: 'sunset-vibrant',
    name: 'Sunset Coral & Solar Amber',
    colors: ['#f43f5e', '#fb923c', '#fbbf24'],
    desc: 'Creative, Entertainment, Food',
  },
  {
    id: 'ocean-deep',
    name: 'Deep Oceanic Blues',
    colors: ['#0284c7', '#2563eb', '#1e3a8a'],
    desc: 'Corporate, Trust, Cloud',
  },
  {
    id: 'minimal-monochrome',
    name: 'Monochrome Black & Silver Slate',
    colors: ['#09090b', '#71717a', '#f4f4f5'],
    desc: 'Minimalist, Architecture, High Fashion',
  },
  {
    id: 'cosmic-purple',
    name: 'Cosmic Violet & Magenta Flare',
    colors: ['#9333ea', '#c084fc', '#ec4899'],
    desc: 'Gaming, Web3, Future Tech',
  },
  {
    id: 'custom',
    name: 'Custom Accent Colors',
    colors: ['#3b82f6', '#ec4899', '#f59e0b'],
    desc: 'Type your own hex values',
  },
];

export const SYMBOL_TYPES = [
  {
    id: 'icon-and-text',
    label: 'Combination Mark',
    desc: 'Symbol icon placed cleanly with company name typography',
  },
  {
    id: 'pure-symbol',
    label: 'Brandmark / Pure Icon',
    desc: 'Distinctive stand-alone symbol or glyph (like Apple or Nike)',
  },
  {
    id: 'monogram-lettermark',
    label: 'Monogram Lettermark',
    desc: 'Typographic crest created from initial letters (e.g. LV, IBM)',
  },
  {
    id: 'emblem-badge',
    label: 'Emblem / Crest Badge',
    desc: 'Text encased inside an ornamental seal, badge, or crest',
  },
  {
    id: 'mascot',
    label: 'Mascot Figure',
    desc: 'Illustrated character or animal representing the company',
  },
];

export const VEO_MOTION_PRESETS: MotionPreset[] = [
  {
    id: 'metallic-reveal',
    name: 'Cinematic Metallic Reveal',
    description: 'Dynamic light sweep, 3D extruded bevels, specular reflections across edges',
    prompt:
      'Cinematic 3D corporate motion graphics reveal of this logo. The logo stands as a polished brushed titanium metallic emblem. Volumetric studio spotlight sweeps across the contours with gleaming lens flares and subtle floating dust motes. Smooth camera dolly zoom with high depth of field.',
    iconName: 'Sparkles',
  },
  {
    id: 'particle-assembly',
    name: 'Cosmic Particle Coalescence',
    description: 'Swirling glowing energetic stardust particles forming the brand mark',
    prompt:
      'Magical motion animation. A swarm of brilliant luminous energy particles and golden light trails swirl dynamically from darkness, magnetically pulling together and assembling into this crisp, solid logo. A subtle shockwave pulse radiates outward upon completion.',
    iconName: 'Wand2',
  },
  {
    id: 'neon-cyber-pulse',
    name: 'Neon Cyberpunk Energy',
    description: 'Electric luminescence tracing logo lines with cyber atmosphere',
    prompt:
      'Futuristic cyberpunk animation. Electric currents and bright luminescent neon pulses surge along the strokes and curves of this logo. Dark reflective wet floor reflections underneath with subtle atmospheric blue and magenta volumetric smoke haze. Ultra sleek 60fps tech intro.',
    iconName: 'Zap',
  },
  {
    id: 'liquid-chrome-morph',
    name: 'Liquid Chrome Morphing',
    description: 'Molten liquid metal flowing and solidifying into the sharp emblem',
    prompt:
      'Photorealistic liquid mercury animation. Rippling molten chrome fluid flows smoothly into the frame, morphing effortlessly and solidifying into the precise geometric shape of this logo. Brilliant studio light reflections shimmer across the polished chrome surface.',
    iconName: 'Droplet',
  },
  {
    id: 'luxury-gold-sweep',
    name: 'Haute Luxury Gold Sweep',
    description: 'Warm golden rays and soft depth of field for prestigious brands',
    prompt:
      'Ultra luxury brand video animation. This logo rendered as a heavy embossed pure 24k gold insignia against a deep dark velvet matte background. Soft golden directional lighting rakes across the embossed beveled edges, creating rich warm glints and quiet sophisticated prestige.',
    iconName: 'Crown',
  },
  {
    id: 'flyby-3d',
    name: 'Dynamic 3D Camera Orbit',
    description: 'Fast energetic sweeping camera angle rotating around the logo',
    prompt:
      'Fast-paced dramatic commercial intro. The camera performs a dynamic close-up flyby around the 3D curves of the logo with motion blur, then snaps back into a crisp centered hero view with an elegant subtle floating idle movement. Clean corporate lighting.',
    iconName: 'Video',
  },
];

export const SAMPLE_COMPANIES = [
  {
    companyName: 'Apex Quantum',
    tagline: 'Supercomputing Beyond Limits',
    industry: 'Technology & AI',
    description:
      'Pioneering quantum computing architecture and neural algorithms for aerospace. We need a modern, ultra-precise logo featuring interconnected dimensional qubit nodes with sharp geometric lines.',
    style: 'tech-futuristic',
    colorPalette: 'electric-cyber',
    imageSize: '2K' as const,
    symbolType: 'icon-and-text',
    additionalPrompt: 'Precise geometric qubit geometry, sleek cyan and violet illumination, pure background',
  },
  {
    companyName: 'Aura Botanicals',
    tagline: 'Pure Earth. Radiant Skin.',
    industry: 'Healthcare & Biotech',
    description:
      'High-end organic skincare extracted from wild alpine plants. The logo needs an elegant, minimalist leaf or botanical silhouette intertwining with a soft morning sun drop.',
    style: 'organic-botanical',
    colorPalette: 'emerald-growth',
    imageSize: '2K' as const,
    symbolType: 'pure-symbol',
    additionalPrompt: 'Minimalist luxury aesthetic, delicate botanical line-art, balanced circular composition',
  },
  {
    companyName: 'Vanguard Monarch',
    tagline: 'Private Wealth & Sovereign Capital',
    industry: 'Fintech & Finance',
    description:
      'Boutique wealth management firm for institutional founders. We want an imposing yet refined heraldic crest or geometric falcon emblem conveying legacy, strength, and security.',
    style: 'luxury-prestige',
    colorPalette: 'royal-luxury',
    imageSize: '4K' as const,
    symbolType: 'emblem-badge',
    additionalPrompt: 'Beveled geometric falcon crest, brushed gold lines on obsidian, luxury bank aesthetic',
  },
  {
    companyName: 'Hyperion Robotics',
    tagline: 'Autonomous Industrial Fleets',
    industry: 'Automotive & Aerospace',
    description:
      'Heavy-duty autonomous electric drone cargo systems. We need an iconic, aggressive, high-speed geometric monogram letter H composed of aerodynamic carbon-fiber wings.',
    style: 'abstract-geometric',
    colorPalette: 'sunset-vibrant',
    imageSize: '1K' as const,
    symbolType: 'monogram-lettermark',
    additionalPrompt: 'Futuristic aerospace monogram H, sharp angled dynamic wings, carbon fiber accents',
  },
];
