import { type Request, type Response } from "express";
import prisma from "../lib/prisma.ts";

export type RoomCategory = "chalet" | "villa" | "penthouse" | "loft" | "dome";

export interface HostRecord {
  name: string;
  avatar: string;
  isSuperhost: boolean;
  yearsHosting: number;
  responseRate: string;
  responseTime: string;
  bio: string;
  languages: string[];
}

export interface ReviewItem {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}

export interface RoomRecord {
  id: string;
  name: string;
  category: RoomCategory;
  price: number;
  featuredImage: string;
  gallery: string[];
  size: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  bed: string;
  tagline: string;
  description: string;
  elevation: string;
  highlights: string[];
  status?: "active" | "maintenance" | "inactive";
  host?: HostRecord;
  reviews?: ReviewItem[];
  amenities: {
    title: string;
    items: string[];
  }[];
  rating: number;
  reviewsCount: number;
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
}

export interface ClassificationMeta {
  id: RoomCategory;
  label: string;
  tagline: string;
  elevation: string;
  architecture: string;
  signatureFeature: string;
  idealFor: string;
}

export interface ChaletAddon {
  id: string;
  title: string;
  description: string;
  price: number;
  perGuest?: boolean;
  category: "dining" | "wellness" | "adventure" | "concierge";
}

export const CLASSIFICATIONS_META: Record<RoomCategory, ClassificationMeta> = {
  chalet: {
    id: "chalet",
    label: "Alpine Chalets",
    tagline: "Heavy timber frame, double-height A-frame glass, local river granite hearths",
    elevation: "1,900m – 2,100m",
    architecture: "Exposed Douglas Fir, Yakisugi Wood, Hand-cut River Stone",
    signatureFeature: "Private Heated Cedar Hot Tub & Wood-Burning Granite Fireplace",
    idealFor: "Skiers, winter families, alpine hearth lovers",
  },
  villa: {
    id: "villa",
    label: "Forest & Stream Villas",
    tagline: "Expansive multi-bedroom standalone estates with secluded riverside decks",
    elevation: "1,650m – 1,800m",
    architecture: "Low-slung Modern Timber, Floor-to-Ceiling Valley Glass",
    signatureFeature: "Riverside Deck, Outdoor Chef Kitchen & Infinity Plunge Spa",
    idealFor: "Large groups, multi-gen families, extended retreats",
  },
  penthouse: {
    id: "penthouse",
    label: "Summit Penthouses",
    tagline: "Panoramic 270°–360° summit views perched high above the cloudline",
    elevation: "2,700m – 2,950m",
    architecture: "Brutalist Concrete, Bleached White Oak, Cantilevered Steel",
    signatureFeature: "Finnish Dry Cedar Sauna & Celestron Stargazing Telescope",
    idealFor: "Couples, honeymooners, panoramic summit seekers",
  },
  loft: {
    id: "loft",
    label: "Artisan Lofts",
    tagline: "Blackened industrial steel, vaulted douglas fir ceilings & mezzanine bedroom lofts",
    elevation: "2,050m – 2,200m",
    architecture: "Structural Blackened Steel, Cathedral Beams, Oak Millwork",
    signatureFeature: "Curated Vinyl Record Lounge, Ergonomic Workstation & Terrazzo Bath",
    idealFor: "Design connoisseurs, solo creatives, urban escapes",
  },
  dome: {
    id: "dome",
    label: "Celestial Eco-Domes",
    tagline: "Geodesic architectural glass canopy with zero-carbon footprint",
    elevation: "2,350m – 2,500m",
    architecture: "Geodesic Glass Hemisphere, Heated Basalt Slate, Minimal Impact",
    signatureFeature: "360° Dark-Sky Glass Canopy & Outdoor Wood-Fired Cedar Barrel Tub",
    idealFor: "Romantic stargazers, astrophotographers, eco-luxury seekers",
  },
};

export const CHALET_ADDONS: ChaletAddon[] = [
  {
    id: "smores-hearth",
    title: "Alpine Firewood & Artisan S'mores Kit",
    description: "Kiln-dried pinon firewood, gourmet single-origin chocolate, house-made marshmallows, and copper roasting skewers.",
    price: 45,
    category: "dining",
  },
  {
    id: "private-chef",
    title: "Private Chalet Chef 4-Course Dinner",
    description: "Bespoke 4-course alpine tasting menu prepared tableside by executive culinary chef with wine pairings.",
    price: 140,
    perGuest: true,
    category: "dining",
  },
  {
    id: "guided-backcountry",
    title: "Guided Alpine Backcountry Ski / Trail Tour",
    description: "Half-day private guided exploration through untouched powder glades with safety gear and hot cider.",
    price: 95,
    perGuest: true,
    category: "adventure",
  },
  {
    id: "cedar-aromatherapy",
    title: "Nordic Cedar & Botanical Bath Ritual",
    description: "Locally foraged spruce needle essential oils, epsom bath salts, and organic honey-oat body scrubs.",
    price: 65,
    category: "wellness",
  },
];

