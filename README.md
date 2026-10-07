# Vizualizer Web

The Vizualizer website: React + Vite + TypeScript. It uses the **same server and database**
as the Vizualizer mobile app, so one account works on both.

## Requirements

- Node.js 20 or 22
- The Vizualizer server running (`npm run dev` in the server folder, port 5000)

## Run (development)

```
npm install
npm run dev
```

Open http://localhost:5173

The website talks to the server on the same computer at port 5000 automatically.
To use a different server address, copy `.env.example` to `.env` and set `VITE_API_URL`.

## Build for hosting

```
npm run build
```

The finished site is created in the `dist` folder.

## Status

Matches the mobile app so far: luxury UI (light/dark), real login/register (JWT),
Create steps with image upload, checking and compression. Generating visualizations
comes with the next phases (shared with the mobile app).
# Vizualize_Web
