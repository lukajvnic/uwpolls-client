<p align="center">
  <h1 align="center">🗳️ UW Polls — Frontend</h1>
  <p align="center">
    <strong>A sleek, modern polling application built with React 18 & TypeScript</strong>
  </p>
  <p align="center">
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</p>

---

## ✨ Overview

UW Polls is a real-time polling platform that enables users to create, vote on, and discover polls from the community. This repository contains the **frontend client** — a performant single-page application featuring a polished UI with smooth animations, infinite scrolling, and seamless authentication flows.

<br>

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite 6 with SWC |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) Primitives |
| **Styling** | Custom CSS with Tailwind-inspired utilities |
| **Authentication** | Google OAuth 2.0 + Email/Password |
| **State Management** | React Hooks (useState, useEffect, useRef) |
| **Notifications** | Sonner toast notifications |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

<br>

## 🎯 Features

### Core Functionality
- **🗳️ Poll Discovery** — Browse polls with smart filtering (Popular, Recent, New, My Polls)
- **📊 Real-time Voting** — Submit votes and see results update instantly
- **👁️ Peek Results** — Preview poll results without voting
- **✏️ Poll Creation** — Create custom polls with up to 4 options
- **♾️ Infinite Scrolling** — Seamless pagination using Intersection Observer API

### Authentication System
- **🔐 Dual Authentication** — Support for both Google OAuth and traditional email/password
- **🍪 Session Management** — Secure cookie-based sessions with the backend
- **👤 User-Specific Views** — Dynamic filter options based on auth state

### User Experience
- **🎨 Modern UI Design** — Glassmorphism effects with animated gradients
- **⚡ Optimized Performance** — Fast initial load with Vite + SWC compilation
- **📱 Responsive Layout** — Mobile-friendly design patterns
- **🔄 Loading States** — Elegant loading indicators throughout the app
- **🎭 Animated Transitions** — Smooth filter toggle with sliding bubble indicator

<br>

## 🏗️ Architecture

```
src/
├── components/
│   ├── ui/                  # 48+ Radix UI component primitives
│   ├── navbar.tsx           # Navigation with auth controls
│   ├── poll-card.tsx        # Interactive poll display component
│   ├── login-dialog.tsx     # Auth modal with OAuth & email login
│   └── create-poll-dialog.tsx  # Poll creation form
├── types/
│   └── poll.ts              # TypeScript interfaces
├── api.ts                   # REST API client layer
├── App.tsx                  # Main application component
├── main.tsx                 # React entry point
└── index.css                # Global styles & animations
```

### API Integration

The frontend communicates with a Rails 8 backend via a clean REST API layer:

```typescript
// Example API methods
api.fetchPolls({ filter: 'popular', page: 1 })
api.submitVote(pollId, optionNumber)
api.createPoll({ title, opt1, opt2, opt3, opt4 })
api.login({ email, password })
api.logout()
```

<br>

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/uwpolls-client.git
cd uwpolls-client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

The app will be running at `http://localhost:5431`

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

<br>

## 📦 Build & Deploy

```bash
# Production build
npm run build

# The build outputs to dist/ for deployment
```

The application is configured for seamless Vercel deployment with the included `vercel.json`.

<br>

## 🎨 Design Philosophy

This project emphasizes:

- **Type Safety** — Full TypeScript coverage for runtime reliability
- **Component Composition** — Leveraging Radix UI primitives for accessible, customizable components
- **Performance First** — Optimized bundle size and lazy loading patterns
- **Modern Aesthetics** — Contemporary design with animated gradients and glassmorphism

<br>

---

<p align="center">
  <sub>Built with ❤️ using React, TypeScript, and Radix UI</sub>
</p>
