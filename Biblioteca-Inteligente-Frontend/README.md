# Biblioteca Inteligente — Frontend

React 19 + Vite 6 + MUI + react-router-dom 7. Catálogo, turnos, panel de usuario/admin, asistente IA y voz IA.

## Modo demo

**¿Qué es?** El modo demo permite usar toda la app **sin backend ni base de datos**: la sesión inicia con un usuario simulado y cada llamada a la API usa `fetchConFallback` (si el fetch falla, se devuelve un dato local de respaldo en vez de romper la pantalla).

**¿Cómo entrar?**

1. Copiá la configuración de ejemplo (opcional, los valores por defecto ya activan la demo):
   - Windows: `copy .env.example .env`
   - Linux/Mac: `cp .env.example .env`
2. Asegurate de que `VITE_DEMO_MODE=true` (es el valor por defecto aunque no exista `.env`).
3. Corré el frontend: `npm run dev` y abrí la URL que muestra Vite.
4. Navegá libremente: las rutas protegidas (`/panel`, `/turnos`, `/admin`, `/admin-turnos`) renderizan sin pedir login en modo demo.

Para usar el backend real: `VITE_DEMO_MODE=false` y `VITE_API_URL=http://localhost:3000` (puerto que usa `biblioteca-inteligente-backend/server.js`).

**Credenciales demo:**

- Email: `demo@biblioteca.local`
- Contraseña: `demo1234`

(Ver `src/lib/demo.js`: `DEMO_USER`, `DEMO_CREDENTIALS`, `demoDelay`, `fetchConFallback`.)

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm run lint` — ESLint
- `npm run preview` — previsualizar el build

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
