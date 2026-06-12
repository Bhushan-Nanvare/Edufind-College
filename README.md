# EduFind — College Discovery Platform

> A production-grade college discovery and decision-making platform for Indian students. Built for the Full Stack Engineer Internship Assignment — Track B.

<br/>

## Live Demo

🔗 **[edufind.vercel.app](https://edufind-college.vercel.app/)** ← replace with your actual URL

| Demo Account | |
|---|---|
| Email | demo@edufind.com |
| Password | Demo@1234 |

<br/>

## What is EduFind?

EduFind helps Indian students discover, compare, and shortlist colleges based on their exam scores and preferences. Instead of browsing multiple unreliable sources, students get structured college data, side-by-side comparisons, rank-based admission predictions, and a personal application tracker — all in one place.

Inspired by [Careers360](https://www.careers360.com/) and [CollegeDunia](https://collegedunia.com/).

<br/>

## Features

### Core Features
- **College Search + Filters** — Search by name or location. Filter by state, city, fees range, rating, exam accepted, and college type. All filters stored in URL params — shareable and back-button friendly.
- **College Detail Page** — Full college profile with 4 tabs: Overview, Courses, Placements, and Reviews.
- **Side-by-Side Comparison** — Compare up to 3 colleges simultaneously with visual bar charts for fees and placement salary.
- **Authentication** — Secure login and signup with NextAuth.js. Protected routes redirect unauthenticated users.

### Bonus Features
- **Rank Predictor** — Enter your exam (JEE/NEET/CAT/MHT-CET), rank, and category. Get a list of colleges you can likely get into with admission chance badges.
- **Application Tracker** — Save colleges and track application status: Interested → Applied → Got Admit → Rejected.
- **Student Reviews** — Logged-in users can submit star ratings and written reviews on any college.
- **Dark Mode** — Full dark/light mode support with system preference detection.
- **Infinite Scroll** — College listing loads more results automatically as you scroll.

<br/>

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | NextAuth.js (JWT strategy) |
| Data Fetching | TanStack React Query |
| State Management | Zustand (compare store) |
| Charts | Recharts |
| Forms | react-hook-form + Zod |
| Deployment | Vercel |

<br/>

## Project Structure

```
apps/web/
├── app/
│   ├── page.tsx                    # Home page
│   ├── colleges/
│   │   ├── page.tsx                # College listing with search + filters
│   │   └── [id]/page.tsx           # College detail page
│   ├── compare/page.tsx            # Side-by-side comparison
│   ├── predictor/page.tsx          # Rank predictor tool
│   ├── saved/page.tsx              # Application tracker
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   └── api/
│       ├── colleges/               # Search, detail, compare APIs
│       ├── predictor/              # Rank predictor API
│       ├── saved/                  # Save + tracker APIs
│       ├── reviews/                # Reviews API
│       └── auth/                   # NextAuth + register
├── components/
│   ├── colleges/                   # CollegeCard, CollegeFilters
│   ├── compare/                    # CompareTable, CompareChart
│   ├── predictor/                  # PredictorForm, PredictorResults
│   ├── saved/                      # ApplicationTracker
│   ├── college-detail/             # CollegeDetailView with tabs
│   └── shared/                     # Navbar, Footer, SkeletonCard
├── lib/
│   ├── auth.ts                     # NextAuth config + getSessionUserId
│   ├── prisma.ts                   # Prisma client singleton
│   ├── colleges.ts                 # College search business logic
│   ├── validations.ts              # Zod schemas
│   └── types.ts                    # Shared TypeScript types
├── stores/
│   └── compare-store.ts            # Zustand compare state
└── prisma/
    ├── schema.prisma               # Database schema
    └── seed.ts                     # 53 Indian colleges seed data
```

<br/>

## Database Schema

```
User          — id, name, email, password, createdAt
College       — id, name, slug, city, state, type, fees, rating,
                description, established, examAccepted, naacGrade, nirf
Course        — id, name, duration, fees, collegeId
Placement     — id, avgSalary, highestSalary, placementPercent,
                topRecruiters, year, collegeId
RankCutoff    — id, exam, category, closingRank, year, collegeId
Review        — id, rating, text, userId, collegeId, createdAt
SavedCollege  — id, status, userId, collegeId, createdAt
```

<br/>

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/colleges` | No | Search + filter + paginate colleges |
| GET | `/api/colleges/[id]` | No | Full college detail |
| GET | `/api/colleges/compare` | No | Bulk fetch for comparison |
| GET | `/api/colleges/states` | No | List of all states |
| GET | `/api/predictor` | No | Rank-based college predictor |
| GET | `/api/saved` | Yes | Get saved colleges |
| POST | `/api/saved` | Yes | Save a college |
| DELETE | `/api/saved/[id]` | Yes | Remove saved college |
| POST | `/api/reviews` | Yes | Submit or update a review |
| POST | `/api/auth/register` | No | Create new account |
| POST | `/api/auth/[...nextauth]` | No | NextAuth handler |

<br/>

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (or free [Neon](https://neon.tech) account)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/edufind
cd edufind/apps/web

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

Add these values to `.env.local`:
```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
```

```bash
# 4. Run database migrations
npx prisma migrate dev

# 5. Seed the database with 53 colleges
npx prisma db seed

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

<br/>

## Key Architecture Decisions

**Next.js App Router** — Frontend pages and backend API routes live in the same project. Single deployment on Vercel with no separate backend server needed.

**Prisma ORM** — Fully type-safe database queries generated from the schema. Any schema change automatically updates TypeScript types. Migrations tracked in version control.

**NextAuth.js** — Handles the entire auth flow — JWT session management, token refresh, protected routes — without boilerplate. Credentials provider with bcrypt password hashing.

**TanStack React Query** — All data fetching on the frontend. Handles caching, loading states, error states, and background refetching automatically.

**Zustand for compare state** — Compare list persists across page navigation without re-fetching. Lightweight alternative to Redux for session-level state.

**URL params for filters** — All active filters stored in the URL using `useSearchParams`. Filtered searches are shareable and browser back/forward works correctly.

**Zod validation** — All API inputs validated with Zod schemas before touching the database. Invalid data rejected with clear error messages.

<br/>

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| Search with no results | Friendly empty state with Reset filters button |
| Adding 4th college to compare | Toast warning — max 3 allowed |
| Unauthenticated access to /saved | Redirect to login with return URL |
| Review text under 50 characters | Inline validation error before API call |
| Predictor with no matching colleges | Clear message with suggestion to try higher rank |
| Duplicate save attempt | Returns existing record — no duplicate created |
| API or database error | User-friendly error message — raw errors never exposed |

<br/>

## Deployment

The app is deployed as a single Next.js application on Vercel with PostgreSQL hosted on Neon.

**Environment variables required on Vercel:**
```
DATABASE_URL=your_neon_connection_string
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=https://your-app.vercel.app
```

<br/>

## What I Would Improve With More Time

- Real college data ingested from a public API
- Server-side pagination for better performance at scale
- Email verification on signup
- Unit and integration tests for all API routes
- College image gallery on detail pages
- Mobile hamburger menu for better mobile navigation

<br/>

---

Built for the Full Stack Engineer Internship — Track B 
