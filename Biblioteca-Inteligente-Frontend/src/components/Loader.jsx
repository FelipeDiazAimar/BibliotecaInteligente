import '../styles/Loader.css';

/**
 * Loader reutilizable.
 *
 * @param {string|null} message - Mensaje opcional (null/'' lo oculta).
 * @param {boolean} overlay - true = overlay a pantalla completa (default,
 *   conserva el uso actual `<Loader />`); false = versión inline.
 * @param {boolean} inline - Alias de `overlay={false}` para uso en línea
 *   dentro de botones, tarjetas, etc.
 * @param {number} size - Diámetro del spinner en px.
 */
export default function Loader({
  message = 'Cargando...',
  overlay = true,
  inline = false,
  size = 56,
}) {
  const label = message ?? 'Cargando...';
  const style = { '--bi-loader-size': `${Number(size) || 56}px` };

  if (inline || !overlay) {
    return (
      <div className="loader-inline" role="status" aria-live="polite" style={style}>
        <div className="loader-spinner loader-spinner--inline" aria-hidden="true" />
        {label ? <span className="loader-text">{label}</span> : null}
      </div>
    );
  }

  return (
    <div className="loader-overlay" role="status" aria-live="polite" style={style}>
      <div className="loader-card">
        <div className="loader-spinner" aria-hidden="true" />
        {label ? <div className="loader-text">{label}</div> : null}
      </div>
    </div>
  );
}