export const ROOMS_COLLECTION: RoomRecord[] = [
  {
    id: "aframe",
    name: "Architectural A-Frame Chalet",
    category: "chalet",
    price: 490,
    featuredImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    ],
    size: "1,250 sq ft",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    bed: "1 King + 2 Loft Singles",
    tagline: "Double-height glass facade & private cedar deck",
    description:
      "Our signature timber A-frame chalet overlooking the alpine pine canopy with a warm wood-burning stone stove and outdoor heated cedar jacuzzi. Designed for seamless indoor-outdoor living surrounded by Colorado pines.",
    elevation: "1,980m",
    highlights: ["Heated Cedar Tub", "Granite Stove", "Panoramic Glass", "Ski-in Access"],
    amenities: [
      {
        title: "Wellness & Bath",
        items: ["Private Heated Cedar Hot Tub", "Heated Slate Bathroom Floors", "Rainfall Showers", "Organic Herbal Toiletries"],
      },
      {
        title: "Living & Comfort",
        items: ["Wood-Burning Granite Fireplace", "Designer Italian Furniture", "Triple-Glazed Panoramic Glass", "Acoustic Insulation"],
      },
      {
        title: "Kitchen & Dining",
        items: ["Artisan Espresso Station", "Wine Cooler", "Sub-Zero Refrigerator", "Ceramic Cooktop"],
      },
    ],
    rating: 4.98,
    reviewsCount: 142,
    policies: {
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 7 days prior to arrival.",
    },
  },
  {
    id: "glacier",
    name: "Glacier Ridge Panorama Suite",
    category: "penthouse",
    price: 680,
    featuredImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    ],
    size: "1,680 sq ft",
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    bed: "2 California Kings + 1 Queen",
    tagline: "Unobstructed 270° alpine valley views from 2,800m",
    description:
      "Perched high on the summit ridge, this panoramic penthouse combines minimalist brutalist concrete with warm white oak and cashmere textiles. Floor-to-ceiling glass reveals breathtaking mountain sunrises and starry alpine nights.",
    elevation: "2,840m",
    highlights: ["270° Valley Glass", "Finnish Cedar Sauna", "Optical Telescope", "Private Balcony"],
    amenities: [
      {
        title: "Wellness & Bath",
        items: ["Finnish Dry Cedar Sauna", "Freestanding Soaking Tub", "Steam Shower", "Dyson Supersonic Amenities"],
      },
      {
        title: "Living & Comfort",
        items: ["Suspended Central Fireplace", "Bang & Olufsen Acoustic System", "Private Heated Balcony", "Telescope for Stargazing"],
      },
      {
        title: "Kitchen & Dining",
        items: ["Full Chef's Kitchen", "Miele Built-in Espresso System", "Sommelier Wine Cooler", "Private Dining Terrace"],
      },
    ],
    rating: 4.96,
    reviewsCount: 89,
    policies: {
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 14 days prior to arrival.",
    },
  },
  {
    id: "norwegian",
    name: "Nordic Haven Pine Cabin",
    category: "chalet",
    price: 360,
    featuredImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    ],
    size: "820 sq ft",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    bed: "1 King Plush Bed",
    tagline: "Secluded deep-forest retreat with outdoor wood sauna",
    description:
      "Tucked amidst ancient Douglas firs, this Scandinavian-designed sanctuary offers quiet intimacy with tactile linen, raw wood finishes, and an outdoor wood-fired sauna barrel.",
    elevation: "1,920m",
    highlights: ["Wood-fired Sauna", "Deep Forest Quiet", "Cast-Iron Stove", "Breakfast Basket"],
    amenities: [
      {
        title: "Wellness & Bath",
        items: ["Wood-fired Outdoor Sauna", "Rainfall Shower", "Nordic Bath Robes & Slippers"],
      },
      {
        title: "Living & Comfort",
        items: ["Hygge Reading Nook", "Cast-Iron Stovetop Fireplace", "Curated Vinyl Record Library"],
      },
      {
        title: "Kitchen & Dining",
        items: ["Organic Tea & Coffee Bar", "Smeg Mini Refrigerator", "Artisanal Breakfast Basket Included"],
      },
    ],
    rating: 4.92,
    reviewsCount: 64,
    policies: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 5 days prior to arrival.",
    },
  },
  {
    id: "summit",
    name: "Summit Loft Penthouse",
    category: "loft",
    price: 520,
    featuredImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    ],
    size: "1,100 sq ft",
    guests: 3,
    bedrooms: 1,
    bathrooms: 2,
    bed: "1 King + 1 Daybed",
    tagline: "Industrial elegance with cathedral timber ceilings",
    description:
      "An open-concept architectural loft merging blackened steel structural beams with warm douglas fir. Features an elevated master bedroom loft and private sun terrace.",
    elevation: "2,150m",
    highlights: ["Cathedral Beams", "Mezzanine Bedroom", "Terrazzo Tub", "Fiber Workstation"],
    amenities: [
      {
        title: "Wellness & Bath",
        items: ["Deep Terrazzo Soak Tub", "Dual Vanity Sinks", "Heated Towel Warmers"],
      },
      {
        title: "Living & Comfort",
        items: ["Cathedral Timber Beams", "Ultra-fast Fiber WiFi", "Workstation with Ergonomic Chair"],
      },
      {
        title: "Kitchen & Dining",
        items: ["Full Kitchen Island", "Nespresso Master Machine", "Designer Glassware"],
      },
    ],
    rating: 4.95,
    reviewsCount: 78,
    policies: {
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 7 days prior to arrival.",
    },
  },
  {
    id: "alpine",
    name: "Alpenrose Estate Chalet",
    category: "chalet",
    price: 850,
    featuredImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    ],
    size: "2,400 sq ft",
    guests: 8,
    bedrooms: 4,
    bathrooms: 4,
    bed: "3 Kings + 2 Twin Bunks",
    tagline: "Private ski-in ski-out luxury chalet estate",
    description:
      "Our most prestigious stand-alone chalet offering direct private ski-in/ski-out access, a heated boot room, an expansive stone hearth, and an outdoor heated infinity plunge spa.",
    elevation: "2,050m",
    highlights: ["Ski-in/Ski-out", "Infinity Plunge Spa", "Heated Boot Room", "Cinema Lounge"],
    amenities: [
      {
        title: "Wellness & Bath",
        items: ["Outdoor Infinity Plunge Spa", "Private Dry Sauna", "En-suite Bath in every bedroom"],
      },
      {
        title: "Living & Comfort",
        items: ["Heated Boot & Ski Storage Room", "Great Room Stone Hearth", "Cinema Lounge Room"],
      },
      {
        title: "Kitchen & Dining",
        items: ["Professional Gas Range", "Butler's Pantry", "10-Seat Solid Walnut Dining Table"],
      },
    ],
    rating: 4.99,
    reviewsCount: 112,
    policies: {
      checkIn: "4:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 30 days prior to arrival.",
    },
  },
  {
    id: "creekside",
    name: "Silver Creek Forest Villa",
    category: "villa",
    price: 580,
    featuredImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    ],
    size: "1,450 sq ft",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    bed: "2 King Suites",
    tagline: "Whispering mountain stream & secluded forest veranda",
    description:
      "Nestled adjacent to the glacier-fed Silver Creek, this villa features an expansive wrap-around deck where the sounds of running water echo beneath towering pines.",
    elevation: "1,720m",
    highlights: ["Stream Frontage", "Cedar Soak Tub", "Wrap-around Veranda", "Outdoor BBQ"],
    amenities: [
      {
        title: "Wellness & Bath",
        items: ["Outdoor Cedar Soaking Tub", "Floor-to-ceiling glass showers", "Aromatherapy Diffusers"],
      },
      {
        title: "Living & Comfort",
        items: ["Wrap-around Riverside Deck", "Wood Pellet Hearth", "Custom Wool Carpeting"],
      },
      {
        title: "Kitchen & Dining",
        items: ["Outdoor Built-in Grill", "Bespoke Coffee Grinder & Beans", "Full Dishwasher & Oven"],
      },
    ],
    rating: 4.94,
    reviewsCount: 57,
    policies: {
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 7 days prior to arrival.",
    },
  },
  // NEW 5 SUITES
  {
    id: "cedar-ridge",
    name: "Cedar Ridge Glass Chalet",
    category: "chalet",
    price: 540,
    featuredImage: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    ],
    size: "1,350 sq ft",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    bed: "1 King + 1 Queen Suite",
    tagline: "Double-tier cantilevered cedar deck with private sauna",
    description:
      "Crafted with western red cedar and floor-to-ceiling high-efficiency thermal glass, Cedar Ridge floats over a granite bluff, offering private sunset views over the Continental Divide.",
    elevation: "2,020m",
    highlights: ["Cantilever Deck", "Red Cedar Sauna", "Sunset Bluff View", "Stone Fireplace"],
    amenities: [
      {
        title: "Wellness & Bath",
        items: ["Private Western Red Cedar Sauna", "Outdoor Rain Shower", "Heated Terrazzo Floors"],
      },
      {
        title: "Living & Comfort",
        items: ["Suspended Gyrofocus Fireplace", "Custom Walnut Daybeds", "High-Fidelity Audio"],
      },
      {
        title: "Kitchen & Dining",
        items: ["Kitchenette with Wolf Induction", "Pour-Over Coffee Bar", "Artisan Wine Cellarette"],
      },
    ],
    rating: 4.97,
    reviewsCount: 41,
    policies: {
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 7 days prior to arrival.",
    },
  },
  {
    id: "blackstone-villa",
    name: "Blackstone Sanctuary Villa",
    category: "villa",
    price: 720,
    featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    ],
    size: "2,100 sq ft",
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    bed: "2 California Kings + 2 Twin XLs",
    tagline: "Private meadow estate with heated infinity plunge spa",
    description:
      "A secluded alpine sanctuary surrounded by wildflower meadows in summer and pristine powder in winter. Features a private heated infinity plunge spa, butler pantry, and an outdoor fire lounge.",
    elevation: "1,780m",
    highlights: ["Infinity Plunge Spa", "Private Meadow Grounds", "Butler Pantry", "Outdoor Fire Lounge"],
    amenities: [
      {
        title: "Wellness & Bath",
        items: ["Private Infinity Plunge Spa", "Steam Room with Eucalyptus Mist", "Freestanding Cast Iron Tub"],
      },
      {
        title: "Living & Comfort",
        items: ["Double-sided Stone Hearth", "Handcrafted Alpaca Throws", "Sonos Multi-Room Sound"],
      },
      {
        title: "Kitchen & Dining",
        items: ["Full Gourmet Kitchen", "Sub-Zero Wine Storage", "Outdoor Fire Table & BBQ"],
      },
    ],
    rating: 4.99,
    reviewsCount: 36,
    policies: {
      checkIn: "4:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 14 days prior to arrival.",
    },
  },
  {
    id: "aurora-penthouse",
    name: "Aurora Skycrest Penthouse",
    category: "penthouse",
    price: 940,
    featuredImage: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    ],
    size: "2,800 sq ft",
    guests: 8,
    bedrooms: 4,
    bathrooms: 4,
    bed: "3 Kings + 1 Queen Loft",
    tagline: "360° summit glass crown with private rooftop hot tub",
    description:
      "Occupying the entire apex of Summit Ridge at 2,900m, Aurora delivers 360-degree views of snowcapped mountain summits. Includes private elevator access, rooftop hot tub, and a Celestron computerized telescope.",
    elevation: "2,910m",
    highlights: ["360° Summit Crown", "Rooftop Hot Tub", "Private Elevator", "Observatory Telescope"],
    amenities: [
      {
        title: "Wellness & Bath",
        items: ["Rooftop Heated Hot Tub", "Dry Cedar Sauna", "Oversized Marble Walk-in Showers"],
      },
      {
        title: "Living & Comfort",
        items: ["Panoramic Glass Crown", "Computerized Stargazing Telescope", "Private Elevator Foyer"],
      },
      {
        title: "Kitchen & Dining",
        items: ["Full Chef's Gaggenau Suite", "Temperature Controlled Wine Room", "Private Dining Terrace"],
      },
    ],
    rating: 5.0,
    reviewsCount: 28,
    policies: {
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 30 days prior to arrival.",
    },
  },
  {
    id: "artisan-atelier",
    name: "Artisan Timber Atelier Loft",
    category: "loft",
    price: 460,
    featuredImage: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    ],
    size: "980 sq ft",
    guests: 2,
    bedrooms: 1,
    bathrooms: 2,
    bed: "1 King Platform Bed",
    tagline: "Vaulted ceilings, custom woodworking & analog sound studio",
    description:
      "Designed as an inspiring haven for creators, the Atelier features exposed hand-hewn timbers, an analog vinyl listening lounge with acoustic baffling, and a sunlit south-facing artist balcony.",
    elevation: "2,080m",
    highlights: ["Vinyl Sound Studio", "Hand-hewn Timbers", "Artist Balcony", "Oak Workstation"],
    amenities: [
      {
        title: "Wellness & Bath",
        items: ["Terrazzo Soaking Tub", "Organic Cedar Amenities", "Walk-in Rain Shower"],
      },
      {
        title: "Living & Comfort",
        items: ["Audiophile Vinyl Turntable & Library", "Herman Miller Workstation", "Cast-Iron Stovetop"],
      },
      {
        title: "Kitchen & Dining",
        items: ["Chemex & Pour-Over Bar", "Under-counter Refrigerator", "Artisanal Ceramic Tableware"],
      },
    ],
    rating: 4.96,
    reviewsCount: 33,
    policies: {
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 5 days prior to arrival.",
    },
  },
  {
    id: "celestial-dome",
    name: "Celestial Glass Geodesic Dome",
    category: "dome",
    price: 390,
    featuredImage: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    ],
    size: "650 sq ft",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    bed: "1 Plush King Bed under Starlight",
    tagline: "Heated architectural glass dome for pure night-sky immersion",
    description:
      "A geodesic glass sanctuary secluded in a high sub-alpine clearing. Guests fall asleep directly under the Milky Way with heated slate radiant flooring and an outdoor wood-fired cedar barrel soaking tub.",
    elevation: "2,420m",
    highlights: ["360° Glass Dome", "Milky Way Stargazing", "Heated Slate Floors", "Wood-fired Tub"],
    amenities: [
      {
        title: "Wellness & Bath",
        items: ["Wood-fired Cedar Soaking Barrel", "Heated Slate Radiant Floors", "Private Eco-Shower"],
      },
      {
        title: "Living & Comfort",
        items: ["Motorized Stargazing Blackout Blinds", "Down Feathers & Organic Linens", "Pellet Fireplace"],
      },
      {
        title: "Kitchen & Dining",
        items: ["Artisan Breakfast Basket Delivered Daily", "Smeg Kettle & Premium Teas", "Thermal Flasks"],
      },
    ],
    rating: 4.98,
    reviewsCount: 51,
    policies: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 7 days prior to arrival.",
    },
  },
  {
    id: "timberline",
    name: "Timberline Stone Hearth Chalet",
    category: "chalet",
    price: 420,
    featuredImage: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"],
    size: "1,180 sq ft",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    bed: "1 King + 1 Queen",
    tagline: "Warm river rock hearth and private snowy meadow deck",
    description: "Built with heavy timbers harvested from high mountain passes, featuring radiant stone hearth warmth and forest serenity.",
    elevation: "1,960m",
    highlights: ["Stone Hearth", "Meadow Deck", "Radiant Heat"],
    amenities: [{ title: "Amenities", items: ["River Rock Fireplace", "Cedar Soak Barrel", "Private Deck"] }],
    rating: 4.94,
    reviewsCount: 53,
    policies: { checkIn: "3:00 PM", checkOut: "11:00 AM", cancellation: "Free cancellation up to 7 days prior." },
  },
  {
    id: "whispering-pines",
    name: "Whispering Pines Chalet",
    category: "chalet",
    price: 460,
    featuredImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"],
    size: "1,320 sq ft",
    guests: 5,
    bedrooms: 2,
    bathrooms: 2,
    bed: "2 Kings + 1 Daybed",
    tagline: "High alpine basin sanctuary among Douglas firs",
    description: "An authentic mountain refuge tucked beneath jagged granite spires with floor-to-ceiling glass and private hot tub.",
    elevation: "2,040m",
    highlights: ["Heated Tub", "Granite Spires View", "Douglas Firs"],
    amenities: [{ title: "Amenities", items: ["Outdoor Hot Tub", "Wood Stovetop", "Pine Terrace"] }],
    rating: 4.95,
    reviewsCount: 48,
    policies: { checkIn: "3:00 PM", checkOut: "11:00 AM", cancellation: "Free cancellation up to 7 days prior." },
  },
  {
    id: "cloudline",
    name: "Cloudline Horizon Suite",
    category: "penthouse",
    price: 760,
    featuredImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"],
    size: "1,820 sq ft",
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    bed: "2 Kings + 2 Twin XLs",
    tagline: "Floating above the morning sea of alpine clouds",
    description: "Floor-to-ceiling panoramic summit suite engineered for ultimate silence and horizon sunsets above the clouds.",
    elevation: "2,780m",
    highlights: ["Above-Cloud Views", "Cantilever Glass Balcony", "Stone Soaking Tub"],
    amenities: [{ title: "Amenities", items: ["Steam Shower", "Soundproofing", "Wine Cellar"] }],
    rating: 4.97,
    reviewsCount: 39,
    policies: { checkIn: "3:00 PM", checkOut: "12:00 PM", cancellation: "Free cancellation up to 14 days prior." },
  },
  {
    id: "starlight-summit",
    name: "Starlight Peak Vista Suite",
    category: "penthouse",
    price: 810,
    featuredImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"],
    size: "2,050 sq ft",
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    bed: "3 King Suites",
    tagline: "Summit glass sanctuary with private Finnish sauna",
    description: "Perched at the highest habitable point of the reserve with unencumbered vistas of snowcapped glacial peaks.",
    elevation: "2,860m",
    highlights: ["Finnish Sauna", "Peak Views", "Heated Balcony"],
    amenities: [{ title: "Amenities", items: ["Finnish Sauna", "Stargazing Terrace", "Fireplace"] }],
    rating: 4.98,
    reviewsCount: 45,
    policies: { checkIn: "3:00 PM", checkOut: "12:00 PM", cancellation: "Free cancellation up to 14 days prior." },
  },
  {
    id: "apex-loft",
    name: "Apex Sky Suite",
    category: "penthouse",
    price: 720,
    featuredImage: "https://images.unsplash.com/photo-1502005229762-ee1b2b819eb5?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1502005229762-ee1b2b819eb5?auto=format&fit=crop&w=1200&q=80"],
    size: "1,550 sq ft",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    bed: "2 Kings",
    tagline: "Dramatic corner glass suite facing the sunset rim",
    description: "Engineered with triple-glazed acoustic glass, Italian furnishings, and an open hearth overlooking the valley basin.",
    elevation: "2,740m",
    highlights: ["Sunset Rim View", "Italian Furnishings", "Open Hearth"],
    amenities: [{ title: "Amenities", items: ["Corner Glass Facade", "Freestanding Tub", "Sommelier Bar"] }],
    rating: 4.93,
    reviewsCount: 37,
    policies: { checkIn: "3:00 PM", checkOut: "12:00 PM", cancellation: "Free cancellation up to 14 days prior." },
  },
  {
    id: "willow-brook",
    name: "Willow Brook Riverfront Villa",
    category: "villa",
    price: 610,
    featuredImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"],
    size: "1,600 sq ft",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    bed: "2 Kings + 2 Singles",
    tagline: "Direct riverside terrace with private outdoor fire pit",
    description: "Set alongside ancient willows with the gentle murmur of alpine waters right outside master bedroom suites.",
    elevation: "1,690m",
    highlights: ["Riverfront Terrace", "Outdoor Firepit", "Cedar Soak Tub"],
    amenities: [{ title: "Amenities", items: ["Riverside Fire Pit", "Heated Floors", "Chef Kitchen"] }],
    rating: 4.92,
    reviewsCount: 42,
    policies: { checkIn: "3:00 PM", checkOut: "11:00 AM", cancellation: "Free cancellation up to 7 days prior." },
  },
  {
    id: "aspen-meadow",
    name: "Aspen Meadow Estate Villa",
    category: "villa",
    price: 690,
    featuredImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"],
    size: "1,950 sq ft",
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    bed: "3 Kings + 2 Twins",
    tagline: "Private meadow surrounded by golden autumn aspens",
    description: "Expansive luxury villa featuring an outdoor stone dining pergola, wood pizza oven, and infinity hot tub.",
    elevation: "1,740m",
    highlights: ["Aspen Grove", "Pizza Oven", "Stone Pergola"],
    amenities: [{ title: "Amenities", items: ["Outdoor Wood Pizza Oven", "Infinity Tub", "Game Room"] }],
    rating: 4.96,
    reviewsCount: 49,
    policies: { checkIn: "4:00 PM", checkOut: "11:00 AM", cancellation: "Free cancellation up to 14 days prior." },
  },
  {
    id: "serenity-falls",
    name: "Serenity Cascades Stream Villa",
    category: "villa",
    price: 640,
    featuredImage: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80"],
    size: "1,700 sq ft",
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    bed: "2 Kings + 1 Queen",
    tagline: "Waterfront architecture with heated pool plunge",
    description: "Overlooking a natural glacial stream cascade, featuring floor-to-ceiling glass and private heated outdoor plunge spa.",
    elevation: "1,710m",
    highlights: ["Waterfall View", "Heated Plunge", "River Stone Bath"],
    amenities: [{ title: "Amenities", items: ["Cascades View", "Outdoor Heated Plunge", "Sauna"] }],
    rating: 4.95,
    reviewsCount: 31,
    policies: { checkIn: "3:00 PM", checkOut: "11:00 AM", cancellation: "Free cancellation up to 7 days prior." },
  },
  {
    id: "blackened-steel",
    name: "Foundry Iron & Oak Loft",
    category: "loft",
    price: 440,
    featuredImage: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1200&q=80"],
    size: "920 sq ft",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    bed: "1 King Bed",
    tagline: "Industrial ironwork meets reclaimed alpine cedar",
    description: "Open floor plan featuring factory oversized grid windows, blackened steel spiral staircase, and rooftop patio.",
    elevation: "2,060m",
    highlights: ["Grid Windows", "Spiral Staircase", "Roof Patio"],
    amenities: [{ title: "Amenities", items: ["Rooftop Patio", "Sub-Zero Bar", "Acoustic Insulation"] }],
    rating: 4.91,
    reviewsCount: 29,
    policies: { checkIn: "3:00 PM", checkOut: "11:00 AM", cancellation: "Free cancellation up to 5 days prior." },
  },
  {
    id: "copper-timber",
    name: "Copper & Timber Studio Loft",
    category: "loft",
    price: 480,
    featuredImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80"],
    size: "1,050 sq ft",
    guests: 3,
    bedrooms: 1,
    bathrooms: 2,
    bed: "1 King + 1 Mezzanine Single",
    tagline: "Hand-hammered copper soaking tub and artisan woodworking",
    description: "Crafted by local artisans featuring bespoke copper hardware, double-height ceiling, and a cozy reading alcove.",
    elevation: "2,120m",
    highlights: ["Copper Tub", "Artisan Woodworking", "Reading Alcove"],
    amenities: [{ title: "Amenities", items: ["Copper Soaking Tub", "Espresso Bar", "Fiber WiFi"] }],
    rating: 4.93,
    reviewsCount: 38,
    policies: { checkIn: "3:00 PM", checkOut: "11:00 AM", cancellation: "Free cancellation up to 7 days prior." },
  },
  {
    id: "borealis-dome",
    name: "Borealis Night Sky Dome",
    category: "dome",
    price: 430,
    featuredImage: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80"],
    size: "700 sq ft",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    bed: "1 King Bed under Sky Dome",
    tagline: "Thermal glass dome oriented toward the northern night sky",
    description: "Designed specifically for northern light displays and cosmic observation, featuring an outdoor hot cedar barrel tub.",
    elevation: "2,480m",
    highlights: ["Northern Sky View", "Hot Cedar Barrel", "Heated Floors"],
    amenities: [{ title: "Amenities", items: ["Thermal Glass Canopy", "Wood-fired Tub", "Stargazer Map"] }],
    rating: 4.97,
    reviewsCount: 44,
    policies: { checkIn: "2:00 PM", checkOut: "11:00 AM", cancellation: "Free cancellation up to 7 days prior." },
  },
  {
    id: "solitude-dome",
    name: "Solitude Pine Observatory Dome",
    category: "dome",
    price: 370,
    featuredImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80"],
    size: "620 sq ft",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    bed: "1 King Bed",
    tagline: "Complete silence in an off-grid architectural dome",
    description: "Solar-powered luxury pod immersed in sub-alpine meadows with heated goose-down linens and a morning espresso bar.",
    elevation: "2,380m",
    highlights: ["Off-grid Silence", "Solar Powered", "Goose Down Linens"],
    amenities: [{ title: "Amenities", items: ["Organic Linens", "Smeg Coffee Bar", "Radiant Heat"] }],
    rating: 4.92,
    reviewsCount: 36,
    policies: { checkIn: "2:00 PM", checkOut: "11:00 AM", cancellation: "Free cancellation up to 7 days prior." },
  },
  {
    id: "lunar-canopy",
    name: "Lunar Canopy Stargazing Dome",
    category: "dome",
    price: 410,
    featuredImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"],
    size: "680 sq ft",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    bed: "1 King Bed",
    tagline: "High ridge rim observatory dome with unobstructed horizon",
    description: "Wake up to alpine mountain sunrises and sleep beneath thousands of stars in this custom geodesic glass retreat.",
    elevation: "2,460m",
    highlights: ["Sunrise Horizon", "Geodesic Glass", "Soak Tub"],
    amenities: [{ title: "Amenities", items: ["Glass Hemisphere", "Wood Fireplace", "Terrace"] }],
    rating: 4.96,
    reviewsCount: 40,
    policies: { checkIn: "2:00 PM", checkOut: "11:00 AM", cancellation: "Free cancellation up to 7 days prior." },
  },
];

