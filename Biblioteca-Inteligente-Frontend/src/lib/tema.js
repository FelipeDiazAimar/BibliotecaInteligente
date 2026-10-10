/** Tema claro/oscuro global (contrato compartido).
 *
 * El toggle vive en el Header (no todas las rutas lo montan: /panel no
 * tiene Header), así que el tema guardado se aplica aquí en el arranque
 * para que TODAS las páginas respeten `localStorage 'header-theme'`.
 * Marcas que se setean (las mismas que usa ThemeToggle):
 * - documentElement[data-theme] + colorScheme
 * - body[data-header-theme] + body.dark
 */
export function leerTemaGuardado() {
  try {
    const stored = localStorage.getItem('header-theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    /* almacenamiento no disponible: default claro */
  }
  return 'light';
}

export function aplicarTema(theme) {
  const mode = theme === 'dark' ? 'dark' : 'light';
  try {
    localStorage.setItem('header-theme', mode);
  } catch {
    /* ignorar cuota/privado */
  }
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
  document.body.setAttribute('data-header-theme', mode);
  document.body.classList.toggle('dark', mode === 'dark');
}

/** Aplica el tema guardado (default claro). Llamar una vez en el arranque. */
export function initTema() {
  aplicarTema(leerTemaGuardado());
}
