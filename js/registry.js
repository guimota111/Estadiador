/* ==========================================================================
   registry.js — registro central de todas as calculadoras.
   Para adicionar um tumor novo: crie js/calculators/<nome>.js e importe aqui.
   ========================================================================== */

import colorectal from './calculators/colorectal.js';
import gastric from './calculators/gastric.js';
import breastInvasive from './calculators/breast_invasive.js';
import breastDcis from './calculators/breast_dcis.js';
import breastPhyllodes from './calculators/breast_phyllodes.js';
import netColorectal from './calculators/net_colorectal.js';
import netDuodAmp from './calculators/net_duodamp.js';
import netJejIleum from './calculators/net_jejileum.js';
import netPancreas from './calculators/net_pancreas.js';
import bileductPerihilar from './calculators/bileduct_perihilar.js';
import gallbladder from './calculators/gallbladder.js';
import adrenal from './calculators/adrenal.js';

export const calculators = [
  breastInvasive,
  breastDcis,
  breastPhyllodes,
  colorectal,
  gastric,
  netColorectal,
  netDuodAmp,
  netJejIleum,
  netPancreas,
  bileductPerihilar,
  gallbladder,
  adrenal,
];

/** Ordem das seções na página inicial. */
export const sectionOrder = [
  'Trato Gastrointestinal',
  'Fígado e Vias Biliares',
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
