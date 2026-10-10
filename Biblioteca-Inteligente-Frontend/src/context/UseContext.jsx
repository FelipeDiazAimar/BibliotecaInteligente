// Archivo legacy con nombre alternativo: re-exporta el contexto único de
// UserContext para no crear dos contextos desincronizados.
// Único source of truth: ./UserContext.jsx
export {
  UserProvider,
  useUser,
  DEMO_SESSION_KEY,
} from "./UserContext.jsx";
