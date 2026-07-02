/* icons.js — ícones (SVG inline) por seção. Estilo linha, herda currentColor. */

const P = 'stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"';

const ICONS = {
  'Trato Gastrointestinal': `<path d="M3 12h4l2 5 4-13 2 8h6" ${P}/>`,
  'Fígado e Vias Biliares': `<path d="M12 3s6 5.5 6 10a6 6 0 0 1-12 0c0-4.5 6-10 6-10z" ${P}/>`,
  'Mama': `<circle cx="12" cy="12" r="3.5" ${P}/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" ${P}/>`,
  'Trato Geniturinário': `<path d="M12 3v6M8 9h8l-1.5 8a3 3 0 0 1-3 2.6h-1a3 3 0 0 1-3-2.6z" ${P}/>`,
  'Trato Ginecológico': `<circle cx="12" cy="8" r="5" ${P}/><path d="M12 13v8M9 18h6" ${P}/>`,
  'Cabeça e Pescoço': `<circle cx="12" cy="8" r="4" ${P}/><path d="M12 12v4M8 20a4 4 0 0 1 8 0" ${P}/>`,
  'Tórax / Pulmão': `<path d="M12 4v8M12 8c0 3-3 3-3 6a3 3 0 0 1-6 0c0-4 3-6 3-8M12 8c0 3 3 3 3 6a3 3 0 0 0 6 0c0-4-3-6-3-8" ${P}/>`,
  'Pele': `<path d="M4 8a8 4 0 0 1 16 0v8a8 4 0 0 1-16 0z" ${P}/><path d="M8 12h.01M13 14h.01" ${P}/>`,
  'Tecidos Moles e Osso': `<path d="M7 5a2 2 0 1 0-2 2l3 3-3 3a2 2 0 1 0 2 2M17 5a2 2 0 1 1 2 2l-3 3 3 3a2 2 0 1 1-2 2" ${P}/>`,
  'Sistema Endócrino': `<path d="M13 2 4 13h6l-1 9 10-12h-6z" ${P}/>`,
  'Sistema Nervoso Central': `<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 2 4 3 3 0 0 0 5 1 3 3 0 0 0 5-1 3 3 0 0 0 2-4 3 3 0 0 0-1-5 3 3 0 0 0-3-3 3 3 0 0 0-6 0z" ${P}/>`,
  'Sistema Hematolinfoide': `<circle cx="8" cy="8" r="3" ${P}/><circle cx="16" cy="14" r="3" ${P}/><path d="M10 10l4 2" ${P}/>`,
};

const DEFAULT = `<rect x="4" y="4" width="7" height="7" rx="1.5" ${P}/><rect x="13" y="4" width="7" height="7" rx="1.5" ${P}/><rect x="4" y="13" width="7" height="7" rx="1.5" ${P}/><rect x="13" y="13" width="7" height="7" rx="1.5" ${P}/>`;

export function sectionIcon(name) {
  const inner = ICONS[name] || DEFAULT;
  return `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;
}