// GET /rooms - Fetch all rooms from PostgreSQL DB
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const { category, maxPrice, guests, sort, place, checkIn, checkOut, hostEmail } = req.query;

    const whereClause: any = {};

    if (hostEmail && typeof hostEmail === "string") {
      whereClause.hostEmail = hostEmail;
    }

    if (category && category !== "all") {
      whereClause.category = { equals: String(category), mode: "insensitive" };
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      whereClause.price = { lte: Number(maxPrice) };
    }

    if (guests && !isNaN(Number(guests))) {
      whereClause.guests = { gte: Number(guests) };
    }

    let rooms = await prisma.room.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // In case DB was empty, fallback gracefully
    let results: any[] = [...rooms];

    // Location / Place search
    if (place && typeof place === "string" && place.trim() !== "" && place !== "all") {
      const q = place.toLowerCase().trim();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.tagline.toLowerCase().includes(q) ||
          (r.elevation && r.elevation.toLowerCase().includes(q)) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sort === "price_asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === "rating_desc") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sort === "size_desc") {
      results.sort((a, b) => {
        const sizeA = parseInt(a.size.replace(/[^0-9]/g, ""), 10) || 0;
        const sizeB = parseInt(b.size.replace(/[^0-9]/g, ""), 10) || 0;
        return sizeB - sizeA;
      });
    }

    // Calculate nights
    let nights = 2;
    if (checkIn && checkOut) {
      const d1 = new Date(checkIn as string);
      const d2 = new Date(checkOut as string);
      const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0) nights = diff;
    }

    const enriched = results.map((r) => ({
      ...r,
      calculatedNights: nights,
      calculatedTotalPrice: r.price * nights,
      isAvailable: r.status !== "maintenance",
    }));

    return res.status(200).json({
      success: true,
      count: enriched.length,
      nights,
      data: enriched,
    });
  } catch (error: any) {
    console.error("Error in getAllRooms:", error);
    return res.status(500).json({ success: false, message: "Error fetching rooms from database" });
  }
};

