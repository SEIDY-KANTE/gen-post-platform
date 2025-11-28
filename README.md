# GenPost Platform 🎨

AI-powered social media content generation platform built with Next.js, Supabase, and Google Gemini (and OpenAI as fallback).


## ✨ Features

- 🤖 AI-powered post generation using Google Gemini (and openAI as fallback)
- 🎨 Manual post editor with rich customization
- 📱 Multiple platform templates (Instagram, LinkedIn, Twitter, Facebook)
- 🔐 Authentication with Email/Password and Google OAuth
- 💳 Credit-based system with Stripe integration
- 📊 Post history and analytics
- 🎯 User profiles and preferences

Demo link: [https://genpost-ai.vercel.app/](https://genpost-ai.vercel.app/)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Cloud account (for OAuth and Gemini AI)
- OpenAI account (for fallback AI)
- Stripe account (for payments)
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gen-post-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Then fill in your credentials in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI APIs
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Stripe Products IDs (for credits)
STRIPE_PRICE_CREDITS_10=your_stripe_price_credits_10
STRIPE_PRICE_CREDITS_20=your_stripe_price_credits_20
STRIPE_PRICE_CREDITS_50=your_stripe_price_credits_50
STRIPE_PRICE_CREDITS_100=your_stripe_price_credits_100
STRIPE_PRICE_PREMIUM=your_stripe_price_premium
STRIPE_PRICE_PRO=your_stripe_price_pro

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Set up Supabase:
   - Create a new project at [app.supabase.com](https://app.supabase.com)
   - Run the SQL schema in `lib/supabase/schema.sql`
   - Configure Google OAuth in Authentication → Providers

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret to Supabase dashboard (Authentication → Providers → Google)

## 🚢 Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Link your project:
```bash
vercel link
```

3. Add environment variables in Vercel dashboard

4. Deploy:
```bash
vercel --prod
```

### GitHub Actions Auto-Deployment

The repository includes a GitHub Actions workflow for automatic deployments to Vercel.

**Setup Steps:**

1. Get your Vercel credentials:
   - Run `vercel link` locally
   - Find Project ID and Org ID in `.vercel/project.json`
   - Generate a token in Vercel → Settings → Tokens

2. Add GitHub secrets (Settings → Secrets and variables → Actions):
   - `VERCEL_TOKEN` - Your Vercel access token
   - `VERCEL_ORG_ID` - Your Vercel organization ID
   - `VERCEL_PROJECT_ID` - Your Vercel project ID

3. Push to main branch - deployment happens automatically! 🎉

**Workflow Features:**
- ✅ Preview deployments for pull requests
- ✅ Production deployment on main branch
- ✅ Automatic PR comments with preview URLs
- ✅ Build validation before deployment

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth + Google OAuth
- **AI:** Google Gemini AI and OpenAI as fallback
- **Payments:** Stripe
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## 📁 Project Structure

```
gen-post-platform/
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard routes
│   ├── auth/              # Auth routes (callback)
│   └── login/             # Login page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── supabase/         # Supabase client & config
│   └── store.ts          # Zustand store
├── .github/
│   └── workflows/        # GitHub Actions workflows
└── vercel.json           # Vercel configuration
```

## 🧪 Testing

Run tests:
```bash
npm run test
```

Run linter:
```bash
npm run lint
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
