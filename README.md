# 🩸 Blood Logistic Platform

A real-time full-stack web platform that connects **blood donors with hospitals**, solving the critical problem of blood availability in emergencies. Built with **Next.js 15**, **TypeScript**, **MongoDB**, and **Socket.io** for live communication.

🔗 **Live Demo:** [blood-logistic-platform.vercel.app](https://blood-logistic-platform.vercel.app)

---

## The Problem It Solves

In medical emergencies, hospitals struggle to locate compatible blood donors quickly. This platform bridges that gap by enabling real-time donor-to-hospital connections with live location tracking and instant notifications.

---

## Features

- 🔐 **Authentication** — Secure login/signup with NextAuth.js, JWT, bcrypt, and OTP verification
- 🗺️ **Live Map** — Interactive donor and hospital location tracking with Leaflet & React Leaflet
- ⚡ **Real-Time Communication** — Instant donor-hospital messaging via Socket.io WebSockets
- 📧 **Email Notifications** — Automated alerts using Nodemailer and React Email templates
- 📊 **Dashboard & Analytics** — Charts and stats via Chart.js and react-chartjs-2
- 📄 **PDF Reports** — Export donor/hospital reports with jsPDF and jsPDF-autotable
- 🔒 **Rate Limiting** — API protection via Upstash Redis
- 🌗 **Dark / Light Mode** — Theme toggle with next-themes
- 🎞️ **Animations** — Smooth UI transitions with Framer Motion
- ✅ **Form Validation** — React Hook Form + Zod schema validation
- 🔔 **Toast Notifications** — Real-time feedback with Sonner and react-hot-toast

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | NextAuth.js v4, JWT, bcrypt |
| Real-Time | Socket.io (server + client) |
| Maps | Leaflet, React Leaflet |
| Email | Nodemailer, React Email |
| Charts | Chart.js, react-chartjs-2 |
| Rate Limiting | Upstash Redis |
| PDF | jsPDF, jsPDF-autotable |
| Styling | Tailwind CSS v4, Framer Motion |
| Forms | React Hook Form, Zod |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB URI
- Upstash Redis credentials
- SMTP credentials for email

### Installation

```bash
git clone https://github.com/Waqar-Rajpoot/Blood-logistic-platform.git
cd Blood-logistic-platform
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# Database
MONGODB_URI=your_mongodb_uri

# Auth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret

# Email
EMAIL_HOST=your_smtp_host
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** This project uses a custom `server.js` to support Socket.io alongside Next.js. The WebSocket server runs alongside the Next.js app on the same port.

---

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages & API routes
│   ├── components/       # Reusable UI components
│   ├── lib/              # DB connection, utilities, helpers
│   └── models/           # Mongoose data models
├── emailTemplates/       # React Email templates
├── public/               # Static assets
├── server.js             # Custom Node server with Socket.io
└── ...
```

---

## Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Deployment

> ⚠️ **Important:** Socket.io requires a persistent Node.js server. Vercel's serverless functions do **not** natively support WebSockets. For full real-time functionality in production, consider deploying to **Railway**, **Render**, or a **VPS** instead of Vercel.

---

## Author

**Waqar Rajpoot** — [GitHub](https://github.com/Waqar-Rajpoot) · [Portfolio](https://waqar-softwaredev-portfolio.vercel.app)