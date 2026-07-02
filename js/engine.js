/* ==========================================================================
   engine.js — motor genérico das calculadoras
   Renderiza campos, coleta valores, chama a função compute() da calculadora
   e monta o painel de resultado + texto do laudo para copiar.
   ========================================================================== */

/**
 * Contrato de uma calculadora (ver js/calculators/*.js):
 *
 *   export default {
 *     id, name, section, system, version, reference,
 *     fields: [ { id, label, type, hint?, options?, min?, max?, default?, when?(v) } ],
 *     compute(values) -> {
 *        tnm: [ {k:'pT', v:'pT3'}, ... ],   // pares mostrados nos badges
 *        stageGroup: 'Estádio IIIB' | null,
 *        report: 'texto multilinha para copiar',
 *        warnings?: ['...']
 *     }
 *   }
 */

const $ = (sel, ctx = document) => ctx.querySelector(sel);

/** Lê o valor de um campo já convertido para o tipo apropriado. */
function readField(field, root) {
  if (field.type === 'radio') {
    const checked = root.querySelector(`input[name="${field.id}"]:checked`);
    return checked ? checked.value : (field.default ?? null);
  }
  const el = root.querySelector(`[name="${field.id}"]`);
  if (!el) return field.default ?? null;
  if (field.type === 'number') {
    return el.value === '' ? null : Number(el.value);
  }
  return el.value;
}

/** Coleta todos os valores respeitando a condição `when`. */
function collectValues(calc, root) {
  const values = {};
  for (const f of calc.fields) {
    values[f.id] = readField(f, root);
  }
  return values;
}

/** HTML de um campo individual. */
function renderField(f) {
  const hint = f.hint ? `<span class="hint">${f.hint}</span>` : '';

  if (f.type === 'select') {
    const opts = f.options.map(o => {
      const val = typeof o === 'string' ? o : o.value;
      const label = typeof o === 'string' ? o : o.label;
      const sel = (f.default === val) ? ' selected' : '';
      return `<option value="${escapeAttr(val)}"${sel}>${escapeHtml(label)}</option>`;
    }).join('');
    return `<div class="field" data-field="${f.id}">
      <label for="${f.id}">${escapeHtml(f.label)}${hint}</label>
      <select id="${f.id}" name="${f.id}">${opts}</select>
    </div>`;
  }

  if (f.type === 'radio') {
    const opts = f.options.map((o, i) => {
      const val = typeof o === 'string' ? o : o.value;
      const label = typeof o === 'string' ? o : o.label;
      const checked = (f.default === val) || (f.default == null && i === 0) ? ' checked' : '';
      const cls = checked ? ' class="checked"' : '';
      return `<label${cls}><input type="radio" name="${f.id}" value="${escapeAttr(val)}"${checked}> ${escapeHtml(label)}</label>`;
    }).join('');
    return `<div class="field" data-field="${f.id}">
      <label>${escapeHtml(f.label)}${hint}</label>
      <div class="radio-group">${opts}</div>
    </div>`;
  }

  if (f.type === 'number') {
    const min = f.min != null ? ` min="${f.min}"` : '';
    const max = f.max != null ? ` max="${f.max}"` : '';
    const def = f.default != null ? ` value="${f.default}"` : '';
    return `<div class="field" data-field="${f.id}">
      <label for="${f.id}">${escapeHtml(f.label)}${hint}</label>
      <input type="number" id="${f.id}" name="${f.id}"${min}${max}${def} placeholder="—">
    </div>`;
  }

  // text
  return `<div class="field" data-field="${f.id}">
    <label for="${f.id}">${escapeHtml(f.label)}${hint}</label>
    <input type="text" id="${f.id}" name="${f.id}" value="${escapeAttr(f.default || '')}">
  </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
function escapeAttr(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

/** Mostra/oculta campos condicionais e marca radios selecionados. */
function applyConditionals(calc, root, values) {
  for (const f of calc.fields) {
    if (typeof f.when === 'function') {
      const wrap = root.querySelector(`[data-field="${f.id}"]`);
      if (wrap) wrap.classList.toggle('hidden', !f.when(values));
    }
    if (f.type === 'radio') {
      root.querySelectorAll(`input[name="${f.id}"]`).forEach(inp => {
        inp.closest('label').classList.toggle('checked', inp.checked);
      });
    }
  }
}

/** Renderiza o painel de resultado. */
function renderResult(result) {
  const badges = (result.tnm || []).map(t =>
    `<div class="badge"><div class="k">${escapeHtml(t.k)}</div><div class="v">${escapeHtml(t.v ?? '—')}</div></div>`
  ).join('');

  const group = result.stageGroup
    ? `<div class="stage-group"><span class="k">Grupo prognóstico</span><span class="v">${escapeHtml(result.stageGroup)}</span></div>`
    : '';

  const warns = (result.warnings || []).map(w =>
    `<div class="notice"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg><span>${escapeHtml(w)}</span></div>`
  ).join('');

  return { badges, group, warns };
}

/** Monta a calculadora inteira dentro do container informado. */
export function mountCalculator(calc, formRoot, resultRoot) {
  // Cabeçalho de campos
  formRoot.innerHTML = `<div class="panel"><div class="panel-body">${
    calc.fields.map(renderField).join('')
  }</div></div>`;

  function update() {
    const values = collectValues(calc, formRoot);
    applyConditionals(calc, formRoot, values);

    let result;
    try {
      result = calc.compute(values) || {};
    } catch (err) {
      result = { warnings: ['Erro ao calcular: ' + err.message], report: '' };
    }

    const { badges, group, warns } = renderResult(result);
    resultRoot.querySelector('[data-badges]').innerHTML = badges;
    const groupEl = resultRoot.querySelector('[data-group]');
    if (groupEl) groupEl.innerHTML = group;
    resultRoot.querySelector('[data-warns]').innerHTML = warns;
    resultRoot.querySelector('[data-report]').value = result.report || '';
  }

  formRoot.addEventListener('input', update);
  formRoot.addEventListener('change', update);
  update();

  // Botão copiar
  const copyBtn = resultRoot.querySelector('[data-copy]');
  const ta = resultRoot.querySelector('[data-report]');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(ta.value);
    } catch {
      ta.select(); document.execCommand('copy');
    }
    const original = copyBtn.dataset.label || copyBtn.textContent;
    copyBtn.dataset.label = original;
    copyBtn.classList.add('copied');
    copyBtn.textContent = '✓ Copiado';
    setTimeout(() => { copyBtn.classList.remove('copied'); copyBtn.textContent = original; }, 1600);
  });

  // Botão limpar
  const resetBtn = resultRoot.querySelector('[data-reset]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      calc.fields.forEach(f => {
        if (f.type === 'radio') {
          const first = formRoot.querySelector(`input[name="${f.id}"]`);
          if (first) first.checked = true;
        } else {
          const el = formRoot.querySelector(`[name="${f.id}"]`);
          if (el) el.value = (f.type === 'select') ? (f.default ?? el.options[0].value) : (f.default ?? '');
        }
      });
      update();
    });
  }
}
