/* ==========================================================================
   Carcinoma do Endométrio — AJCC 8ª edição + FIGO 2009
   Base: CAP — Endometrium (v5.1.0.0).
   A FIGO 2009 (anatômica) é derivada dos mesmos parâmetros do TNM.
   (A FIGO 2023 — molecular — não está incluída nesta versão.)
   ⚠️ Conteúdo para conferência pelo patologista responsável.
   ========================================================================== */

import { stagingLine } from './_shared.js';

const PN_OPTIONS = [
  { value: 'none',    label: 'Nenhum linfonodo submetido → pN não atribuído' },
  { value: 'N0',      label: 'pN0 — sem metástase regional' },
  { value: 'N0(i+)',  label: 'pN0(i+) — células tumorais isoladas (≤0,2 mm)' },
  { value: 'N1mi',    label: 'pN1mi — pélvicos, 0,2–2 mm' },
  { value: 'N1a',     label: 'pN1a — pélvicos, >2 mm' },
  { value: 'N1',      label: 'pN1 — pélvicos (subcategoria indeterminada)' },
  { value: 'N2mi',    label: 'pN2mi — para-aórticos, 0,2–2 mm (± pélvicos)' },
  { value: 'N2a',     label: 'pN2a — para-aórticos, >2 mm (± pélvicos)' },
  { value: 'N2',      label: 'pN2 — para-aórticos (subcategoria indeterminada)' },
];

export default {
  id: 'uterus-endometrium',
  name: 'Endométrio — Carcinoma',
  section: 'Trato Ginecológico',
  system: 'AJCC 8ª ed. + FIGO',
  version: 'CAP — Endometrium v5.1',
  reference: 'AJCC 8th ed. + FIGO 2009 / CAP Uterus 5.1.0.0',
  summary: 'Estadiamento do carcinoma do endométrio: pTNM (AJCC 8ª ed.) e estádio FIGO 2009.',

  fields: [
    {
      id: 'pT', label: 'Categoria pT — Tumor primário', type: 'select', default: 'T1a',
      options: [
        { value: 'T0',  label: 'pT0 — sem evidência de tumor primário' },
        { value: 'T1a', label: 'pT1a — limitado ao endométrio ou invade <½ do miométrio' },
        { value: 'T1b', label: 'pT1b — invade ≥½ do miométrio' },
        { value: 'T1',  label: 'pT1 — confinado ao corpo uterino (subcategoria indeterminada)' },
        { value: 'T2',  label: 'pT2 — invade o estroma cervical, sem ultrapassar o útero' },
        { value: 'T3a', label: 'pT3a — serosa e/ou anexos' },
        { value: 'T3b', label: 'pT3b — envolvimento vaginal e/ou parametrial' },
        { value: 'T3',  label: 'pT3 — serosa/anexos/vagina/parametrio (subcategoria indeterminada)' },
        { value: 'T4',  label: 'pT4 — invade a mucosa da bexiga e/ou do intestino' },
      ],
    },
    {
      id: 'multi', label: 'Múltiplos tumores primários sincrônicos?', type: 'radio', default: 'no',
      options: [ { value: 'no', label: 'Não' }, { value: 'yes', label: 'Sim → (m)' } ],
    },
    {
      id: 'pN', label: 'Linfonodos regionais (pN)', type: 'select', default: 'none',
      hint: 'A distinção pélvicos (N1) × para-aórticos (N2) define a FIGO IIIC1/IIIC2.',
      options: PN_OPTIONS,
    },
    {
      id: 'nSuffix', label: 'Sufixo de pN', type: 'select', default: '',
      when: v => v.pN !== 'none',
      options: [
        { value: '',     label: 'Nenhum' },
        { value: '(sn)', label: '(sn) — linfonodo sentinela' },
        { value: '(f)',  label: '(f) — PAAF / core' },
      ],
    },
    {
      id: 'pm', label: 'Metástase à distância (pM)', type: 'radio', default: 'na',
      hint: 'Omento/peritônio abdominal e linfonodos inguinais = pM1 (FIGO IVB).',
      options: [
        { value: 'na', label: 'Não aplicável' },
        { value: 'm1', label: 'pM1 (metástase à distância)' },
      ],
    },
  ],

  compute(v) {
    const warnings = [];
    const T = v.pT;
    const mSuffix = v.multi === 'yes' ? '(m)' : '';
    const pTtoken = `p${T}${mSuffix}`;

    const Ncat = (v.pN === 'none') ? null : v.pN;
    const nSuf = (v.pN !== 'none') ? (v.nSuffix || '') : '';
    const pNtoken = Ncat ? `p${Ncat}${nSuf}` : null;

    const M1 = v.pm === 'm1';
    const pMtoken = M1 ? 'pM1' : null;

    // --- FIGO 2009 (derivada do TNM anatômico) ---
    const isPelvic = ['N1mi', 'N1a', 'N1'].includes(Ncat);
    const isPara   = ['N2mi', 'N2a', 'N2'].includes(Ncat);
    let figo = null;
    if (T !== 'T0') {
      if (v.pN === 'none' && !M1) warnings.push('FIGO calculada assumindo linfonodos negativos (nenhum avaliado).');
      if (M1) figo = 'IVB';
      else if (T === 'T4') figo = 'IVA';
      else if (isPara) figo = 'IIIC2';
      else if (isPelvic) figo = 'IIIC1';
      else if (T === 'T3b') figo = 'IIIB';
      else if (T === 'T3a') figo = 'IIIA';
      else if (T === 'T3') figo = 'III';
      else if (T === 'T2') figo = 'II';
      else if (T === 'T1b') figo = 'IB';
      else if (T === 'T1a') figo = 'IA';
      else if (T === 'T1') figo = 'I';
    }

    const ajcc = [pTtoken, pNtoken, pMtoken].filter(Boolean).join(' ');
    const report = figo
      ? `Estadiamento patológico (AJCC 8ªed.): ${ajcc}. FIGO 2009: ${figo}.`
      : `Estadiamento patológico (AJCC 8ªed.): ${ajcc}.`;

    return {
      tnm: [
        { k: 'pT', v: pTtoken },
        { k: 'pN', v: pNtoken || '—' },
        { k: 'pM', v: pMtoken || '—' },
        { k: 'FIGO', v: figo || '—' },
      ],
      stageGroup: null,
      warnings,
      report,
    };
  },
};
