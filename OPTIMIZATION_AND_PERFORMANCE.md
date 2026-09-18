# Performance, Scalability & Engineering Optimization Manual
> Complete architectural specification and implementation guide for production readiness, sub-second latency, Core Web Vitals compliance, and high concurrency.

---

## Table of Contents
1. [Image Compression & Next-Gen Formats](#1-image-compression--next-gen-formats)
2. [Lazy Loading (Images, Components & Routes)](#2-lazy-loading-images-components--routes)
3. [Code Splitting into Optimized Chunks](#3-code-splitting-into-optimized-chunks)
4. [Client & Server API Response Caching](#4-client--server-api-response-caching)
5. [Content Delivery Network (CDN) Architecture](#5-content-delivery-network-cdn-architecture)
6. [JavaScript & CSS Minification](#6-javascript--css-minification)
7. [Database Indexing Strategy](#7-database-indexing-strategy)
8. [Reducing Unnecessary Re-Renders](#8-reducing-unnecessary-re-renders)
9. [Debouncing & Throttling Input Handlers](#9-debouncing--throttling-input-handlers)
10. [Large List Pagination & Windowing](#10-large-list-pagination--windowing)
11. [Pruning Unused Dependencies](#11-pruning-unused-dependencies)
12. [Deferring Non-Critical Scripts](#12-deferring-non-critical-scripts)
13. [Loading Skeletons & Content Placeholders](#13-loading-skeletons--content-placeholders)
14. [Load Balancer Setup (Nginx & AWS ALB)](#14-load-balancer-setup-nginx--aws-alb)
15. [API Payload Compression (Gzip & Brotli)](#15-api-payload-compression-gzip--brotli)
16. [Database Connection Pooling](#16-database-connection-pooling)
17. [Caching Expensive Computed Results](#17-caching-expensive-computed-results)
18. [Fixing N+1 Database Queries](#18-fixing-n1-database-queries)
19. [Server-Side In-Memory & Redis Caching](#19-server-side-in-memory--redis-caching)
20. [Lighthouse Audit & Core Web Vitals Checklist](#20-lighthouse-audit--core-web-vitals-checklist)

---

### 1. Image Compression & Next-Gen Formats
Unoptimized images represent the single largest bottleneck for First Contentful Paint (FCP) and Largest Contentful Paint (LCP).
* **Format Conversion**: Convert all hero photography, card thumbnails, and host avatars to WebP or AVIF formats, yielding 65%–80% payload reductions compared to standard JPEG/PNG.
* **Responsive Image Sets (`srcset` & `sizes`)**:
  ```html
  <img
    srcset="chalet-480w.webp 480w, chalet-800w.webp 800w, chalet-1200w.webp 1200w"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    src="chalet-800w.webp"
    alt="Alpine Chalet"
    loading="lazy"
    decoding="async"
    width="800"
    height="500"
  />
  ```
* **Dynamic CDN Transformations**: Leverage Cloudinary, Imgix, or Cloudflare Images to dynamically append query parameters: `?format=auto&quality=75&width=600`.

---

### 2. Lazy Loading (Images, Components & Routes)
* **Native Image Lazy Loading**: Every `<img>` below the viewport fold uses `loading="lazy"` and `decoding="async"`.
* **Intersection Observer**: For complex components (e.g. Map View, Review Modals), trigger loading only when within 200px of viewport entry.
* **Component-Level Lazy Loading**:
  ```tsx
  import React, { lazy, Suspense } from "react";
  const HostDashboard = lazy(() => import("./pages/Host/HostDashboard"));
  const RoomDetail = lazy(() => import("./pages/RoomDetail"));
  ```

---

### 3. Code Splitting into Optimized Chunks
* **Vendor Chunk Separation**: Prevent code changes from busting vendor cache. In Webpack/Vite:
  ```js
  // vite.config.ts or webpack splitChunks
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  }
  ```

---

### 4. Client & Server API Response Caching
* **HTTP Cache-Control Headers**: Set deterministic headers for static vs dynamic content:
  ```ts
  // Static classifications & static room listings
  res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
  ```
* **Client-Side SWR (Stale-While-Revalidate)**:
  Serve cached room data instantly while revalidating asynchronously in the background.

---

### 5. Content Delivery Network (CDN) Architecture
* **Static Assets**: Route `/static/`, `/media/`, and JS/CSS bundles through Cloudflare or Amazon CloudFront edge nodes.
* **Edge Caching**: Cache common queries like `/rooms?category=chalet` at edge locations worldwide, decreasing response latency from 150ms to under 15ms.

---

### 6. JavaScript & CSS Minification
* **Terser Optimization**: Strip all `console.log`, debugger statements, and comments in production builds.
* **PostCSS & cssnano**: Purge unused Tailwind classes (`content: ["./src/**/*.{js,ts,jsx,tsx}"]`) and minify color hexes, margins, and selectors.

---

### 7. Database Indexing Strategy
In relational Postgres databases, unindexed queries cause full table scans (`Seq Scan`).
* **Prisma Schema Index Definitions**:
  ```prisma
  model Room {
    id          String   @id @default(uuid())
    title       String
    category    String
    place       String
    price       Int
    available   Boolean  @default(true)
    rating      Float    @default(5.0)

    @@index([category])
    @@index([place])
    @@index([price])
    @@index([available, category])
  }

  model Reservation {
    id        String   @id @default(uuid())
    roomId    String
    checkIn   DateTime
    checkOut  DateTime
    guestEmail String

    @@index([roomId, checkIn, checkOut])
    @@index([guestEmail])
  }
  ```

---

### 8. Reducing Unnecessary Re-Renders
* **React.memo**: Wrap repetitive feed components (`RoomCard`) with custom comparator functions.
* **useMemo & useCallback**:
  ```tsx
  // Memoize expensive sorting and filtering computations
  const filteredRooms = useMemo(() => {
    return rooms.filter(r => r.category === activeCategory);
  }, [rooms, activeCategory]);

  // Stable callback reference passed to child components
  const handleWishlistToggle = useCallback((id: string) => {
    setWishlist(prev => toggleItem(prev, id));
  }, []);
  ```

---

### 9. Debouncing & Throttling Input Handlers
* **Search Input Debounce**: Prevent network thrashing during user keystrokes:
  ```tsx
  export function useDebounce<T>(value: T, delayMs: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), delayMs);
      return () => clearTimeout(timer);
    }, [value, delayMs]);
    return debouncedValue;
  }
  ```

---

### 10. Large List Pagination & Windowing
* **Cursor-Based Pagination**: Rather than `OFFSET / LIMIT` which degrades linearly as offsets grow:
  ```ts
  const rooms = await prisma.room.findMany({
    take: 12,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: 'asc' },
  });
  ```
* **Virtualization**: For extensive listings (100+ items), implement `@tanstack/react-virtual` to mount only visible DOM nodes.

---

### 11. Pruning Unused Dependencies
* Run `npx depcheck` to identify abandoned packages.
* Replace heavy libraries with lightweight native counterparts (e.g. `dayjs` instead of `moment.js`, native `fetch` or lightweight Axios).

---

### 12. Deferring Non-Critical Scripts
* Move non-blocking third-party analytics, fonts, and heatmaps to `<script defer>` or load via `requestIdleCallback`:
  ```html
  <script defer src="/analytics.js"></script>
  ```

---

### 13. Loading Skeletons & Content Placeholders
* Replace blank screens or spinner freezes with structural SVG/CSS shimmer skeletons matching the exact card geometry (`RoomCardSkeleton`), keeping Cumulative Layout Shift (CLS) near 0.

---

### 14. Load Balancer Setup (Nginx & AWS ALB)
* **Nginx Reverse Proxy & Load Balancer**:
  ```nginx
  upstream app_servers {
    least_conn;
    server 10.0.1.10:8000 max_fails=3 fail_timeout=30s;
    server 10.0.1.11:8000 max_fails=3 fail_timeout=30s;
    keepalive 32;
  }

  server {
    listen 80;
    server_name api.craftershaven.com;

    location / {
      proxy_pass http://app_servers;
      proxy_http_version 1.1;
      proxy_set_header Connection "";
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }
  ```

---

### 15. API Payload Compression (Gzip & Brotli)
* Enable Express compression middleware to reduce JSON response sizes by up to 75%:
  ```ts
  import compression from "compression";
  app.use(compression({ level: 6, threshold: 1024 }));
  ```

---

### 16. Database Connection Pooling
* Configure connection limits to match database hardware capacity without causing thread exhaustion:
  ```ts
  // PostgreSQL Pool settings
  import { Pool } from "pg";
  export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,                // max connections in pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  ```

---

### 17. Caching Expensive Computed Results
* In-memory caching for repetitive computations (e.g., stay rates, seasonal multiplier algorithms, tax tier calculation):
  ```ts
  const calculationCache = new Map<string, number>();
  export function getComputedStay(roomId: string, days: number): number {
    const key = `${roomId}:${days}`;
    if (calculationCache.has(key)) return calculationCache.get(key)!;
    const computed = runComplexPricingAlgorithm(roomId, days);
    calculationCache.set(key, computed);
    return computed;
  }
  ```

---

### 18. Fixing N+1 Database Queries
* **Problem**: Fetching 20 rooms, then running 20 individual queries to fetch reviews or host details (`1 + 20 = 21` queries).
* **Fix**: Eager-load relations in a single unified SQL query using Prisma's `include`:
  ```ts
  const roomsWithReviews = await prisma.room.findMany({
    include: {
      reviews: true,
      host: true,
    },
  });
  ```

---

### 19. Server-Side In-Memory & Redis Caching
* Cache hot endpoints in Redis with an automated Time-To-Live (TTL):
  ```ts
  export async function getCachedRooms(cacheKey: string) {
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const freshData = await fetchRoomsFromDatabase();
    await redisClient.setex(cacheKey, 60, JSON.stringify(freshData)); // 60s TTL
    return freshData;
  }
  ```

---

### 20. Lighthouse Audit & Core Web Vitals Checklist

| Metric | Target | Optimization Strategy |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | `< 2.5s` | Preload hero image, compress to WebP, serve over CDN. |
| **FID / INP (Interaction to Next Paint)**| `< 200ms` | Debounce handlers, code-split JS, avoid blocking main thread. |
| **CLS (Cumulative Layout Shift)** | `< 0.1` | Set explicit `width` & `height` on all media; use skeletons. |
| **FCP (First Contentful Paint)** | `< 1.8s` | Minify CSS/JS, server-side caching, enable Gzip/Brotli. |
| **TTFB (Time to First Byte)** | `< 0.8s` | Database indexes, connection pooling, reverse proxy. |

---

*Compiled for Crafters'Haven Reserve Engineering Team.*
