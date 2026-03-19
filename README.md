# dsa-sheet-app-be

Production-ready backend API for a DSA Sheet platform built with Node.js, Express, TypeScript, PostgreSQL, and TypeORM.

## Highlights
- Layered architecture: Controller → Service → Repository → Entity
- JWT auth with HTTP-only cookies
- bcrypt password hashing
- Input validation using `class-validator`
- Security middleware: Helmet, CORS, rate limiting
- Structured logging with Pino
- Centralized error handling
- Strict TypeScript setup

## Project Structure

```txt
/src
  /config
  /controllers
  /services
  /repositories
  /entities
  /dtos
  /interfaces
  /types
  /enums
  /middlewares
  /routes
  /utils
  /validators
  /constants
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

### Topics
- `GET /api/topics`
- `GET /api/topics/:topicId/problems`

### Progress
- `GET /api/progress`
- `POST /api/progress/update`

## Environment Variables
Copy `.env.example` to `.env` and configure:

- `DB_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_SECRET`
- `JWT_REFRESH_EXPIRES_IN`
- `PORT`
- `CORS_ORIGIN`

## Run

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run start
```

## Deployment Notes
- Use PM2 in production (`pm2 start dist/server.js`)
- Set `NODE_ENV=production`
- Use managed PostgreSQL and secure secrets storage
