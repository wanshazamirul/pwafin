# 🚀 WalletLog PWA - Implementation Guide
**Project Location**: `C:\Users\Shazwan\Desktop\PROJECTS\DEVELOPMENT\walletlog-pwa\`
**Status**: Foundation Complete ✅
**Estimated Remaining Work**: 14-18 hours

---

## ✅ **COMPLETED FOUNDATION** (Phase 1: ~4 hours)

### 1. Project Setup ✅
- [x] Next.js 16.1.3 with App Router
- [x] TypeScript strict mode enabled
- [x] Tailwind CSS v4 configured
- [x] All dependencies installed (14 packages)
- [x] PWA dependencies (next-pwa)

### 2. UI Framework ✅
- [x] shadcn/ui initialized (14 components)
- [x] Liquid glass theme applied (SenTracker aesthetic)
- [x] Dark/light mode CSS variables
- [x] Glassmorphism utilities
- [x] Liquid background animations

### 3. Database Layer ✅
- [x] Drizzle ORM schema (`src/lib/db/schema.ts`)
  - users, categories, transactions, receipts, budgets tables
  - TypeScript types exported
- [x] Database connection (`src/lib/db/index.ts`)
- [x] Validation schemas (`src/lib/validations.ts`)
- [x] TypeScript types (`src/types/index.ts`)

### 4. Core Utilities ✅
- [x] `cn()` className merger
- [x] `formatCurrency()` - Malaysian Ringgit formatter
- [x] `formatDate()` - Date formatter
- [x] `formatRelativeTime()` - Relative time formatter

### 5. Layout Components ✅
- [x] `BottomNav.tsx` - 5-tab navigation with centered Scan button
- [x] `FAB.tsx` - Floating action button (auto-hides on Scan page)
- [x] `ThemeToggle.tsx` - Dark/light mode switcher
- [x] `QuickAddModal.tsx` - Manual transaction entry modal

---

## 🔄 **REMAINING IMPLEMENTATION** (Phases 2-7)

### **Phase 2: Authentication System** (2-3 hours)
**Status**: ❌ Not Started

**Tasks**:
1. **Setup NextAuth.js v5**
   ```bash
   # Already installed: next-auth@beta, @auth/drizzle-adapter
   ```

2. **Create `src/auth.ts`**:
   ```typescript
   import NextAuth from 'next-auth'
   import Google from 'next-auth/providers/google'
   import Credentials from 'next-auth/providers/credentials'
   import { drizzleAdapter } from '@auth/drizzle-adapter'
   import { db } from '@/lib/db'

   export const { handlers, signIn, signOut, auth } = NextAuth({
     adapter: drizzleAdapter(db),
     providers: [
       Google({
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       }),
       Credentials({
         credentials: {
           email: { label: "Email", type: "email" },
           password: { label: "Password", type: "password" }
         },
         async authorize(credentials) {
           // Implement email/password auth with bcrypt
         }
       })
     ],
     session: { strategy: 'jwt' },
   })
   ```

3. **Create API route `src/app/api/auth/[...nextauth]/route.ts`**:
   ```typescript
   import { handlers } from '@/auth'
   export const { GET, POST } = handlers
   ```

4. **Create login page `src/app/(auth)/login/page.tsx`**:
   - Google OAuth button
   - Email/password form
   - Link to signup
   - Glassmorphism card design

5. **Create signup page `src/app/(auth)/signup/page.tsx`**:
   - Name, email, password fields
   - Validation with Zod
   - Create user in database

6. **Protected route middleware**:
   ```typescript
   // middleware.ts
   export { auth as middleware } from "@/auth"
   ```

---

### **Phase 3: Grok API Integration** (2-3 hours)
**Status**: ❌ Not Started

**Tasks**:
1. **Create `src/app/api/parse-receipt/route.ts`**:
   ```typescript
   import { NextResponse } from 'next/server'

   const GROK_API_KEY = process.env.GROK_API_KEY

   export async function POST(request: Request) {
     const session = await auth()
     if (!session?.user) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }

     const { image, text } = await request.json()

     // Rate limiting (10 req/min per user)
     const isRateLimited = await checkRateLimit(session.user.id)
     if (isRateLimited) {
       return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
     }

     // Call Grok API
     const prompt = image
       ? `Extract transaction from receipt. Return JSON: { amount, merchant, category, items }`
       : `Parse expense: "${text}". Malaysian English. Return JSON: { amount, merchant, category, note }`

     const response = await fetch('https://api.grok.com/v1/chat/completions', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${GROK_API_KEY}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         model: 'grok-2',
         messages: [{ role: 'user', content: prompt }],
         response_format: { type: 'json_object' }
       })
     })

     const data = await response.json()
     const parsed = JSON.parse(data.choices[0].message.content)

     // Validate with Zod
     const validated = receiptDataSchema.parse(parsed)

     return NextResponse.json({ success: true, data: validated })
   }
   ```

2. **Create rate limiter utility**:
   ```typescript
   // src/lib/rate-limit.ts
   const rateLimiter = new Map<string, { count: number; resetTime: number }>()

   export async function checkRateLimit(userId: string): Promise<boolean> {
     const now = Date.now()
     const user = rateLimiter.get(userId)

     if (!user || now > user.resetTime) {
       rateLimiter.set(userId, { count: 1, resetTime: now + 60000 })
       return false
     }

     if (user.count >= 10) return true

     user.count++
     return false
   }
   ```

3. **Environment variables (`.env.local`)**:
   ```env
   GROK_API_KEY=gsk_your_key_here
   DATABASE_URL=your_postgres_url
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   AUTH_SECRET=your_auth_secret_generate_with_openssl
   ```

---

### **Phase 4: Page Implementations** (6-8 hours)

#### **4.1 Dashboard Page** (`src/app/(app)/dashboard/page.tsx`)
**Features**:
- Total spending card (animated count-up)
- Month selector (previous/next)
- Quick stats (top 3 categories)
- Recent transactions list (5 items)
- Pull to refresh
- FAB button visible

**Key Components to Create**:
```typescript
// src/components/dashboard/TotalSpending.tsx
// Animated count-up from 0 to total

