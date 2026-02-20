# Derek — Portfolio

Personal developer portfolio built with React, Tailwind CSS, and Framer Motion.

**Live:** [derekstudent.github.io/Portfolio](https://derekstudent.github.io/Portfolio/)

## Tech Stack

- **React 18** — Component-based UI
- **Vite** — Build tool & dev server
- **Tailwind CSS** — Utility-first styling with CSS variable theming
- **Framer Motion** — Animations & transitions
- **Three.js** — 3D model viewer (lazy-loaded)

## Features

- Dark / Light theme toggle
- Typewriter hero animation
- Scroll progress indicator
- Animated skill bars & stat counters
- Interactive tech strip with drag physics
- Project gallery with lightbox
- 3D model viewer (Blender → GLB)
- Live GitHub activity feed
- Contact form (Formspree)
- Snake mini-game
- Easter eggs (Konami code, secret terminal, hacker mode)
- Fully responsive
- GitHub Pages CI/CD

## Development

```bash
npm install
npm run dev
```

## Build & Preview

```bash
npm run build
npm run preview
```

## Deploy

Push to `main` — GitHub Actions automatically builds and deploys to GitHub Pages.

To deploy elsewhere (Vercel, Netlify), connect the repo and it will auto-detect the Vite config.

## License

MIT