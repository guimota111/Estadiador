/* calc-page.js — carrega a calculadora de ?id= e monta a página + irmãs na barra */
import { getCalculator, calculators } from './registry.js';
import { mountCalculator } from './engine.js';
import { sectionIcon } from './icons.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
const calc = getCalculator(id);

const titleEl = document.getElementById('calc-title');
const subEl = document.getElementById('calc-sub');
const crumbName = document.getElementById('crumb-name');
const crumbSection = document.getElementById('crumb-section');
const formRoot = document.getElementById('calc-form');
const resultRoot = document.getElementById('calc-result');
const siblingsRoot = document.getElementById('side-siblings');

if (!calc) {
  titleEl.textContent = 'Calculadora não encontrada';
  subEl.textContent = 'O identificador informado não corresponde a nenhuma calculadora.';
  formRoot.innerHTML = '<div class="panel"><div class="panel-body"><p><a href="index.html">← Voltar à página inicial</a></p></div></div>';
  const col = resultRoot.closest('.result-col');
  if (col) col.style.display = 'none';
} else {
  document.title = `${calc.name} — Estadiador`;
  titleEl.textContent = calc.name;
  crumbName.textContent = calc.name;
  crumbSection.textContent = calc.section || '';
  subEl.innerHTML = `${calc.summary || ''} <span class="chip sys">${calc.system}</span>`;

  // Irmãs da mesma seção
  const siblings = calculators.filter(c => c.section === calc.section);
  siblingsRoot.innerHTML =
    `<span class="side-label">${calc.section || 'Calculadoras'}</span>` +
    siblings.map(c => `<a class="nav-item ${c.id === calc.id ? 'active' : ''}" href="calculadora.html?id=${encodeURIComponent(c.id)}">
        <span class="ico">${sectionIcon(calc.section)}</span>
        <span class="txt">${c.name}</span>
      </a>`).join('');

  mountCalculator(calc, formRoot, resultRoot);
}