// src/components/dashboard/QuickStats.tsx
// Grid of 3 category cards with glass-card styling

// src/components/dashboard/RecentTransactions.tsx
// List of last 5 transactions with date grouping
```

**Data Queries**:
```typescript
const totalSpending = await db
  .select({ amount: transactions.amount })
  .from(transactions)
  .where(
    and(
      eq(transactions.userId, userId),
      gte(transactions.createdAt, startOfMonth),
      lte(transactions.createdAt, endOfMonth)
    )
  )

const recentTransactions = await db
  .select()
  .from(transactions)
  .orderBy(desc(transactions.createdAt))
  .limit(5)
```

---

#### **4.2 Scan Page** (`src/app/(app)/scan/page.tsx`)
**Features**:
- Camera view (center stage)
- Capture button (large, prominent)
- Alternative text input (NLP field)
- Recent suggestions (quick-fill)
- Preview modal (edit before save)

**Key Components**:
```typescript
// src/components/scan/CameraView.tsx
// Use device camera API or file picker

// src/components/scan/NLPInput.tsx
// Text area with placeholder "lunch at mamak 12"

// src/components/scan/PreviewModal.tsx
// Show parsed data, allow editing
```

**Flow**:
1. User taps "Capture" → Opens camera/file picker
2. Image → `/api/parse-receipt` → Grok API
3. Show preview with parsed data
4. User confirms/edits → Save to DB
5. Success toast → Redirect to History

---

#### **4.3 History Page** (`src/app/(app)/history/page.tsx`)
**Features**:
- Search bar (merchant, category, note)
- Filters (category, date range, amount)
- Sort options (date, amount, merchant)
- Grouped by date (expand/collapse)
- **Swipe gestures** (left → Edit/Delete buttons)
- Infinite scroll
- Pull to refresh

**Key Components**:
```typescript
// src/components/history/TransactionList.tsx
// Group by date, collapsible sections

// src/components/history/TransactionCard.tsx
// Individual transaction with Framer Motion swipe

// src/components/history/SwipeActions.tsx
// Edit and Delete buttons revealed on swipe

// src/components/history/SearchBar.tsx
// Search input with debouncing

// src/components/history/Filters.tsx
// Category dropdown, date range picker
```

**Swipe Implementation** (Framer Motion):
```typescript
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(e, info) => {
    if (info.offset.x < -100) {
      // Reveal edit/delete actions
    }
  }}
>
  {/* Transaction card content */}
</motion.div>
```

---

#### **4.4 Insights Page** (`src/app/(app)/insights/page.tsx`)
**Features**:
- Month selector
- Total spending with trend indicator (↑↓ %)
- **4 Chart Types**:
  1. Line Chart - Spending over time (monthly)
  2. Pie Chart - Category breakdown (%)
  3. Bar Chart (Horizontal) - Top 5 merchants
  4. Bar Chart (Vertical) - Daily average pattern

**Key Components**:
```typescript
// src/components/insights/LineChart.tsx
// Monthly spending trend

// src/components/insights/PieChart.tsx
// Category distribution

// src/components/insights/MerchantBarChart.tsx
// Top 5 merchants (horizontal)

