/* ==========================================================================
   registry.js — registro central de todas as calculadoras.
   Para adicionar um tumor novo: crie js/calculators/<nome>.js e importe aqui.
   ========================================================================== */

import colorectal from './calculators/colorectal.js';
import gastric from './calculators/gastric.js';

export const calculators = [
  colorectal,
  gastric,
];

/** Ordem das seções na página inicial. */
export const sectionOrder = [
  'Trato Gastrointestinal',
  'Trato Geniturinário',
  'Mama',
  'Trato Ginecológico',
  'Cabeça e Pescoço',
  'Tórax / Pulmão',
  'Pele',
  'Tecidos Moles e Osso',
  'Sistema Endócrino',
  'Sistema Nervoso Central',
  'Sistema Hematolinfoide',
];

export function getCalculator(id) {
  return calculators.find(c => c.id === id) || null;
}

/** Agrupa por seção respeitando sectionOrder; extras vão para o fim. */
export function groupBySection() {
  const groups = new Map();
  for (const c of calculators) {
    if (!groups.has(c.section)) groups.set(c.section, []);
    groups.get(c.section).push(c);
  }
  const ordered = [];
  for (const s of sectionOrder) {
    if (groups.has(s)) { ordered.push([s, groups.get(s)]); groups.delete(s); }
  }
  for (const [s, items] of groups) ordered.push([s, items]);
  ordered.forEach(([, items]) => items.sort((a, b) => a.name.localeCompare(b.name, 'pt')));
  return ordered;
}
