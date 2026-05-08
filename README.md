# Task Tracker (Expo + Express + MongoDB)

This project contains:

- `backend` - Node.js + Express + MongoDB API with JWT auth
- `mobile` - React Native (Expo) app with TypeScript + TanStack Query

## 1) Backend setup

```bash
cd backend
npm install
copy .env.example .env
```

Update `.env` values:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (optional, defaults to 5000)

Run backend:

```bash
npm run dev
```

## 2) Mobile setup

In `mobile/src/api/client.ts`, update `API_BASE_URL` to your machine IP and backend port.

Example:

```ts
const API_BASE_URL = "http://192.168.1.10:5000";
```

Then run:

```bash
cd mobile
npm install
npm start
```

Use Expo Go on your device or emulator.

## Implemented Features

- Auth APIs:
  - `POST /auth/signup`
  - `POST /auth/login`
- Task APIs:
  - `GET /tasks`
  - `POST /tasks`
  - `PATCH /tasks/:id`
  - `DELETE /tasks/:id`
- MongoDB models for users and tasks
- Password hashing with bcrypt
- JWT-based authentication middleware
- React Native auth flow (signup/login/logout)
- Token persistence with AsyncStorage
- TanStack Query for fetch/mutations
- Pull-to-refresh on task list
- Empty state, loading state, error state
- Create, edit, complete toggle, delete task
- Task filters: all / pending / completed
