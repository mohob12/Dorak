# Dorak | دورك

Dorak is a React/Vite queue-management web app.

## Deployment settings

Use these settings on a static hosting provider such as Vercel, Netlify, or similar:

- Framework preset: Vite
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

The project uses `package-lock.json` and npm for deployment.

## Environment variables

For production, configure these variables in the hosting dashboard:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Routing

The app uses React Router. Fallback routing is configured for:

- Vercel: `vercel.json`
- Netlify/static hosts: `public/_redirects`
