# SalonBook — Salon Appointment Booking Platform

A modern, full-stack salon appointment booking platform featuring a responsive user interface, secure authentication, appointment management, online payments, and role-based dashboards.

## Live Links

- **Live Website:** https://a9-salonbook-client.vercel.app
- **Frontend Repository:** https://github.com/ArifsCreative/a9-salonbook-client
- **Backend Repository:** https://github.com/ArifsCreative/a9-salonbook-server
- **Backend API:** https://a9-salonbook-server.vercel.app

## Key Features

### Customer Features
- Browse available salon services.
- Search and filter services by category.
- View service details and pricing.
- Register and sign in using email and password.
- Google OAuth authentication integration.
- Book salon appointments.
- View and manage appointments.
- Cancel appointments.
- Pay securely using Stripe Checkout.
- View payment history.
- Access a personalized customer dashboard.

### Admin Features
- View dashboard statistics.
- Add, edit, and delete salon services.
- Manage customer appointments.
- View registered customers.
- Block or unblock customers.
- Monitor payment transactions.

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Authentication:** Better Auth
- **Payments:** Stripe Checkout
- **Backend:** Node.js, Express.js, MongoDB
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js and npm
- A running SalonBook backend server

### Installation

Clone the frontend repository:

```bash
git clone https://github.com/ArifsCreative/a9-salonbook-client.git
cd a9-salonbook-client
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production application |
| `npm run start` | Start the production server |

## Authentication and Authorization

SalonBook uses Better Auth for authentication. The backend provides role-based authorization for customers and administrators.

Protected features require authentication, and administrator operations are restricted to authorized admin accounts.

## Payment Integration

Stripe Checkout handles online appointment payments. Payment verification and transaction recording are managed by the backend using Stripe webhooks.

## Responsive Design

The application is designed for desktop, tablet, and mobile devices, featuring responsive navigation, service listings, appointment management, and dashboards.

## Deployment

The frontend is deployed on Vercel.

**Production URL:** https://a9-salonbook-client.vercel.app

Configure `NEXT_PUBLIC_API_URL` in Vercel to point to the deployed backend API.

## Related Repository

**SalonBook Backend:** https://github.com/ArifsCreative/a9-salonbook-server

## Project Purpose

Developed as a full-stack web development assignment to demonstrate authentication, role-based access control, REST API integration, database operations, appointment management, payment processing, and responsive frontend development.