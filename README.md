# Wavely

A full-stack music streaming platform built with **Next.js** (client) and **NestJS** (server). Users can search and browse tracks, build playlists, and stream music sourced from the Jamendo API — all behind JWT-based authentication.

## Tech Stack

**Client**
- Next.js 16 (React 19, TypeScript)
- Zustand for state management
- React Hook Form for form handling
- CSS Modules for component-scoped styling
- Axios for API requests

**Server**
- NestJS 11 (TypeScript)
- TypeORM + PostgreSQL
- JWT authentication (Passport, bcrypt for password hashing)
- Jamendo API integration for track search and discovery
- class-validator / class-transformer for request validation

## Features

- **Authentication** — user registration and login with JWT-based sessions
- **Track discovery** — search, browse popular tracks, and filter by genre via the Jamendo API
- **Playlists** — create, update, and delete playlists; add or remove tracks from a playlist
- **Player** — in-app audio player with track queue and playback controls
- **User accounts** — persistent user data and playlist ownership

## Project Structure

```
Wavely/
├── client/          # Next.js frontend
│   └── src/
│       ├── app/          # Routes (Next.js App Router)
│       ├── components/   # UI components (player, track list, playlists, header, etc.)
│       ├── store/        # Zustand state
│       ├── services/     # API service layer
        ├── ui/           # Shared UI
│       └── api/          # API client setup
└── server/          # NestJS backend
    └── src/
        ├── auth/          # JWT authentication
        ├── users/         # User entity and logic
        ├── tracks/        # Track entity
        ├── playlists/     # Playlist CRUD + track associations
        └── jamendo/       # Jamendo API integration

## Status

Personal project, actively developed as a portfolio piece to demonstrate full-stack architecture: relational data modeling (TypeORM/PostgreSQL), third-party API integration, and authenticated CRUD flows across a Next.js + NestJS stack.
