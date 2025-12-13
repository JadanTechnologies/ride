# Project Files & Structure

## Root Files
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `API.md` - Backend API specification (future integration)
- `CONTRIBUTING.md` - Development guidelines
- `DEPLOYMENT.md` - Production deployment guide
- `package.json` - NPM dependencies and scripts
- `PROJECT_SUMMARY.md` - Comprehensive project overview
- `QUICK_REFERENCE.md` - Developer quick reference
- `README.md` - Main project documentation
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `index.html` - HTML entry point
- `index.tsx` - React entry point with ErrorBoundary

## Components (`components/`)
- `Button.tsx` - Reusable button component (primary, secondary, danger, ghost variants)
- `ChatWidget.tsx` - AI chatbot interface with KekeBot
- `ErrorBoundary.tsx` - Error boundary for graceful error handling
- `MobileMenu.tsx` - Mobile-friendly navigation menu
- `Toast.tsx` - Notification/toast system

## Hooks (`hooks/`)
- `useLocalStorage.ts` - Custom hook for persistent state management

## Services (`services/`)
- `geminiService.ts` - AI integration (client-safe with fallback)

## Views (`views/`)
- `Auth.tsx` - Authentication (login/signup) with multi-language support
- `PassengerPortal.tsx` - Passenger interface (book rides, history, wallet)
- `DriverPortal.tsx` - Driver interface (accept rides, earnings, withdrawals)
- `AdminDashboard.tsx` - Admin dashboard (analytics, settings, management)

## Core Files
- `App.tsx` - Main app component with routing and state management
- `types.ts` - TypeScript interfaces and enums
- `constants.ts` - App configuration and mock data

## Configuration
- `.env.example` - Template for environment variables
- `.gitignore` - Git ignore patterns
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript compiler options
- `vite.config.ts` - Vite build configuration

## Documentation
- `README.md` - Main documentation and quick start
- `DEPLOYMENT.md` - Deployment instructions
- `CONTRIBUTING.md` - Contribution guidelines
- `API.md` - Backend API specification
- `PROJECT_SUMMARY.md` - Project overview and features
- `QUICK_REFERENCE.md` - Developer quick reference
- `FILES.md` - This file

## Generated Folders (not in repo)
- `node_modules/` - Installed dependencies
- `dist/` - Production build output

## Total File Count
- **Source files**: 18 (.tsx, .ts)
- **Documentation**: 7 (.md)
- **Config files**: 5 (.json, .html, .ts)
- **Total tracked**: 30 files

## Key File Sizes (approximate)
- `App.tsx`: ~6 KB (main app logic)
- `PassengerPortal.tsx`: ~15 KB (largest component)
- `AdminDashboard.tsx`: ~26 KB (complex dashboard)
- `Auth.tsx`: ~12 KB (authentication)
- `services/geminiService.ts`: ~2 KB (AI service)

## Dependencies Installed
- `react@18.2.0` - UI framework
- `react-dom@18.2.0` - React DOM rendering
- `typescript@5.8.2` - Type checking
- `vite@6.4.1` - Build tool
- `lucide-react@0.297.0` - Icon library
- `recharts@2.6.2` - Charts library
- `@vitejs/plugin-react@4.0.0` - React Fast Refresh

## Build Artifacts
- `package-lock.json` - Dependency lock file
- `.git/` - Git repository

## How to Use This Structure

### To Add a Feature
1. **Component**: Add to `components/`
2. **View/Page**: Add to `views/`
3. **Type**: Update `types.ts`
4. **Logic**: Add to `services/` or hooks
5. **Integration**: Update `App.tsx`
6. **Styles**: Use Tailwind classes

### To Modify Pricing
1. Edit `constants.ts` - PRICING object

### To Add Admin Features
1. Update `views/AdminDashboard.tsx`
2. Add to `App.tsx` - state management
3. Update `types.ts` if needed

### To Deploy
1. Run `npm run build`
2. Deploy `dist/` folder to hosting
3. See `DEPLOYMENT.md` for details

## File Dependencies

```
index.tsx
  ├── components/ErrorBoundary.tsx
  └── App.tsx
        ├── views/Auth.tsx
        ├── views/PassengerPortal.tsx
        ├── views/DriverPortal.tsx
        ├── views/AdminDashboard.tsx
        ├── components/ChatWidget.tsx
        ├── components/Toast.tsx
        ├── types.ts
        ├── constants.ts
        └── hooks/useLocalStorage.ts
             └── (React hooks)

services/geminiService.ts
  └── (Fetch API, optional AI backend)

components/Button.tsx
  └── (Used by all views)

components/MobileMenu.tsx
  └── (Used by views)
```

## Next Steps

1. **Review** - Read README.md and PROJECT_SUMMARY.md
2. **Setup** - Install dependencies: `npm install`
3. **Develop** - Start dev server: `npm run dev`
4. **Test** - Try different user roles
5. **Build** - Create production build: `npm run build`
6. **Deploy** - Follow DEPLOYMENT.md
7. **Contribute** - See CONTRIBUTING.md for guidelines

---

**Document Version**: 1.0  
**Last Updated**: December 13, 2025  
**Maintainer**: Jadan Technologies
