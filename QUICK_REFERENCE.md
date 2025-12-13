# Quick Reference Guide

## Running the App

```bash
npm install      # First time only
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Build for production
npm run preview  # Preview production build
```

## File Locations

### Add a New Component
**Location**: `components/YourComponent.tsx`

Template:
```tsx
import React from 'react';

interface YourComponentProps {
  title: string;
  onClick: () => void;
}

export const YourComponent: React.FC<YourComponentProps> = ({ title, onClick }) => {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="font-bold">{title}</h2>
      <button onClick={onClick} className="mt-2 px-4 py-2 bg-brand-600 text-white rounded">
        Click
      </button>
    </div>
  );
};
```

### Add a New View/Page
**Location**: `views/YourView.tsx`

Template:
```tsx
import React from 'react';

interface YourViewProps {
  user: any;
  onLogout: () => void;
}

export const YourView: React.FC<YourViewProps> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold">Welcome</h1>
    </div>
  );
};
```

### Add Persistent State
```tsx
import { useLocalStorage } from '../hooks/useLocalStorage';

const [value, setValue] = useLocalStorage('key', initialValue);
```

## Common Patterns

### Form Handling
```tsx
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  // ... do something
  setLoading(false);
};

<form onSubmit={handleSubmit}>
  <input value={email} onChange={(e) => setEmail(e.target.value)} />
  <Button type="submit" isLoading={loading}>Submit</Button>
</form>
```

### Show Notification
```tsx
onNotify('success', 'Payment completed!');
onNotify('error', 'Something went wrong');
onNotify('info', 'Processing...');
```

### Conditional Rendering
```tsx
{role === UserRole.PASSENGER && <PassengerPortal ... />}
{role === UserRole.DRIVER && <DriverPortal ... />}
{role === UserRole.ADMIN && <AdminDashboard ... />}
```

### Using Icons
```tsx
import { MapPin, Navigation, Clock, Star } from 'lucide-react';

<MapPin size={20} className="text-brand-600" />
<Navigation className="w-8 h-8" />
<Clock size={16} />
<Star className="w-4 h-4 fill-current" />
```

## Styling Quick Reference

### Colors
```
brand (primary): bg-brand-600, text-brand-600, border-brand-600
success: bg-green-600, text-green-600
danger: bg-red-600, text-red-600
warning: bg-yellow-600, text-yellow-600
info: bg-blue-600, text-blue-600
gray: bg-gray-100 to gray-900
```

### Common Classes
```
p-4          # padding: 1rem
mx-auto      # margin-x: auto (center)
flex         # display: flex
gap-3        # gap: 0.75rem
rounded-lg   # border-radius: 0.5rem
shadow-lg    # box-shadow: large
hover:bg-*   # hover state
transition   # smooth transitions
```

### Responsive
```
md:             # medium screens (768px+)
lg:             # large screens (1024px+)
hidden md:flex  # hide on mobile, show on desktop
w-full md:w-1/2 # full width mobile, 50% on desktop
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, then commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
```

## Common Issues & Fixes

### Issue: "Port 3000 already in use"
```bash
# Kill process on port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or just restart dev server, it will use 3001
```

### Issue: localStorage not persisting
- Check browser's private/incognito mode
- Check if localStorage is enabled
- Check quota limits (usually 5-10MB per domain)

### Issue: Styles not applying
- Check class name spelling
- Ensure Tailwind is configured (it's in index.html via CDN)
- Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: Type errors
- Check interfaces in `types.ts`
- Verify component props match interface
- Use `React.FC<PropInterface>` for type safety

## Debugging

### Enable console logs
```tsx
console.log('Debug:', value);
console.warn('Warning:', issue);
console.error('Error:', err);
```

### React DevTools
- Install React Developer Tools extension
- Inspect component props and state
- Check re-render performance

### Network Tab
- Open DevTools > Network
- Check API calls (fetch)
- Monitor bundle size

## Database & Backend (Future)

When implementing backend:

1. **Install axios**: `npm install axios`
2. **Create API service**: `services/api.ts`
3. **Replace mock calls** with API calls
4. **Update types** for real data structures
5. **Implement auth** (JWT tokens)
6. **Add loading states** during API calls

Example:
```tsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com/v1',
});

export const getRides = async () => {
  const response = await api.get('/rides');
  return response.data;
};
```

## Deploy (Quick Checklist)

- [ ] Run `npm run build` (no errors)
- [ ] Check for console warnings
- [ ] Test all features locally
- [ ] Update version in package.json
- [ ] Commit and push to GitHub
- [ ] Connect to Vercel/Netlify
- [ ] Set environment variables on platform
- [ ] Test deployed version

## Useful Links

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Vite Docs](https://vitejs.dev)
- [Recharts](https://recharts.org)

## Team Contacts

- **Frontend Lead**: [Your Name]
- **Backend API**: [Team Email]
- **DevOps**: [Team Email]
- **Product Manager**: [Team Email]

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.0.1 | Dec 13, 2025 | Initial release (Beta) |

---

**Last Updated**: December 13, 2025
