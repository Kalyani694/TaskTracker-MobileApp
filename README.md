# Task Tracker Mobile App

A full-stack Task Tracker Mobile Application built using React Native (Expo + TypeScript) for the frontend and Node.js + Express.js + MongoDB for the backend.

## GitHub Repository

Repository Link: [https://github.com/Kalyani694/TaskTracker-MobileApp](https://github.com/Kalyani694/TaskTracker-MobileApp)

---

# Tech Stack

## Frontend

* React Native (Expo)
* TypeScript
* TanStack Query
* React Navigation
* Axios

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

---

# Features

## Authentication

* User Signup
* User Login
* JWT-based Authentication
* Secure Password Hashing
* Persistent Login Session

## Task Management

Users can:

* Create Tasks
* View All Tasks
* Mark Tasks as Completed
* Edit Tasks
* Delete Tasks
* Pull to Refresh Task List

## Task Fields

Each task contains:

* Title
* Optional Description
* Completion Status
* Created Timestamp

---

# API Endpoints

## Auth APIs

### Signup

```http
POST /auth/signup
```

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login

```http
POST /auth/login
```

Request Body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

## Task APIs

### Get All Tasks

```http
GET /tasks
```

### Create Task

```http
POST /tasks
```

### Update Task

```http
PATCH /tasks/:id
```

### Delete Task

```http
DELETE /tasks/:id
```

---

# Project Structure

## Frontend Structure

```bash
frontend/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── hooks/
│   ├── context/
│   ├── types/
│   └── utils/
│
├── App.tsx
└── package.json
```

## Backend Structure

```bash
backend/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── config/
├── utils/
├── server.js
└── package.json
```

---

# Setup Instructions

## Clone Repository

```bash
git clone https://github.com/Kalyani694/TaskTracker-MobileApp.git
```

---

# Backend Setup

## Navigate to Backend Folder

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

## Create .env File

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Run Backend Server

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

## Navigate to Frontend Folder

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Start Expo App

```bash
npx expo start
```

Scan the QR code using the Expo Go app on your mobile device.

---

# TanStack Query Usage

TanStack Query is used for:

* Fetching Tasks
* Creating Tasks
* Updating Tasks
* Deleting Tasks
* Cache Invalidation
* Handling Loading and Error States

---

# UI Features

* Clean and Simple UI
* Loading Indicators
* Error Handling
* Pull-to-Refresh
* Empty State Screen
* Responsive Mobile Design

---

# Security

* Passwords are hashed using bcryptjs
* JWT Authentication implemented
* Protected task routes using middleware

---

# Demo Video

The demo video includes:

* User Signup/Login
* Task CRUD Operations
* Task Completion Update
* Pull-to-Refresh
* API Integration
* MongoDB Data Storage

---

# Author

Kalyani Borase
