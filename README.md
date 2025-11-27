# GenPost Platform - Setup & Development Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

All required packages are already configured:
- ✅ Supabase (client & SSR)
- ✅ Stripe (client & server)
- ✅ Gemini AI SDK
- ✅ OpenAI SDK

### 2. Setup Environment Variables

1. Copy the example file:
```bash
cp .env.local.example .env.local
```

2. Fill in your credentials in `.env.local`:

```env
# Supabase (see SUPABASE_SETUP.md for detailed instructions)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI APIs (provided)
GEMINI_API_KEY=AIzaSyDG_mtoURHFrWdZ38A8H_Edk9kcO_BJ2Kc
OPENAI_API_KEY=sk-proj-vJo-CQqsuRr...

# Stripe (setup later)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_key

# App
NEXT_PUBLIC_URL=http://localhost:3000
```

### 3. Setup Supabase

📖 **Follow the detailed guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

Quick summary:
1. Create a Supabase project at https://app.supabase.com
2. Copy your API keys to `.env.local`
3. Run the SQL schema (`lib/supabase/schema.sql`) in SQL Editor
4. Create storage buckets for images

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Implementation Status

### Phase 1: Infrastructure ✅ COMPLETE
- ✅ All dependencies installed
- ✅ Environment variables configured
- ✅ Supabase setup (client, server, schema)

### Phase 2: Authentication ✅ COMPLETE
- ✅ Supabase Auth integration
- ✅ `useAuth` hook (signup, signin, signout)
- ✅ Login page with real auth
- ✅ Middleware for session refresh
- ✅ Zustand store integrated with Supabase

### Phase 3-6: Next Steps
- ⏳ AI Integration (Gemini + OpenAI)
- ⏳ Database Integration (Posts CRUD)
- ⏳ Payments (Stripe)
- ⏳ Deployment (Vercel)

---

## 🔐 Authentication Flow

**Testing Auth**:
1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/login
3. Create an account
4. Verify user created in Supabase Dashboard

---

## 🎯 Next Actions

1. ✅ Complete Supabase Setup (follow SUPABASE_SETUP.md)
2. ✅ Test Authentication
3. 🔄 Implement AI Integration
4. ⏳ Setup Stripe
5. ⏳ Deploy

---

For full documentation, see:
- `SUPABASE_SETUP.md` - Supabase configuration
- `implementation_plan.md` - Complete implementation plan
