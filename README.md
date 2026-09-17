# Travel Itinerary Ideas

An AI travel itinerary planner that turns a few preferences into a day-by-day trip plan — places worth remembering, realistic schedules, and routes that actually fit your time and budget.

Tell it where you want to go, what you care about, how many days you have, and your budget. It researches places, builds a schedule, reviews the plan for feasibility, then delivers a clean Markdown itinerary you can refine in chat. This project is my assignment for Devscale AI Product Engineering Week 6

## What it does

- Captures travel preferences (destination, interests, days, budget)
- Discovers matching places with Maps links and why they fit you
- Builds a balanced day-by-day schedule (travel time, meals, rest)
- Reviews the plan for timing conflicts, route logic, and preference fit
- Asks for confirmation before locking the final itinerary
- Keeps chat sessions so you can continue refining a trip

## How planning works

A main planner agent orchestrates specialized sub-agents in order:

```text
You → Preference → Place discovery → Schedule → Reviewer → Final itinerary
```

1. **Preference agent** — Extracts structured preferences. If anything is missing, it asks clarifying questions and waits.
2. **Place agent** — Searches the web for attractions and spots that match those preferences.
3. **Schedule agent** — Turns preferences + places into a realistic day-by-day plan.
4. **Reviewer agent** — Scores feasibility and preference fit (up to 2 review cycles).

Only after approval (or a clearly labeled draft at the review cap) — and your confirmation — does it present the final itinerary as Markdown tables.

## Tech stack

| Layer         | Stack                                                        |
| ------------- | ------------------------------------------------------------ |
| Monorepo      | pnpm + Turborepo                                             |
| Frontend      | React, TanStack Router, Vite, Tailwind CSS (`apps/platform`) |
| API           | Hono on Node (`apps/api`)                                    |
| Agents        | Anvia agent framework + OpenAI (`packages/agents`)           |
| Search        | Tavily                                                       |
| Memory / DB   | PostgreSQL via Prisma                                        |
| Observability | Langfuse                                                     |

## Project structure

```text
.
├── apps/
│   ├── platform/     # Chat UI (Vite + React)
│   └── api/          # Hono API + Prisma memory store
├── packages/
│   └── agents/       # Planner agent + preference/place/schedule/reviewer sub-agents
├── package.json
└── turbo.json
```

## Getting started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 11+
- PostgreSQL database
- API keys for OpenAI and Tavily (Langfuse optional for tracing)

### 1. Install

```bash
pnpm install
```

### 2. Environment

Create a `.env` file at the repo root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/itinerary
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
UPLOAD_DIR=./uploads

OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...

LANGFUSE_SECRET_KEY=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_BASE_URL=

NODE_ENV=development
```

### 3. Database

```bash
pnpm db:generate
pnpm db:migrate
```

### 4. Run

```bash
pnpm dev
```

This starts:

- **Platform UI** → [http://localhost:3000](http://localhost:3000)
- **API** → [http://localhost:8000](http://localhost:8000)

Open the UI, start a new chat, and describe the trip you want — for example:

> 4 days in Kyoto, love temples and food, mid-range budget

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `pnpm dev`         | Run API + platform in development    |
| `pnpm build`       | Build apps                           |
| `pnpm start`       | Start production builds              |
| `pnpm db:generate` | Generate Prisma client               |
| `pnpm db:migrate`  | Run Prisma migrations                |
| `pnpm db:studio`   | Open Prisma Studio                   |
| `pnpm runner:dev`  | Run the agent package runner locally |

## Deploy with Docker Compose and Dokploy

The repository includes a production Compose stack with three services:

- `web`: Vite preview server serving the production frontend build.
- `api`: Hono on Node, with Prisma migrations applied before startup.
- `postgres`: PostgreSQL with a named volume for persistent application data.

Configure separate Dokploy/Traefik domains for `web` and `api`. Route the frontend domain to container port `4173` and the API domain to container port `8000`. Do not publish PostgreSQL publicly. Set `VITE_API_BASE_URL` to the public API URL including `/api`, such as `https://api.example.com/api`, before building the frontend.

### Required Dokploy environment variables

Add these variables in the Dokploy Compose environment settings. Do not commit the values:

```env
OPENAI_API_KEY=...
TAVILY_API_KEY=...
POSTGRES_PASSWORD=use-a-long-random-password
```

The Compose file supplies the internal PostgreSQL `DATABASE_URL` from `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD`. To use an external PostgreSQL instance instead, set `DATABASE_URL` explicitly and remove or ignore the internal `postgres` service according to your Dokploy setup.

Optional variables include `OPENAI_BASE_URL`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_BASE_URL`, `POSTGRES_DB`, `POSTGRES_USER`, `VITE_API_BASE_URL`, and `API_PROXY_TARGET`. Because Vite embeds `VITE_API_BASE_URL` into the frontend bundle, set it in Dokploy as a build argument or environment variable available during the image build. With separate Traefik domains, use a value such as `https://api.example.com/api`. If `VITE_API_BASE_URL` is left empty, the web container proxies `/api` internally to `http://api:8000`; override `API_PROXY_TARGET` only when the API service has a different reachable address.

### Local Compose

Copy `.env.example` to `.env`, replace the placeholder secrets, then run:

```bash
docker compose config
docker compose up --build -d
```

The UI is available at [http://localhost:4173](http://localhost:4173), and the API health endpoint is available at [http://localhost:8000/api/healthz](http://localhost:8000/api/healthz).

The PostgreSQL volume is named `postgres_data`. Back it up before deleting the Compose project or changing the database configuration.

## Example output

The final plan is Markdown with day tables:

| Time        | Destination  | Activity  | Transportation | Notes              |
| ----------- | ------------ | --------- | -------------- | ------------------ |
| 08:00–09:00 | Hotel        | Breakfast | —              | Start the day      |
| 09:30–12:00 | Attraction A | Explore   | Taxi           | Buy tickets online |
| 12:00–13:30 | Restaurant B | Lunch     | Walk           | Local specialty    |

Each stop can include a Google Maps link so you can open the route on your phone.

## License

ISC
