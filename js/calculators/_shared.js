/* ==========================================================================
   _shared.js — utilidades comuns às calculadoras de mama (AJCC 8ª ed.)
   ========================================================================== */

/** Prefixo do estadiamento patológico conforme o modificador. */
export function prefix(mod) {
  if (mod === 'y') return 'yp';
  if (mod === 'r') return 'rp';
  return 'p';
}

/**
 * Categoria pN axilar a partir das contagens.
 * macro = linfonodos com macrometástase (>2 mm)
 * micro = linfonodos com micrometástase (>0,2–2 mm)
 * itc   = linfonodos só com células tumorais isoladas (≤0,2 mm)
 * Regras AJCC 8ª ed. (via só axila):
 *  - só ITC .......................... N0(i+)
 *  - nenhum positivo, sem ITC ........ N0
 *  - só micrometástase(s) ............ N1mi (independe do nº)
 *  - 1–3 positivos (≥1 macro) ........ N1a
 *  - 4–9 positivos ................... N2a
 *  - ≥10 positivos ................... N3a
 */
export function axillaryPN(macro, micro, itc) {
  const ma = macro || 0, mi = micro || 0, it = itc || 0;
  const total = ma + mi; // ITC não conta para o total do pN
  if (total === 0) {
    if (it > 0) return { cat: 'N0(i+)', desc: 'somente células tumorais isoladas (≤0,2 mm)' };
    return { cat: 'N0', desc: 'sem metástase em linfonodos regionais' };
  }
  if (ma === 0 && mi > 0) return { cat: 'N1mi', desc: 'micrometástase(s) (>0,2–2 mm)' };
  if (total <= 3) return { cat: 'N1a', desc: `${total} linfonodo(s) axilar(es) com macrometástase` };
  if (total <= 9) return { cat: 'N2a', desc: `${total} linfonodos axilares acometidos` };
  return { cat: 'N3a', desc: `${total} linfonodos axilares acometidos` };
}

/** Monta a linha final de estadiamento a partir dos tokens não vazios. */
export function stagingLine(tokens) {
  const body = tokens.filter(Boolean).join(' ');
  return `Estadiamento patológico (AJCC 8ªed.): ${body}.`;
}

/** Lista de categorias pN para seleção manual (casos especiais). */
export const PN_OPTIONS = [
  { value: 'N0',      label: 'pN0 — sem metástase / só ITC' },
  { value: 'N0(i+)',  label: 'pN0(i+) — só células tumorais isoladas' },
  { value: 'N0(mol+)',label: 'pN0(mol+) — RT-PCR positivo, sem ITC' },
  { value: 'N1mi',    label: 'pN1mi — micrometástases' },
  { value: 'N1a',     label: 'pN1a — 1–3 axilares (≥1 macro)' },
  { value: 'N1b',     label: 'pN1b — mamária interna sentinela (excl. ITC)' },
  { value: 'N1c',     label: 'pN1c — pN1a + pN1b' },
  { value: 'N2a',     label: 'pN2a — 4–9 axilares (≥1 macro)' },
  { value: 'N2b',     label: 'pN2b — mamária interna clínica, axila negativa' },
  { value: 'N3a',     label: 'pN3a — ≥10 axilares ou infraclavicular' },
  { value: 'N3b',     label: 'pN3b — combinações (ver protocolo)' },
  { value: 'N3c',     label: 'pN3c — supraclavicular ipsilateral' },
];
