# NEUROAI Backend

## Requirements

- Node.js `>= 20`
- npm
- MySQL
- Redis
- Docker Desktop (optional)

## Environment

```bash
cp .env.example .env
```

Update important values in `.env`:

- App: `APP_PORT`
- Database: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER_NAME`, `DB_PASSWORD`, `DB_DIALECT`
- Redis: `REDIS_HOST`, `REDIS_PORT`
- LLM/RAG: `OPENAI_API_KEY`, `PINECONE_API_KEY`

## Run (Manual)

```bash
npm install
npm run migrate:up
# optional
npm run seed
npm run dev
```

API base URL: `http://localhost:8000`

## Run (Docker)

```bash
docker compose up --build
```

Then run migration inside the app container:

```bash
docker compose exec app npm run migrate:up
# optional
docker compose exec app npm run seed
```

Default ports:

- App: `http://localhost:8000`
- MySQL: `localhost:3307`
- Redis: `localhost:6379`

Useful commands:

```bash
docker compose down
docker compose down -v
```

## API Documentation

Swagger UI: `http://localhost:8000/api/v1/docs`

## Available Scripts

- `npm run dev` - start development server
- `npm run build` - compile TypeScript
- `npm run start` - build + run production server
- `npm run migrate:up` - run migrations
- `npm run migrate:undo` - rollback one migration
- `npm run seed` - run seeders
