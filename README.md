# QuietoraLabs

QuietoraLabs is an independent software product studio based in India. We design and engineer calm, honest software for focus, learning, and digital wellbeing.

---

## Products & Explorations

- **Quietora Focus**: A Windows-first application for distraction management, deep work blocks, and on-device activity insights. Built for individuals who want their attention back without algorithmic noise or invasive tracking. *(In Development)*
- **Quietora Campus**: Privacy-forward focus infrastructure designed for educational institutions, engineering academies, and coaching centers. Focuses on aggregated, opt-in cohort metrics without individual surveillance. *(Partnership Concept)*
- **Medique**: An early-stage exploratory healthcare design concept exploring calm clinical interfaces and patient care transparency. *(Exploration / Concept)*

---

## Architecture & Technology Stack

The QuietoraLabs web platform is built using modern, type-safe full-stack web standards:

- **Framework**: [TanStack Start](https://tanstack.com/start) with React 19
- **Bundler & Build Tool**: Vite & Nitro
- **Routing**: Flat file-based routing via `@tanstack/react-router`
- **Styling**: Tailwind CSS v4 with bespoke OKLCH color tokens and custom design primitives
- **Database & Storage**: PostgreSQL via Supabase (Row Level Security enabled) and Supabase Storage for secure candidate submissions
- **ORM & Migrations**: Drizzle ORM
- **Type Safety**: Strict TypeScript (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- **Testing**: Vitest with React Testing Library

---

## Project Structure

```
quietoralabs/
├── drizzle/                    # Database schemas and SQL migrations
│   └── migrations/             # Idempotent RLS migration scripts
├── public/                     # Public static assets & official brand marks
│   └── assets/                 # High-resolution logos, favicons, and SVG marks
├── src/
│   ├── components/             # Reusable UI & presentation components
│   │   ├── site/               # Brand header, footer, hero, and section primitives
│   │   └── ui/                 # Accessible base UI primitives
│   ├── lib/                    # Core utilities, SEO, database clients, and server functions
│   │   ├── auth.ts             # Role-based access control and admin session validation
│   │   ├── jobs.functions.ts   # Dynamic career role listings and candidate submissions
│   │   ├── portfolio.ts        # Typed portfolio definitions and honest roadmap statuses
│   │   └── supabase.ts         # Supabase client singletons
│   ├── routes/                 # File-based application routes
│   │   ├── admin.tsx           # Authenticated admin management portal
│   │   ├── careers.index.tsx   # Live job listings and dynamic roles
│   │   ├── careers.apply.tsx   # Dedicated multi-step candidate application
│   │   ├── privacy.tsx         # Comprehensive privacy policy
│   │   ├── terms.tsx           # Terms of service and intellectual property notice
│   │   └── index.tsx           # Main homepage
│   └── styles.css              # Global tokens, fluid typography, and ambient animations
```

---

## Getting Started

### Prerequisites

- Node.js v20 or later
- npm v10 or later
- A Supabase project (Cloud or Self-Hosted Docker)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/prajansanjayk1/QuietoraLabs.git
cd QuietoraLabs
npm install
```

### Environment Configuration

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

Provide your Supabase URL and API keys:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-or-publishable-key"

SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-anon-or-publishable-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Development Server

Run the development server locally:

```bash
npm run dev
```

The application will be accessible at `http://localhost:8080`.

### Building for Production

Compile client assets and the Nitro server:

```bash
npm run build
```

Run type checking and tests:

```bash
npm run typecheck
npm test
```

---

## Key Features

1. **Brand Identity & Atmosphere**:
   - Iconic Quietora Q mark with gentle ambient floating animation.
   - Clean, human-crafted layout free of artificial clutter.

2. **Dynamic Career System**:
   - Roles can be dynamically published, edited, archived, or drafted from the Admin console.
   - Dedicated application route (`/careers/apply?role=<slug>`) with resume uploads directly to private Supabase Storage buckets.
   - Built-in "Custom / Other" role proposition pathway for speculative applicants.

3. **Secure Administrative Portal**:
   - Protected route at `/admin` requiring verified `admin` role in `public.user_roles`.
   - Freeform input fields with intelligent datalist suggestions for department, location, job type, and experience level.
   - Full applicant management and inbound inquiry tracking.

4. **Legal & Compliance**:
   - Comprehensive Privacy Policy (`/privacy`) detailing our zero-telemetry philosophy and data handling commitments.
   - Terms of Service (`/terms`) covering acceptable use, proprietary marks, and user rights.

---

## Security & Privacy Commitments

- **Zero Unwanted Telemetry**: Our client software is architected to perform isolation and distraction blocking entirely on-device.
- **Row-Level Security (RLS)**: Public tables enforce strict PostgreSQL RLS policies ensuring anonymous users cannot read inquiries or candidate records.
- **Role Verification**: Admin privileges are checked at the server boundary against cryptographic JWT claims.

---

## License

Copyright © 2026 QuietoraLabs. All rights reserved.
Proprietary software and design assets.