// GET /rooms/classifications
export const getClassifications = async (_req: Request, res: Response) => {
  try {
    const counts = await prisma.room.groupBy({
      by: ["category"],
      _count: { category: true },
    });
    const countMap: Record<string, number> = {};
    counts.forEach((c) => {
      countMap[c.category.toLowerCase()] = c._count.category;
    });

    const metaWithCounts = Object.entries(CLASSIFICATIONS_META).map(([key, meta]) => {
      return {
        ...meta,
        count: countMap[key.toLowerCase()] || 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: metaWithCounts,
    });
  } catch (error: any) {
    console.error("Error in getClassifications:", error);
    return res.status(500).json({ success: false, message: "Error fetching classifications" });
  }
};

// GET /rooms/addons
export const getAddons = (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    count: CHALET_ADDONS.length,
    data: CHALET_ADDONS,
  });
};

// GET /rooms/:id
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "";
    const room = await prisma.room.findUnique({
      where: { id },
      include: { bookings: true },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Room with ID '${id}' not found in database`,
      });
    }

    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error: any) {
    console.error("Error in getRoomById:", error);
    return res.status(500).json({ success: false, message: "Error fetching room from database" });
  }
};

// POST /rooms/:id/reserve - Submit reservation inquiry & save to database
export const createReservationInquiry = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "";
    const { checkIn, checkOut, guests, name, email, phone, specialRequests, selectedAddons } = req.body;

    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (!checkIn || !checkOut || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking details (checkIn, checkOut, name, email)",
      });
    }

    // Calculate pricing
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffDays = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    const basePrice = room.price * diffDays;
    const cleaningFee = 120;
    const tax = Math.round(basePrice * 0.08);

    // Addons total
    let addonsTotal = 0;
    const verifiedAddons: ChaletAddon[] = [];
    if (Array.isArray(selectedAddons)) {
      for (const addonId of selectedAddons) {
        const addon = CHALET_ADDONS.find((a) => a.id === addonId);
        if (addon) {
          verifiedAddons.push(addon);
          const cost = addon.perGuest ? addon.price * (guests || 2) : addon.price;
          addonsTotal += cost;
        }
      }
    }

    const grandTotal = basePrice + cleaningFee + tax + addonsTotal;
    const confirmationNumber = "CHS-" + Math.floor(100000 + Math.random() * 900000);

    // Persist booking to Database
    const booking = await prisma.booking.create({
      data: {
        id: confirmationNumber,
        roomId: room.id,
        guestName: name,
        guestEmail: email,
        checkIn: String(checkIn),
        checkOut: String(checkOut),
        totalPrice: grandTotal,
        status: "confirmed",
        payoutStatus: "Processing",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Reservation confirmed and saved to database",
      data: {
        confirmationNumber: booking.id,
        roomId: room.id,
        roomName: room.name,
        category: room.category,
        checkIn,
        checkOut,
        nights: diffDays,
        guests: guests || 2,
        guestName: name,
        guestEmail: email,
        phone: phone || null,
        specialRequests: specialRequests || null,
        selectedAddons: verifiedAddons,
        pricing: {
          nightlyRate: room.price,
          nights: diffDays,
          baseTotal: basePrice,
          cleaningFee,
          tax,
          addonsTotal,
          grandTotal,
        },
        createdAt: booking.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error creating reservation:", error);
    return res.status(500).json({ success: false, message: "Error saving reservation to database" });
  }
};

// POST /rooms/:id/reviews - Submit review to database
export const addRoomReview = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "";
    const { author, rating, comment } = req.body;

    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found in database" });
    }

    if (!author || !rating || !comment) {
      return res.status(400).json({ success: false, message: "Author, rating, and comment are required." });
    }

    const reviews: ReviewItem[] = Array.isArray(room.reviews) ? (room.reviews as any) : [];

    const newReview: ReviewItem = {
      id: "rev-" + Date.now(),
      author: String(author).trim(),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      rating: Number(rating),
      comment: String(comment).trim(),
    };

    reviews.unshift(newReview);
    const reviewsCount = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const newRating = parseFloat((sum / reviews.length).toFixed(2));

    const updated = await prisma.room.update({
      where: { id },
      data: {
        reviews: reviews as any,
        reviewsCount,
        rating: newRating,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Review added and persisted successfully",
      data: {
        review: newReview,
        newAverageRating: updated.rating,
        newReviewsCount: updated.reviewsCount,
      },
    });
  } catch (error: any) {
    console.error("Error adding review:", error);
    return res.status(500).json({ success: false, message: "Error adding review" });
  }
};

// GET /rooms/host/metrics - Get host dashboard statistics from PostgreSQL
export const getHostMetrics = async (req: Request, res: Response) => {
  try {
    const hostEmail = typeof req.query.hostEmail === "string" ? req.query.hostEmail : "prajapatijitendra2848@gmail.com";
    const totalListings = await prisma.room.count({ where: { hostEmail } });
    const activeListings = await prisma.room.count({ where: { hostEmail, status: "active" } });
    const rooms = await prisma.room.findMany({
      where: { hostEmail },
      select: { price: true, rating: true, reviewsCount: true },
    });
    const totalReviews = rooms.reduce((sum, r) => sum + (r.reviewsCount || 0), 0);
    const avgRating = rooms.length
      ? (rooms.reduce((sum, r) => sum + r.rating, 0) / rooms.length).toFixed(2)
      : "5.0";
    const pendingInquiries = await prisma.inquiry.count({ where: { hostEmail, status: "pending" } });
    const totalEarnings = rooms.reduce((sum, r) => sum + r.price * 14, 0);

    return res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        occupancyRate: 88,
        totalListings,
        activeListings,
        totalReviews,
        averageRating: parseFloat(avgRating),
        pendingInquiries,
      },
    });
  } catch (error: any) {
    console.error("Error fetching host metrics:", error);
    return res.status(500).json({ success: false, message: "Error fetching host metrics" });
  }
};

// PATCH /rooms/:id/status - Toggle room availability (active/maintenance)
export const toggleRoomStatus = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "";
    const { status } = req.body;

    const existing = await prisma.room.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const nextStatus = status && ["active", "maintenance", "inactive"].includes(status)
      ? status
      : existing.status === "maintenance"
      ? "active"
      : "maintenance";

    const updated = await prisma.room.update({
      where: { id },
      data: { status: nextStatus },
    });

    return res.status(200).json({
      success: true,
      message: `Room status updated to ${updated.status}`,
      data: {
        id: updated.id,
        name: updated.name,
        status: updated.status,
      },
    });
  } catch (error: any) {
    console.error("Error toggling room status:", error);
    return res.status(500).json({ success: false, message: "Error updating room status in database" });
  }
};

// POST /rooms/host/new - Create a new room listing in PostgreSQL DB
export const createHostListing = async (req: Request, res: Response) => {
  try {
    const {
      name,
      category,
      price,
      size,
      guests,
      bedrooms,
      bathrooms,
      bed,
      tagline,
      description,
      featuredImage,
      gallery,
      hostEmail,
      hostName,
      amenities,
      policies,
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ success: false, message: "Name, category, and price are required." });
    }

    const email = hostEmail || "prajapatijitendra2848@gmail.com";
    const user = await prisma.user.findUnique({ where: { email } });

    const newId =
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString().slice(-4);

    const newRoom = await prisma.room.create({
      data: {
        id: newId,
        name,
        category: category || "chalet",
        price: Number(price) || 450,
        featuredImage:
          featuredImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        gallery:
          gallery && gallery.length
            ? gallery
            : [featuredImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"],
        size: size || "1,200 sq ft",
        guests: Number(guests) || 4,
        bedrooms: Number(bedrooms) || 2,
        bathrooms: Number(bathrooms) || 2,
        bed: bed || "1 King Plush Bed",
        tagline: tagline || "Custom hosted mountain accommodation",
        description: description || "Exquisite hand-crafted luxury mountain living in the Crafters'Haven Reserve.",
        elevation: "2,000m",
        highlights: ["Scenic Mountain Views", "High-speed WiFi", "Private Bath"],
        status: "active",
        amenities: amenities || [{ title: "Amenities", items: ["Private Bath", "Heated Floors", "Espresso Bar"] }],
        policies: policies || { checkIn: "3:00 PM", checkOut: "11:00 AM", cancellation: "Free cancellation up to 7 days prior." },
        hostEmail: email,
        hostName: hostName || user?.name || "Jitendra Prajapati",
        userId: user?.id || null,
        rating: 5.0,
        reviewsCount: 1,
        reviews: [],
      },
    });

    return res.status(201).json({
      success: true,
      message: "Listing created successfully in database",
      data: newRoom,
    });
  } catch (error: any) {
    console.error("Error creating host listing in DB:", error);
    return res.status(500).json({ success: false, message: "Error creating listing in database" });
  }
};

// GET /rooms/host/tasks - Get operational tasks from DB
export const getHostTasks = async (req: Request, res: Response) => {
  try {
    const hostEmail = typeof req.query.hostEmail === "string" ? req.query.hostEmail : "prajapatijitendra2848@gmail.com";
    const tasks = await prisma.task.findMany({
      where: { hostEmail },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ success: true, data: tasks });
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ success: false, message: "Error fetching tasks from DB" });
  }
};

// POST /rooms/host/tasks - Create operational task in DB
export const createHostTask = async (req: Request, res: Response) => {
  try {
    const { title, suite, priority, due, hostEmail } = req.body;
    const email = hostEmail || "prajapatijitendra2848@gmail.com";
    const task = await prisma.task.create({
      data: {
        id: "tsk-" + Date.now(),
        title,
        suite: suite || "General",
        priority: priority || "medium",
        due: due || "Today",
        completed: false,
        hostEmail: email,
      },
    });
    return res.status(201).json({ success: true, data: task });
  } catch (error: any) {
    console.error("Error creating task:", error);
    return res.status(500).json({ success: false, message: "Error creating task in DB" });
  }
};

// PATCH /rooms/host/tasks/:id - Update task status
export const updateHostTask = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "";
    const { completed, priority } = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(typeof completed === "boolean" ? { completed } : {}),
        ...(priority ? { priority } : {}),
      },
    });
    return res.status(200).json({ success: true, data: task });
  } catch (error: any) {
    console.error("Error updating task:", error);
    return res.status(500).json({ success: false, message: "Error updating task in DB" });
  }
};

// GET /rooms/host/queries - Get inquiries from DB
export const getHostQueries = async (req: Request, res: Response) => {
  try {
    const hostEmail = typeof req.query.hostEmail === "string" ? req.query.hostEmail : "prajapatijitendra2848@gmail.com";
    const queries = await prisma.inquiry.findMany({
      where: { hostEmail },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ success: true, data: queries });
  } catch (error: any) {
    console.error("Error fetching queries:", error);
    return res.status(500).json({ success: false, message: "Error fetching queries from DB" });
  }
};

// POST /rooms/host/queries/:id/reply - Reply to guest query in DB
export const replyHostQuery = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id || "";
    const { reply } = req.body;
    const query = await prisma.inquiry.update({
      where: { id },
      data: {
        reply,
        status: "resolved",
      },
    });
    return res.status(200).json({ success: true, data: query });
  } catch (error: any) {
    console.error("Error replying to query:", error);
    return res.status(500).json({ success: false, message: "Error replying to query in DB" });
  }
};

// GET /rooms/host/bookings - Get bookings from DB
export const getHostBookings = async (req: Request, res: Response) => {
  try {
    const hostEmail = typeof req.query.hostEmail === "string" ? req.query.hostEmail : "prajapatijitendra2848@gmail.com";
    const bookings = await prisma.booking.findMany({
      where: {
        room: {
          hostEmail,
        },
      },
      include: {
        room: {
          select: { name: true, category: true, featuredImage: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ success: true, data: bookings });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ success: false, message: "Error fetching bookings from DB" });
  }
};


