import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext' // <-- agrega esto
import { initTema } from './lib/tema.js'

// El Header no está en todas las rutas (/panel no lo monta): el tema
// guardado se aplica acá para que claro/oscuro valga en toda la app.
initTema();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
)
