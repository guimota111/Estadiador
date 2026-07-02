/* ==========================================================================
   Carcinoma Colorretal — AJCC 8ª edição
   Base: CAP Protocol – Colon and Rectum (Resection).
   ⚠️ Conteúdo para conferência pelo patologista responsável.
   ========================================================================== */

export default {
  id: 'colorectal',
  name: 'Carcinoma Colorretal',
  section: 'Trato Gastrointestinal',
  system: 'AJCC 8ª ed.',
  version: 'CAP — Colon & Rectum (Resection)',
  reference: 'AJCC Cancer Staging Manual, 8th ed.',
  summary: 'Estadiamento pTNM de adenocarcinoma de cólon e reto em espécime de ressecção.',

  fields: [
    {
      id: 'pT', label: 'Categoria pT — Tumor primário', type: 'select',
      default: 'T3',
      options: [
        { value: 'Tis', label: 'pTis — carcinoma in situ / intramucoso (lâmina própria ou muscular da mucosa)' },
        { value: 'T1',  label: 'pT1 — invade a submucosa' },
        { value: 'T2',  label: 'pT2 — invade a muscular própria' },
        { value: 'T3',  label: 'pT3 — atravessa a muscular própria até tecidos pericolorretais' },
        { value: 'T4a', label: 'pT4a — penetra a superfície do peritônio visceral' },
        { value: 'T4b', label: 'pT4b — invade/adere a órgãos ou estruturas adjacentes' },
      ],
    },
    {
      id: 'nExamined', label: 'Linfonodos regionais examinados', type: 'number',
      min: 0, hint: 'Total de linfonodos identificados no espécime.',
    },
    {
      id: 'nPositive', label: 'Linfonodos regionais positivos', type: 'number',
      min: 0, hint: 'Nº de linfonodos com metástase.',
    },
    {
      id: 'deposits', label: 'Depósitos tumorais (satélites) presentes?', type: 'radio',
      default: 'no',
      hint: 'Focos no tecido pericolorretal sem linfonodo residual identificável.',
      options: [ { value: 'no', label: 'Não' }, { value: 'yes', label: 'Sim' } ],
    },
    {
      id: 'M', label: 'Categoria M — Metástase à distância', type: 'select',
      default: 'M0',
      options: [
        { value: 'M0',  label: 'M0 — sem metástase à distância' },
        { value: 'M1a', label: 'M1a — metástase em 1 órgão/sítio (sem peritônio)' },
        { value: 'M1b', label: 'M1b — metástase em ≥2 órgãos/sítios (sem peritônio)' },
        { value: 'M1c', label: 'M1c — metástase peritoneal (± outros sítios)' },
      ],
    },
  ],

  compute(v) {
    const warnings = [];

    // --- Categoria N a partir das contagens ---
    const pos = v.nPositive;
    const exam = v.nExamined;
    let N = null, nDesc = '';

    if (pos == null) {
      N = null; nDesc = 'não avaliável';
    } else if (pos === 0) {
      if (v.deposits === 'yes') { N = 'N1c'; nDesc = 'depósito(s) tumoral(is), sem linfonodo positivo'; }
      else { N = 'N0'; nDesc = 'sem metástase em linfonodos regionais'; }
    } else if (pos === 1) { N = 'N1a'; nDesc = '1 linfonodo positivo'; }
    else if (pos <= 3)    { N = 'N1b'; nDesc = `${pos} linfonodos positivos`; }
    else if (pos <= 6)    { N = 'N2a'; nDesc = `${pos} linfonodos positivos`; }
    else                  { N = 'N2b'; nDesc = `${pos} linfonodos positivos`; }

    if (exam != null && pos != null && pos > exam) {
      warnings.push('Nº de linfonodos positivos maior que o total examinado — verifique as contagens.');
    }
    if (exam != null && exam > 0 && exam < 12 && v.pT !== 'Tis') {
      warnings.push('Menos de 12 linfonodos examinados — recomenda-se documentar (adequação da amostragem).');
    }

    const T = v.pT;
    const M = v.M;

    // --- Grupo prognóstico (AJCC 8ª ed.) ---
    const group = stageGroup(T, N, M);

    // --- Texto do laudo ---
    const line = (k, val) => `${k}: ${val}`;
    const nText = N ? `p${N} — ${nDesc}` : 'pN não avaliável';
    const examText = (exam != null || pos != null)
      ? `(${pos ?? '?'}/${exam ?? '?'} linfonodos)` : '';

    const report =
`ESTADIAMENTO PATOLÓGICO — Carcinoma colorretal (AJCC 8ª edição)
${line('Tumor primário (pT)', 'p' + T)}
${line('Linfonodos regionais (pN)', `${nText} ${examText}`.trim())}
${line('Metástase à distância (pM)', M === 'M0' ? 'pM0 (sem metástase à distância)' : 'p' + M)}
${line('Grupo prognóstico', group || '— (combinação não classificável)')}

Estadiamento: p${T} ${N ? 'p' + N : 'pNx'} ${M === 'M0' ? '' : 'p' + M}`.trim();

    return {
      tnm: [
        { k: 'pT', v: 'p' + T },
        { k: 'pN', v: N ? 'p' + N : '—' },
        { k: 'pM', v: M === 'M0' ? 'pM0' : 'p' + M },
      ],
      stageGroup: group,
      warnings,
      report,
    };
  },
};

/* --- Tabela de grupos prognósticos AJCC 8ª ed. (cólon e reto) --- */
function stageGroup(T, N, M) {
  if (!N) return null;

  // Doença metastática domina o grupo
  if (M === 'M1a') return 'Estádio IVA';
  if (M === 'M1b') return 'Estádio IVB';
  if (M === 'M1c') return 'Estádio IVC';

  // M0
  if (T === 'Tis' && N === 'N0') return 'Estádio 0';

  const isN1 = ['N1a', 'N1b', 'N1c'].includes(N);
  const isN2a = N === 'N2a';
  const isN2b = N === 'N2b';

  if (N === 'N0') {
    if (T === 'T1' || T === 'T2') return 'Estádio I';
    if (T === 'T3') return 'Estádio IIA';
    if (T === 'T4a') return 'Estádio IIB';
    if (T === 'T4b') return 'Estádio IIC';
  }

  if (isN1) {
    if (T === 'T1' || T === 'T2') return 'Estádio IIIA';
    if (T === 'T3' || T === 'T4a') return 'Estádio IIIB';
    if (T === 'T4b') return 'Estádio IIIC';
  }

  if (isN2a) {
    if (T === 'T1') return 'Estádio IIIA';
    if (T === 'T2' || T === 'T3') return 'Estádio IIIB';
    if (T === 'T4a') return 'Estádio IIIC';
    if (T === 'T4b') return 'Estádio IIIC';
  }

  if (isN2b) {
    if (T === 'T1' || T === 'T2') return 'Estádio IIIB';
    if (T === 'T3' || T === 'T4a' || T === 'T4b') return 'Estádio IIIC';
  }

  return null;
}
