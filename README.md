## BookCourier – Library-to-Home Delivery System

## Project Overview
BookCourier helps users request book pickup/delivery from nearby libraries...

## Live Link
https://your-client-url.com

## Key Features
- Firebase Authentication (Email/Google)
- Librarian/Admin/User dashboards
- Add/Edit/Publish Books
- Order management + Stripe payments
- Wishlists, Reviews, Search & Sort
- Coverage map showing cities

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Firebase
- Backend: Node, Express, MongoDB, Firebase Admin
- Payments: Stripe

## Setup (Client)
1. copy `.env.example` to `.env` and fill values
2. `cd client && npm install`
3. `npm run dev`

## Setup (Server)
1. copy `.env.example` to `.env`
2. `cd server && npm install`
3. `npm run dev`

## Deployment Notes
- Add production domain to Firebase Console Authentication -> Authorized domains
- Set env vars in hosting provider (Netlify/Vercel for client, Render/Railway for server)
- Ensure server CORS whitelist contains client production URL

## Author
Your Name
