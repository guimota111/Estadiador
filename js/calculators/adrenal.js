/* ==========================================================================
   Carcinoma Cortical da Adrenal — AJCC 8ª edição
   Base: CAP — Adrenal Gland (v4.3.1.0).
   ⚠️ Conteúdo para conferência pelo patologista responsável.
   ========================================================================== */

import { stagingLine } from './_shared.js';

export default {
  id: 'adrenal-cortical',
  name: 'Carcinoma Cortical da Adrenal',
  section: 'Sistema Endócrino',
  system: 'AJCC 8ª ed.',
  version: 'CAP — Adrenal Gland v4.3',
  reference: 'AJCC 8th ed. / CAP Adrenal 4.3.1.0',
  summary: 'Estadiamento pTNM e grupo prognóstico do carcinoma cortical da adrenal.',

  fields: [
    {
      id: 'pT', label: 'Categoria pT — Tumor primário', type: 'select', default: 'T2',
      hint: 'Não há categoria pTis na adrenal.',
      options: [
        { value: 'T0', label: 'pT0 — sem evidência de tumor primário' },
        { value: 'T1', label: 'pT1 — ≤5 cm, sem invasão extra-adrenal' },
        { value: 'T2', label: 'pT2 — >5 cm, sem invasão extra-adrenal' },
        { value: 'T3', label: 'pT3 — qualquer tamanho, invasão local, sem órgãos adjacentes' },
        { value: 'T4', label: 'pT4 — invade órgãos adjacentes (rim, diafragma, pâncreas, baço, fígado) ou grandes vasos (veia renal/cava)' },
      ],
    },
    {
      id: 'multi', label: 'Múltiplos tumores primários sincrônicos?', type: 'radio', default: 'no',
      options: [ { value: 'no', label: 'Não' }, { value: 'yes', label: 'Sim → (m)' } ],
    },
    {
      id: 'pN', label: 'Linfonodos regionais (pN)', type: 'select', default: 'none',
      options: [
        { value: 'none', label: 'Nenhum linfonodo submetido → pN não atribuído' },
        { value: 'N0',   label: 'pN0 — sem metástase em linfonodos regionais' },
        { value: 'N1',   label: 'pN1 — metástase em linfonodo(s) regional(is)' },
      ],
    },
    {
      id: 'pm', label: 'Metástase à distância (pM)', type: 'radio', default: 'na',
      hint: 'pM0 não é categoria patológica válida; só se informa pM1 quando comprovado.',
      options: [
        { value: 'na', label: 'Não aplicável' },
        { value: 'm1', label: 'pM1 (metástase à distância)' },
      ],
    },
  ],

  compute(v) {
    const warnings = [];
    const mSuffix = v.multi === 'yes' ? '(m)' : '';
    const pTtoken = `p${v.pT}${mSuffix}`;

    const Ncat = (v.pN === 'none') ? null : v.pN;
    const pNtoken = Ncat ? `p${Ncat}` : null;

    const M1 = v.pm === 'm1';
    const pMtoken = M1 ? 'pM1' : null;

    // --- Grupo prognóstico (AJCC 8ª ed.) ---
    let group = null;
    const T = v.pT;
    if (T !== 'T0') {
      const Neff = Ncat || 'N0'; // assume N0 se não avaliado
      if (v.pN === 'none' && !M1) warnings.push('Grupo calculado assumindo pN0 (linfonodos não avaliados).');
      if (M1) group = 'Estádio IV';
      else if (T === 'T3' || T === 'T4') group = 'Estádio III';
      else if (Neff === 'N1') group = 'Estádio III';
      else if (T === 'T1') group = 'Estádio I';
      else if (T === 'T2') group = 'Estádio II';
    }

    const groupToken = group ? `— ${group}` : null;
    const report = stagingLine([pTtoken, pNtoken, pMtoken, groupToken]);

    return {
      tnm: [
        { k: 'pT', v: pTtoken },
        { k: 'pN', v: pNtoken || '— (não atribuído)' },
        { k: 'pM', v: pMtoken || '—' },
      ],
      stageGroup: group,
      warnings,
      report,
    };
  },
};
