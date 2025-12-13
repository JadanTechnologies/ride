# Contributing Guide

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/JadanTechnologies/ride.git
   cd ride
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser

## Project Structure

```
ride/
├── components/        # Reusable UI components (Button, Toast, ChatWidget, etc.)
├── hooks/             # Custom React hooks (useLocalStorage)
├── services/          # API/business logic (geminiService)
├── views/             # Full-page components (Auth, PassengerPortal, etc.)
├── App.tsx            # Main app component with routing logic
├── types.ts           # TypeScript interfaces and enums
├── constants.ts       # App constants (pricing, mock data, etc.)
├── index.tsx          # React DOM entry point
└── vite.config.ts     # Vite configuration
```

## Coding Standards

### TypeScript

- Always type props and state: `interface MyComponentProps { ... }`
- Use enums for fixed values (UserRole, VehicleType, etc.)
- Avoid `any` type unless absolutely necessary

### Components

- Functional components preferred
- Use React hooks for state management
- Props should be minimal and well-documented
- Use tailwind classes for styling (avoid inline styles)

### State Management

- Use React's `useState` for local component state
- Use custom `useLocalStorage` hook for persistence
- Pass callbacks to child components for updates

Example:

```tsx
import { useLocalStorage } from '../hooks/useLocalStorage';

export const MyComponent: React.FC = () => {
  const [count, setCount] = useLocalStorage('count', 0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
};
```

## Testing the App

### Login Credentials

The app uses mock authentication. Use any of these predefined users:

**Passenger:**
- Email: `chioma@example.com`
- Password: `password` (any password works in demo)

**Driver:**
- Email: `emeka@example.com`
- Password: `password`

**Admin:**
- Email: `admin@example.com`
- Password: `password`

### Features to Test

- [ ] User registration and login
- [ ] Booking rides as a passenger
- [ ] Accepting rides as a driver
- [ ] Admin pricing controls
- [ ] Withdrawal requests
- [ ] ChatBot support
- [ ] Mobile responsiveness
- [ ] localStorage persistence

## Making Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes

3. Test locally:
   ```bash
   npm run dev
   ```

4. Build to check for errors:
   ```bash
   npm run build
   ```

5. Commit and push:
   ```bash
   git add .
   git commit -m "feat: add my feature"
   git push origin feature/my-feature
   ```

6. Open a Pull Request

## Common Tasks

### Adding a New Component

1. Create file in `components/`:
   ```tsx
   import React from 'react';
   
   interface MyComponentProps {
     title: string;
     onClick: () => void;
   }
   
   export const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {
     return (
       <div className="p-4 bg-white rounded-lg">
         <h2 className="font-bold">{title}</h2>
         <button onClick={onClick} className="mt-2 px-4 py-2 bg-brand-600 text-white rounded">
           Click me
         </button>
       </div>
     );
   };
   ```

2. Export from `components/index.ts` if creating an index file:
   ```ts
   export { MyComponent } from './MyComponent';
   ```

3. Import and use in your view

### Adding a New Page/View

1. Create file in `views/`:
   ```tsx
   import React from 'react';
   
   interface MyViewProps {
     user: any;
     onLogout: () => void;
   }
   
   export const MyView: React.FC<MyViewProps> = ({ user, onLogout }) => {
     return (
       <div className="min-h-screen bg-gray-50 p-8">
         <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
       </div>
     );
   };
   ```

2. Add routing logic in `App.tsx`

### Styling

We use **Tailwind CSS** via CDN. Key color tokens:

- Primary (Brand): `brand-600`, `brand-700`, etc.
- Success: `green-600`
- Danger: `red-600`
- Warning: `yellow-600`
- Info: `blue-600`

Example button:

```tsx
<button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold transition-colors">
  Click me
</button>
```

## Debugging

### Check for errors in browser console

- Open DevTools (F12)
- Look for red errors in Console tab
- Check Network tab for failed API requests

### Using console.log

```ts
console.log('Debug message:', someVariable);
console.error('Error message:', error);
console.warn('Warning message:', warning);
```

### Using Error Boundary

The app uses an ErrorBoundary component to catch React errors gracefully. Check it in `components/ErrorBoundary.tsx`.

## Need Help?

- Check existing issues on GitHub
- Open a new issue with details and steps to reproduce
- Create a discussion for questions

Happy coding! 🎉
