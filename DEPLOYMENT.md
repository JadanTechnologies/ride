# Deployment Guide

## Prepare for Production

### Build the app

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Preview production build locally

```bash
npm run preview
```

Then visit `http://localhost:4173` to test the production build.

## Deployment Options

### 1. Vercel (Recommended for React/Vite apps)

1. Push your code to GitHub
2. Connect your repo at [vercel.com](https://vercel.com)
3. Vercel auto-detects Vite and builds automatically
4. Deployed at `your-app.vercel.app`

### 2. Netlify

1. Push your code to GitHub
2. Connect at [netlify.com](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy automatically on push

### 3. Traditional Server / Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and run:

```bash
docker build -t keke-napepe-ride .
docker run -p 3000:3000 keke-napepe-ride
```

## Environment Variables

For production deployments:

1. Set `VITE_GEMINI_API_KEY` if using Google Gemini (requires backend proxy)
2. Ensure backend API endpoints are configured if using real services

## Performance Optimization Tips

- The app uses Tailwind CSS via CDN. For production, consider building it locally:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- Monitor bundle size: `npm run build -- --analyze`
- Use Code Splitting: the app already lazy-loads components via React Router if needed

## Security Checklist

- [ ] API keys are only in environment variables, never hardcoded
- [ ] Sensitive data is not logged to console in production
- [ ] HTTPS is enforced on the deployment domain
- [ ] CORS is properly configured for backend APIs
- [ ] localStorage data is sanitized and validated