// src/components/insights/DailyBarChart.tsx
// Daily spending pattern (vertical)

// src/components/insights/TrendIndicator.tsx
// Shows % change from last month
```

**Recharts Implementation**:
```typescript
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

<ResponsiveContainer width="100%" height={200}>
  <LineChart data={monthlyData}>
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="amount" stroke="oklch(0.60 0.15 180)" />
  </LineChart>
</ResponsiveContainer>
```

---

#### **4.5 Settings Page** (`src/app/(app)/settings/page.tsx`)
**Features**:
- Profile section (name, email, avatar)
- **Theme toggle** (already have component)
- Category management (add/edit/delete)
- Data export (CSV/PDF)
- Notification preferences
- Security settings (password, 2FA)
- Logout button

**Key Components**:
```typescript
// src/components/settings/ProfileSection.tsx
// User info card with edit option

// src/components/settings/AppearanceToggle.tsx
// Dark/light mode switcher

// src/components/settings/CategoryManager.tsx
// List of categories with CRUD operations

// src/components/settings/DataExport.tsx
// Export buttons (CSV/PDF)

// src/components/settings/NotificationPreferences.tsx
// Toggles for daily reminder, budget alerts
```

---

### **Phase 5: PWA Configuration** (1-2 hours)
**Status**: ❌ Not Started

**Tasks**:
1. **Update `next.config.ts`**:
   ```typescript
   import withPWA from 'next-pwa'

   const config = {
     // Your existing config
   }

   export default withPWA({
     dest: 'public',
     register: true,
     skipWaiting: true,
     disable: process.env.NODE_ENV === 'development',
   })(config)
   ```

2. **Create `public/manifest.json`**:
   ```json
   {
     "name": "WalletLog",
     "short_name": "WalletLog",
     "description": "Malaysian Finance Tracker PWA",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#0a0a0f",
     "theme_color": "#1a1c2c",
     "orientation": "portrait",
     "icons": [
       { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" }
     ]
   }
   ```

3. **Create PWA icons** (use online generator):
   - Generate 192x192 and 512x512 PNG icons
   - Place in `public/icons/`

4. **Update layout** (`src/app/layout.tsx`):
   ```typescript
   export const metadata = {
     manifest: '/manifest.json',
     themeColor: '#1a1c2c',
     appleWebApp: {
       capable: true,
       statusBarStyle: 'default',
       title: 'WalletLog',
     },
   }
   ```

---

### **Phase 6: Testing & Polish** (2-3 hours)
**Status**: ❌ Not Started

**Tasks**:
1. **TypeScript validation**:
   ```bash
   npx tsc --noEmit
   ```
   - Must be ZERO errors

2. **Responsive testing**:
   - Test on mobile (375px - 414px)
   - Test on tablet (768px)
   - Test on desktop (1024px+)

3. **Functional testing**:
   - Auth flow (Google + email)
   - Receipt scanning (Grok API)
   - NLP parsing (Malaysian patterns)
   - Swipe gestures
   - All CRUD operations
   - Dark/light mode toggle
   - PWA installation

4. **Performance optimization**:
   - Lazy load components
   - Optimize images
   - Code splitting
   - Minimize bundle size

---

## 📁 **PROJECT STRUCTURE** (Current + Planned)

```
walletlog-pwa/
├── public/
│   └── icons/              # PWA icons (create these)
├── src/
│   ├── app/
│   │   ├── (auth)/          # Auth pages (create)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (app)/           # Protected pages (create)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── scan/
│   │   │   │   └── page.tsx
│   │   │   ├── history/
│   │   │   │   └── page.tsx
│   │   │   ├── insights/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx    # With BottomNav + FAB
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   └── parse-receipt/
│   │   │       └── route.ts
│   │   ├── globals.css       # ✅ Done
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/           # ✅ Done (BottomNav, FAB, ThemeToggle)
│   │   ├── dashboard/        # Create (TotalSpending, QuickStats, etc.)
│   │   ├── scan/             # ✅ QuickAddModal, create (CameraView, NLPInput)
│   │   ├── history/          # Create (TransactionList, SwipeActions)
│   │   ├── insights/         # Create (4 chart components)
│   │   ├── settings/         # Create (ProfileSection, CategoryManager)
│   │   └── ui/               # ✅ Done (14 shadcn components)
│   ├── lib/
│   │   ├── db/               # ✅ Done (schema.ts, index.ts)
│   │   ├── auth.ts           # Create (NextAuth config)
│   │   ├── validations.ts    # ✅ Done
│   │   ├── utils.ts          # ✅ Done
│   │   └── rate-limit.ts     # Create
│   ├── types/                # ✅ Done (index.ts)
│   └── hooks/                # Create as needed
├── .env.local                # Create (environment variables)
├── next.config.ts            # Update (PWA config)
├── tsconfig.json             # ✅ Already strict mode
└── package.json              # ✅ All dependencies installed
```

---

## 🎯 **NEXT STEPS** (Priority Order)

### **Immediate (Start Here)**:
1. ✅ Review completed foundation (DONE)
2. ⏭️ **Setup Vercel Postgres database**:
   - Create Vercel project
   - Add Postgres database
   - Copy connection string to `.env.local`
   - Run migrations with Drizzle Kit
3. ⏭️ **Build authentication** (Phase 2):
   - Create `src/auth.ts`
   - Create auth API route
   - Build login/signup pages
4. ⏭️ **Create Grok API integration** (Phase 3):
   - Get Grok API key
   - Build `/api/parse-receipt` route
   - Test with sample data

### **Then Build Pages** (Phase 4):
5. Dashboard → Scan → History → Insights → Settings
6. Each page: 1-2 hours with components and data queries

### **Finally** (Phases 5-6):
7. Configure PWA (manifest, service worker)
8. Test everything (TypeScript, responsive, functional)

---

## 🔑 **KEY IMPLEMENTATION NOTES**

### **Grok API Security**:
- ✅ NEVER expose API key in client code
- ✅ Always call via YOUR API route
- ✅ Rate limit per user (10 req/min)
- ✅ Validate responses with Zod

### **Malaysian NLP Patterns**:
Support these patterns in Grok prompt:
- "lunch at mamak 12" → { amount: 12, merchant: "Mamak", category: "Food" }
- "kedai tomyam rm12.50" → { amount: 12.50, merchant: "Kedai Tomyam" }
- "grab 20 to office" → { amount: 20, merchant: "Grab", category: "Transport" }
- "petrol shell 50" → { amount: 50, merchant: "Shell", category: "Transport" }

### **Liquid Glass Aesthetic**:
- Use `.glass-card` for all cards
- Use `.gradient-accent` for buttons
- Use `.liquid-bg` on layout root
- Dark mode: `.dark` class on html element
- Teal color palette: `oklch(0.60 0.15 180)` to `oklch(0.55 0.18 210)`

### **TypeScript Strict Mode**:
- NO `any` types allowed
- All components must have proper props typing
- Use Drizzle inferred types where possible
- Run `npx tsc --noEmit` before committing

### **Mobile-First**:
- All components responsive (375px+)
- Touch targets: min 44px (WCAG 2.5.5)
- Safe areas: `.pb-safe`, `.pt-safe`
- Bottom nav: Always visible on mobile
- FAB: Auto-hide on scan page

---

## 📊 **PROGRESS TRACKING**

**Current Status**: 25% Complete (4/16 hours estimated)

**Completed**:
- ✅ Foundation (4h)
  - Project setup
  - UI framework
  - Database layer
  - Core utilities
  - Layout components

**Remaining**: 12 hours
- ⏳ Authentication (2-3h)
- ⏳ Grok API (2-3h)
- ⏳ Pages (6-8h)
- ⏳ PWA + Testing (2-3h)

---

## 🚀 **QUICK START COMMANDS**

```bash
# 1. Navigate to project
cd C:\Users\Shazwan\Desktop\PROJECTS\DEVELOPMENT\walletlog-pwa

# 2. Create environment file
cp .env.example .env.local
# Edit .env.local with your keys

# 3. Setup Vercel Postgres
vercel link
vercel postgres create
# Copy connection string to .env.local

# 4. Run database migrations
npx drizzle-kit push

# 5. Start dev server
npm run dev
# Or let Wan handle this (EOD protocol)

# 6. Check TypeScript errors
npx tsc --noEmit
```

---

## 🎨 **DESIGN REFERENCE**

**Theme**: Liquid Glass (SenTracker aesthetic)
**Colors**: Teal gradient (oklch color space)
**Dark mode**: Deep navy background
**Light mode**: Clean white background
**Glass effect**: backdrop-filter: blur(16px)
**Animations**: Smooth 60fps, liquid background

**Components**: Use shadcn/ui patterns
**Icons**: Lucide React
**Charts**: Recharts
**Gestures**: Framer Motion

---

## 📝 **FINAL NOTES**

This foundation provides everything you need to continue building efficiently. The structure follows Next.js 15 App Router best practices, uses TypeScript strict mode, and implements the liquid glass aesthetic from SenTracker.

**Next Action**: Setup Vercel Postgres database and build authentication system.

**Remember**:
- NO `any` types
- All pages mobile-first
- Real Grok API integration
- Test everything before deploying

Let's build this RIGHT! 💪🚀
