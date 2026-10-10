import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  DEMO_MODE,
  DEMO_USER,
  DEMO_CREDENTIALS,
  demoDelay,
} from "../lib/demo.js";

const UserContext = createContext(null);

/** Clave de sesión demo persistida en localStorage (contrato demo). */
export const DEMO_SESSION_KEY = "biblio_demo_session";

/** Flag de demo cerrada por logout (contrato R3: evita que el fallback reviva la sesión). */
export const DEMO_CLOSED_KEY = "biblio_demo_closed";

function leerSesionDemo() {
  // En modo real no se restaura nada: el flujo original arranca en null.
  if (!DEMO_MODE) return null;
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    const sesion = JSON.parse(raw);
    if (!sesion || typeof sesion !== "object" || !sesion.email) return null;
    return sesion;
  } catch {
    return null;
  }
}

function credencialesDemoValidas(email, password) {
  return (
    String(email ?? "").trim().toLowerCase() ===
      String(DEMO_CREDENTIALS.email).toLowerCase() &&
    String(password ?? "") === String(DEMO_CREDENTIALS.password)
  );
}

export function UserProvider({ children }) {
  // En DEMO_MODE restaura la sesión demo persistida; en modo real arranca en null.
  const [usuario, setUsuarioState] = useState(() => leerSesionDemo());
  const [cargandoSesion, setCargandoSesion] = useState(false);

  const setUsuario = useCallback((nuevo) => {
    setUsuarioState(nuevo);
  }, []);

  /** Crea una sesión demo (DEMO_USER + overrides) y la persiste en localStorage. */
  const loginDemo = useCallback(async (overrides = {}) => {
    setCargandoSesion(true);
    try {
      await demoDelay();
      const sesion = { ...DEMO_USER, ...overrides, isDemo: true };
      try {
        localStorage.removeItem(DEMO_CLOSED_KEY);
        localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(sesion));
      } catch {
        // Almacenamiento no disponible: la sesión queda solo en memoria.
      }
      setUsuarioState(sesion);
      return sesion;
    } finally {
      setCargandoSesion(false);
    }
  }, []);

  /** Login con email/password demo; lanza Error si no coinciden. */
  const loginConCredencialesDemo = useCallback(
    async (email, password) => {
      if (!credencialesDemoValidas(email, password)) {
        throw new Error("Credenciales demo inválidas.");
      }
      try {
        localStorage.removeItem(DEMO_CLOSED_KEY);
      } catch {
        // noop
      }
      return loginDemo();
    },
    [loginDemo]
  );

  /** Limpia la sesión demo y los restos de sesión real. */
  const logout = useCallback(() => {
    try {
      localStorage.removeItem(DEMO_SESSION_KEY);
    } catch {
      // noop
    }
    try {
      localStorage.setItem(DEMO_CLOSED_KEY, "1");
    } catch {
      // noop
    }
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("rol");
      localStorage.removeItem("usuario");
    } catch {
      // noop
    }
    setUsuarioState(null);
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      setUsuario,
      loginDemo,
      loginConCredencialesDemo,
      logout,
      cargandoSesion,
      isDemo: Boolean(DEMO_MODE && usuario && usuario.isDemo),
      DEMO_SESSION_KEY,
    }),
    [
      usuario,
      setUsuario,
      loginDemo,
      loginConCredencialesDemo,
      logout,
      cargandoSesion,
    ]
  );

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser debe usarse dentro de <UserProvider>.");
  }
  return ctx;
}
