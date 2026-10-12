<div align="center">

# 📚 BibliotecaInteligente — BiblioTech Full-Stack Monorepo

**Smart library system with AI assistant, room bookings and admin panel. React 19 + Vite + Express 5 + Sequelize + Postgres.**

[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-black?logo=express)](https://expressjs.com/)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://biblioteca-inteligente-tau.vercel.app)

**[🚀 Live Demo](https://biblioteca-inteligente-tau.vercel.app) · [📦 Monorepo](https://github.com/FelipeDiazAimar/BibliotecaInteligente) · [🇪🇸 Español](README.md)**

</div>

## What is it?

BiblioTech digitizes a real library: online catalog with covers, JWT auth with roles, AI assistant (OpenRouter, voice input), study-room bookings with guest invites, search history, user/admin panels. This monorepo runs **backend (`:3000`) + frontend (`:5173`) together** via `concurrently`. Also split into [Backend](https://github.com/FelipeDiazAimar/Repositorio-Backend-BibliotecaInteligente) and [Frontend](https://github.com/FelipeDiazAimar/repositoriofrontendbibliotech) repos.

## Demo

- Live: https://biblioteca-inteligente-tau.vercel.app · Local front `:5173`, back `:3000`.
- Credentials: `demo@biblioteca.local` / `demo1234`. Protected routes render without login in demo.
- Backend answers without Postgres: `GET /api/health` → `{ok, demo:true}`, `GET /api/libros` → 5 sample books, `POST /api/asistente/ask` → `[demo]` stub.

## Quick Start

```bash
git clone https://github.com/FelipeDiazAimar/BibliotecaInteligente.git
cd BibliotecaInteligente
npm run install-all
npm run dev
# 👉 http://localhost:5173
```

Real mode: `DEMO_MODE=false` + Postgres (`DATABASE_URL` or `DB_*`) + `JWT_SECRET` + `OPENROUTER_KEY`; frontend `VITE_DEMO_MODE=false` + `VITE_API_URL`. Backend: Express `5.1`, Sequelize `6.37`, JWT/bcrypt, Multer, Swagger. Frontend: React `19.1`, Vite `6/7`, Router `7.6`, MUI `7.1`.

## Author

**Felipe Diaz Aimar** — https://www.linkedin.com/in/felipe-aimar/ · felipediazaimar@gmail.com · https://github.com/FelipeDiazAimar
