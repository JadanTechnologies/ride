<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Keke Napepe Ride - Multi-User Ride-Sharing Platform

A modern, full-featured ride-sharing application built with **React**, **TypeScript**, and **Vite**. Supports passengers, drivers, and admin management with real-time ride tracking, dynamic pricing, and AI-powered support.

🚀 **Live Demo**: [View your app in AI Studio](https://ai.studio/apps/drive/1LI97RAFj0PKaxNVZHZUdE99XltCJYoQc)

## Features

### For Passengers
- 🚗 **Book rides** - Choose from Keke, Okada, or Bus options
- 📍 **Real-time tracking** - See driver location and ETA
- 💳 **Multiple payment options** - Wallet, card, or cash
- 📱 **Ride history** - Track all past rides
- 💬 **AI support** - KekeBot chatbot for instant help
- ⭐ **Rating system** - Rate drivers after each ride

### For Drivers
- 📊 **Earnings dashboard** - Track daily/weekly/monthly income
- 📬 **Ride requests** - Accept incoming ride requests
- 💰 **Withdrawal requests** - Request payouts to bank account
- 🎯 **Surge pricing awareness** - See when premium rates apply
- 📈 **Performance metrics** - Monitor rating and ride count

### For Admins
- 📈 **Analytics dashboard** - Revenue, rides, users, and disputes
- 💰 **Dynamic pricing** - Set fares per vehicle type
- ⚙️ **Platform controls** - Adjust commission, surge multiplier
- 👥 **User management** - Approve drivers, manage accounts
- 🚨 **Dispute resolution** - Handle complaints between users
- 📢 **Announcements** - Broadcast messages to all users

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State**: React Hooks + localStorage
- **Deployment**: Compatible with Vercel, Netlify, Docker

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/JadanTechnologies/ride.git
   cd ride
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional for AI features):
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add VITE_GEMINI_API_KEY if needed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   ```
   http://localhost:3000
   ```

## Demo Accounts

The app includes pre-configured demo accounts for testing:

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| **Passenger** | chioma@example.com | password | Can book rides |
| **Driver** | emeka@example.com | password | Can accept rides |
| **Admin** | admin@example.com | password | Full platform control |

## Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
ride/
├── components/            # Reusable UI components
│   ├── Button.tsx
│   ├── ChatWidget.tsx     # AI support chatbot
│   ├── Toast.tsx          # Notifications
│   ├── ErrorBoundary.tsx  # Error handling
│   └── MobileMenu.tsx     # Mobile navigation
├── views/                 # Full-page components
│   ├── Auth.tsx           # Login/signup
│   ├── PassengerPortal.tsx
│   ├── DriverPortal.tsx
│   └── AdminDashboard.tsx
├── services/              # Business logic & APIs
│   └── geminiService.ts   # AI integration
├── hooks/                 # Custom React hooks
│   └── useLocalStorage.ts # Persistent state
├── App.tsx                # Main app component
├── types.ts               # TypeScript definitions
├── constants.ts           # App configuration
└── index.html             # HTML entry point
```

## Features Breakdown

### Ride Booking (Passenger Portal)
- Enter pickup and dropoff locations
- Get instant fare estimates
- Choose vehicle type
- Real-time driver tracking
- Rate driver after completion
- View ride history

### Driver Operations (Driver Portal)
- Toggle online/offline status
- Accept incoming ride requests
- Navigation and trip tracking
- Earnings tracking
- Withdrawal management
- Performance ratings

### Admin Controls (Admin Dashboard)
- Real-time platform analytics
- Driver and user management
- Pricing configuration (per vehicle, per km)
- Commission rate adjustment
- Surge pricing control
- Dispute handling
- Broadcast announcements

## Configuration

### Pricing
Edit pricing in `constants.ts`:

```typescript
export const PRICING = {
  [VehicleType.KEKE]: { base: 200, perKm: 100, isActive: true },
  [VehicleType.OKADA]: { base: 150, perKm: 80, isActive: true },
  [VehicleType.BUS]: { base: 300, perKm: 150, isActive: true },
};
```

### Commission
Adjust platform commission in `constants.ts`:

```typescript
export const DEFAULT_COMMISSION = 15; // 15% per ride
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Vercel (recommended)
- Netlify
- Docker / Traditional servers

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Setting up development environment
- Code standards
- Testing the app
- Submitting changes

## AI Features

The app includes optional AI support via Google Gemini. To enable:

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com)
2. Create a server-side proxy endpoint to handle API calls (recommended for security)
3. Set `VITE_GEMINI_API_KEY` in `.env.local`
4. The app falls back to rule-based responses if API is unavailable

## Security Notes

- ✅ API keys stored in environment variables only
- ✅ No sensitive data in localStorage without encryption
- ✅ CORS configured for backend APIs
- ✅ XSS protection via React's built-in escaping
- ⚠️ Implement backend authentication for production use

## Roadmap

- [ ] Real database integration (Firebase/PostgreSQL)
- [ ] Google Maps integration for real navigation
- [ ] Payment gateway integration (Stripe, Flutterwave)
- [ ] Push notifications
- [ ] In-app messaging
- [ ] Advanced analytics
- [ ] Multi-language support

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

- 📧 Email: support@jadan.tech
- 🐛 Issues: [GitHub Issues](https://github.com/JadanTechnologies/ride/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/JadanTechnologies/ride/discussions)

## Credits

Built by Jadan Technologies with ❤️ for the Nigerian mobility ecosystem.

---

**Last Updated**: December 13, 2025
**Version**: 0.0.1 (Beta)
