import { useEffect, useState } from 'react';
import './ScrollTop.css';

/**
 * ScrollTop — botón flotante propio "volver arriba".
 *
 * Uso de una línea (montarlo dentro del Router, p. ej. en App.jsx
 * junto a `<AsistenteIA />`):
 *   <ScrollTop />
 *
 * NOTA R2-7: no se monta globalmente aquí porque App.jsx está fuera
 * de mi alcance (solo expongo el componente listo + sus estilos).
 * App.css ya está importado por la app; este CSS se aplica al
 * importar el componente (`import './ScrollTop.css'` de arriba).
 *
 * Comportamiento:
 * - Aparece tras 400px de scroll (listener pasivo + cleanup).
 * - Click → smooth scroll arriba (instantáneo con reduced-motion).
 * - Accesible: <button> nativo con aria-label + foco visible.
 */
const VISIBILITY_THRESHOLD = 400;

export default function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      setVisible(window.scrollY > VISIBILITY_THRESHOLD);
    };

    const onScroll = () => {
      // rAF-throttle: evita setState en cada píxel de scroll.
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update(); // estado inicial (p. ej. recarga a mitad de página)
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      className={`scroll-top${visible ? ' scroll-top--visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Volver arriba"
      title="Volver arriba"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg
        className="scroll-top__icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M12 19V5m0 0-7 7m7-7 7 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
