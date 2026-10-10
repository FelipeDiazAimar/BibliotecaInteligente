import { useCallback, useEffect, useState } from 'react';
import { aplicarTema, leerTemaGuardado } from '../lib/tema.js';

function readInitialTheme() {
  return leerTemaGuardado();
}

function applyTheme(theme) {
  aplicarTema(theme);
}

const SUN_PATHS = (
  <>
    <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2.5v2.2M12 19.3v2.2M4.3 4.3l1.6 1.6M18.1 18.1l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.3 19.7l1.6-1.6M18.1 5.9l1.6-1.6" />
    </g>
  </>
);

const MOON_PATH = (
  <path
    d="M20.2 14.2A8.5 8.5 0 0 1 9.8 3.8a.7.7 0 0 0-.9-.9A10 10 0 1 0 21.1 15a.7.7 0 0 0-.9-.8Z"
    fill="currentColor"
    stroke="none"
  />
);

/**
 * ThemeToggle — botón pill premium autocontenido (sin props ni contexto).
 * R2-1 lo renderiza como `import ThemeToggle from './ThemeToggle';` + `<ThemeToggle />`.
 * Sincroniza: documentElement[data-theme] + body[data-header-theme] +
 * body.dark + localStorage 'header-theme' + colorScheme.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(readInitialTheme);
  const isDark = theme === 'dark';

  useEffect(() => {
    applyTheme(theme);
    // Sincroniza otras instancias en la misma pestaña (ej. drawer mobile).
    try {
      window.dispatchEvent(new Event('biblio:tema'));
    } catch {
      /* entorno sin window: nada que sincronizar */
    }
  }, [theme]);

  // Si otro componente legacy (Header) cambia el tema, sincronizar.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'header-theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
        setTheme(e.newValue);
      }
    };
    const onTemaPropio = () => {
      setTheme(readInitialTheme());
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('biblio:tema', onTemaPropio);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('biblio:tema', onTemaPropio);
    };
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <>
      <style>{`
        .r22-toggle { -webkit-tap-highlight-color: transparent; }
        .r22-toggle:focus { outline: none; }
        .r22-toggle:focus-visible {
          outline: 2px solid var(--biblio-focus, #2563eb);
          outline-offset: 3px;
        }
        .r22-toggle .r22-knob,
        .r22-toggle .r22-icon {
          transition: transform .45s cubic-bezier(.34,1.56,.64,1), opacity .3s ease, background-color .3s ease, color .3s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .r22-toggle .r22-knob, .r22-toggle .r22-icon { transition: none; }
        }
      `}</style>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        onClick={toggle}
        data-theme-toggle
        data-mode={isDark ? 'dark' : 'light'}
        className="r22-toggle"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          position: 'relative',
          width: 64,
          height: 36,
          padding: 3,
          borderRadius: 999,
          border: isDark ? '1px solid rgba(148,163,184,.45)' : '1px solid rgba(17,72,124,.28)',
          background: isDark
            ? 'linear-gradient(135deg,#0a1428 0%,#11487c 100%)'
            : 'linear-gradient(135deg,#dbeafe 0%,#fef3c7 100%)',
          boxShadow: isDark
            ? '0 2px 12px rgba(0,0,0,.45), inset 0 1px 2px rgba(255,255,255,.12)'
            : '0 2px 10px rgba(30,41,59,.12), inset 0 1px 2px rgba(255,255,255,.7)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {/* estrellitas decorativas en dark */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            opacity: isDark ? 1 : 0,
            transition: 'opacity .3s ease',
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at 20% 30%, rgba(255,255,255,.9) 0 1px, transparent 1.5px),' +
              'radial-gradient(circle at 32% 68%, rgba(255,255,255,.7) 0 1px, transparent 1.5px),' +
              'radial-gradient(circle at 44% 38%, rgba(255,255,255,.5) 0 1px, transparent 1.5px)',
          }}
        />
        <span
          aria-hidden="true"
          className="r22-knob"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: isDark ? '#0f2038' : '#ffffff',
            color: isDark ? '#e3c455' : '#b45309',
            boxShadow: isDark
              ? '0 1px 6px rgba(0,0,0,.6), 0 0 0 1px rgba(227,196,85,.25)'
              : '0 1px 5px rgba(30,41,59,.3), 0 0 0 1px rgba(180,83,9,.15)',
            transform: isDark ? 'translateX(28px) rotate(360deg)' : 'translateX(0) rotate(0deg)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <svg
            className="r22-icon"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{
              position: 'absolute',
              opacity: isDark ? 0 : 1,
              transform: isDark ? 'scale(.4) rotate(-90deg)' : 'scale(1) rotate(0deg)',
            }}
          >
            {SUN_PATHS}
          </svg>
          <svg
            className="r22-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{
              position: 'absolute',
              opacity: isDark ? 1 : 0,
              transform: isDark ? 'scale(1) rotate(0deg)' : 'scale(.4) rotate(90deg)',
            }}
          >
            {MOON_PATH}
          </svg>
        </span>
      </button>
    </>
  );
}
