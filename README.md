# 💰 WalletLog PWA

A Progressive Web App for tracking personal expenses with AI-powered receipt scanning, built for Malaysians.

## ✨ Features

- 📷 **Receipt Scanning** - AI-powered receipt scanning via Grok API
- ✍️ **Natural Language Entry** - Malaysian English/Bahasa support
- 📊 **Analytics** - 4 interactive chart types (Recharts)
- 🔐 **Authentication** - Google OAuth + email/password
- 🌙 **Liquid Glass Theme** - Beautiful dark/light modes
- 📱 **PWA** - Installable, offline-capable
- 👆 **Swipe Gestures** - Edit/delete with Framer Motion
- 💾 **Vercel Postgres** - Real database with Drizzle ORM

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Vercel Postgres + Drizzle ORM
- **Auth**: NextAuth.js v5
- **AI**: Grok API (receipt scanning + NLP)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **PWA**: next-pwa

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Add your keys to .env.local:
# GROK_API_KEY=your_key_here
# DATABASE_URL=your_postgres_url
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
# AUTH_SECRET=your_auth_secret
```

## 🚀 Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Run TypeScript check
npx tsc --noEmit
```

## 📱 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Authentication pages
│   ├── (app)/              # Protected app pages
│   ├── api/                # API routes
│   └── globals.css         # Global styles (liquid glass theme)
├── components/             # React components
│   ├── layout/             # Layout components (BottomNav, FAB)
│   ├── dashboard/          # Dashboard-specific components
│   ├── scan/               # Receipt scanning components
│   ├── history/            # Transaction list components
│   ├── insights/           # Analytics charts
│   ├── settings/           # Settings components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utility libraries
│   ├── db/                 # Database schema and connection
│   ├── auth.ts             # NextAuth configuration
│   ├── validations.ts      # Zod schemas
│   └── utils.ts            # Helper functions
└── types/                  # TypeScript type definitions
```

## 🎨 Theme

**Liquid Glass Aesthetic** (SenTracker-inspired):
- Teal gradient accent colors
- Glassmorphism cards with backdrop blur
- Animated liquid background
- Dark/light mode support
- OKLCH color space for consistent theming

## 🔐 Authentication

- **Google OAuth** - Primary auth method
- **Email/Password** - Secondary auth method
- **Protected Routes** - Middleware-based auth check
- **Session Management** - JWT strategy with Vercel Postgres

## 🤖 AI Features

### Receipt Scanning
1. Capture/upload receipt image
2. Send to Grok API via secure API route
3. Parse: amount, merchant, category, items
4. Preview before saving

### NLP Text Entry
Malaysian English/Bahasa support:
- "lunch at mamak 12" → RM 12, Food
- "kedai tomyam rm12.50" → RM 12.50, Food
- "grab 20 to office" → RM 20, Transport
- "petrol shell 50" → RM 50, Transport

## 📊 Analytics

Four chart types powered by Recharts:
1. **Line Chart** - Monthly spending trend
2. **Pie Chart** - Category breakdown
3. **Bar Chart (Horizontal)** - Top 5 merchants
4. **Bar Chart (Vertical)** - Daily spending pattern

## 📱 PWA Features

- Installable on mobile devices
- Offline support for viewing transactions
- Background sync for adding transactions
- Push notifications (planned)
- Safe area support for iOS

## 🧪 Testing

```bash
# TypeScript validation
npx tsc --noEmit

# Linting
npm run lint

# Build (includes all checks)
npm run build
```

## 📄 License

MIT

## 👤 Author

**Wan Shazwan** - [GitHub](https://github.com/wanshazamirul)

---

**Status**: Foundation Complete ✅
**Progress**: 25% (4/16 hours)
**Next**: Setup Vercel Postgres and build authentication

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for detailed development status.
