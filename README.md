# Crafters'Haven Reserve — High Mountain Alpine Sanctuary

> An architectural alpine retreat and hotel management platform designed with luxury aesthetics, micro-interactions, responsive precision, and performance.

---

## 🏔️ 1. Project Overview & Design Philosophy

**Crafters'Haven Reserve** is a full-stack hospitality platform tailored for luxury high-elevation mountain chalets, summit penthouses, celestial domes, and forest villas. The application draws inspiration from the editorial luxury of architectural monographs and the world-class booking experience of Airbnb.

### Curated Color System

The user interface adheres strictly to a cohesive, warm editorial palette designed to evoke alpine snowscapes, warmed cedar hearths, and minimalist architectural stone:

| Token Name            | Hex Code  | HSL / Visual Role           | Usage in Interface                                |
| :-------------------- | :-------- | :-------------------------- | :------------------------------------------------ |
| **Brand Canvas / BG** | `#FFF5F5` | Soft Warm Blush             | Root page background, full-screen canvas          |
| **Brand Peach**       | `#F7D6D0` | Soft Pastel Peach           | Badges, date range highlights, subtle hover fills |
| **Brand Rose**        | `#E2B4BD` | Dusty Rose / Mauve          | Borders, active focus rings, wishlist accents     |
| **Brand Charcoal**    | `#4A4A4A` | Deep Architectural Charcoal | Primary typography, headers, primary CTA buttons  |
| **Brand White**       | `#FFFFFF` | Crisp Pure White            | Card surfaces, reservation widgets, modals        |

### Typography Hierarchy

- **Headings & Hero**: `Syne` (Geometric, avant-garde, high-contrast serif/sans mix) — provides an authoritative editorial feel.
- **Body & Numerical Data**: `Inter` / System Sans (`cv02`, `cv03`, `cv04`, `cv11` enabled) — ensures maximum tabular legibility for prices, dates, elevation numbers, and coordinates.

### Elevation & Micro-Interactions

- **Depth & Elevation**: Layered with subtle borders (`border-[#E2B4BD]/40`) paired with diffuse ambient shadows (`shadow-[0_4px_20px_rgba(74,74,74,0.06)]`) rather than heavy dark shadows.
- **Directional Fluidity**: Category tab switches trigger directional flow animations (`animate-flow-right` / `animate-flow-left`) indicating tab velocity.
- **Tactile Feedback**: Interactive buttons utilize `active:scale-95` / `active:scale-[0.98]` physical compression for tactile touch and mouse responsiveness.

---

## 🌟 2. Core Features & Capabilities

### 🔍 1. Interactive Exploration & Search Engine

- **Destination Selector**: Global mountain peaks (Zermatt, Grindelwald, Chamonix, Cortina, Tromsø, Manali, Aspen, Banff).
- **Interactive Date Picker**: Custom range calendar ([Calendar.tsx](client/src/components/Calendar.tsx)) with check-in and check-out highlights, minimum-night logic, and smooth transitions.
- **Airbnb-Grade Guest Popover**: Granular breakdown of Adults (13+), Children (2–12), and Infants (<2) with intuitive `+` and `–` stepper counters.
- **URL Synchronization**: Live two-way binding of search filters with URL search params (`?place=...&checkIn=...&guests=...`).

### 🏷️ 2. Architectural Classification Taxonomy

Rooms are classified by architectural elevation and structural style:

- **Alpine Chalets** (1,900m–2,100m): Heavy timber frames, double-height A-frame glass, river granite hearths.
- **Summit Penthouses** (2,700m–2,950m): Cantilevered brutalist concrete, Finnish cedar saunas, Celestron telescopes.
- **Forest & Stream Villas** (1,650m–1,800m): Riverside decks, outdoor chef kitchens, infinity plunge spas.
- **Artisan Lofts** (2,050m–2,200m): Blackened steel, cathedral douglas fir beams, vinyl record lounges.
- **Celestial Eco-Domes** (2,350m–2,500m): Geodesic dark-sky glass canopies, zero-carbon heated basalt floors.

### 🖼️ 3. Listing Card Micro-Carousel

- Cards in the browse feed feature an in-place multi-photo carousel with left/right navigation arrows on hover and pagination indicator dots, allowing guests to preview all room photography without leaving the feed.

### 🏡 4. Suite Detail Page (Airbnb Parity)

- **5-Photo Mosaic Grid**: Asymmetrical desktop hero display (1 dominant photo + 4 grid tiles) with a `"Show all photos"` lightbox trigger.
- **Dynamic Pricing & Add-on Engine**: Real-time calculation of stay nights, base rate, chalet preparation fee, local tourism taxes, and bespoke experiences (Private Chalet Chef, Heli-Transfer, Thermal Spa Pass, Private Ski Concierge).
- **6-Axis Review Ratings**: Granular review metrics (Cleanliness, Accuracy, Communication, Location, Check-in, Value) with meter bars.
- **Categorized Amenities Modal**: Organized dialog displaying all in-suite amenities with iconography.
- **Sticky Mobile Reservation Dock**: Responsive bottom reservation bar on mobile viewports for effortless single-tap booking.

### 💼 5. Host Administration & Ecosystem

- **Host Portal**: Live occupancy rates, gross revenue metrics, real-time availability switches, and suite creation wizard.
- **Become a Host Landing**: Dynamic revenue estimation calculator with customizable night sliders and property tiers.
- **HavenCover Guarantee**: Integrated $3,000,000 host protection and guest verification workflow.

---

## 🛠️ 3. Technical Architecture

```
Hotel_management/
├── client/                     # React Frontend (TypeScript + Tailwind CSS)
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components (Header, Footer, RoomCard, Calendar, SearchBar)
│       ├── context/            # AuthContext & Session State
│       ├── data/               # Curated Mountain Chalet Datasets
│       ├── lib/                # API client (Axios), Route Guards, TypeScript Interfaces
│       └── pages/              # Route Pages (Home, Rooms, RoomDetail, Host, About, FAQs)
├── server/                     # Express Backend (TypeScript + Prisma ORM)
│   ├── controller/             # Business Logic (Rooms, Auth, Bookings)
│   ├── middlewares/            # Auth verification, role gates
│   ├── prisma/                 # Database schema, migrations, connection pool
│   └── routes/                 # REST Endpoints (/auth, /rooms)
├── README.md                   # Design & feature documentation
└── OPTIMIZATION_AND_PERFORMANCE.md # 19-point performance & scalability manual
```

---

## 🚀 4. Getting Started

### Prerequisites

- **Node.js**: v18.0 or later
- **npm**: v9.0 or later
- **PostgreSQL** (for full database persistence)

### Server Setup

```bash
cd server
npm install
npm run dev
# Server listens on http://localhost:8000
```

### Client Setup

```bash
cd client
npm install
npm start
# Client launches at http://localhost:3000
```

---

## 📄 License

Crafters'Haven Reserve is proprietary software. All rights reserved.



