/* calc-page.js — carrega a calculadora indicada em ?id= e a monta na página */
import { getCalculator } from './registry.js';
import { mountCalculator } from './engine.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
const calc = getCalculator(id);

const titleEl = document.getElementById('calc-title');
const subEl = document.getElementById('calc-sub');
const crumbEl = document.getElementById('crumb-name');
const formRoot = document.getElementById('calc-form');
const resultRoot = document.getElementById('calc-result');

if (!calc) {
  titleEl.textContent = 'Calculadora não encontrada';
  subEl.textContent = 'O identificador informado não corresponde a nenhuma calculadora.';
  formRoot.innerHTML = '<p><a href="index.html">← Voltar à página inicial</a></p>';
  resultRoot.closest('.result-col').style.display = 'none';
} else {
  document.title = `${calc.name} — Estadiador`;
  titleEl.textContent = calc.name;
  crumbEl.textContent = calc.name;
  subEl.innerHTML = `${calc.summary || ''} <span class="chip sys">${calc.system}</span>`;
  if (calc.section) {
    const secCrumb = document.getElementById('crumb-section');
    if (secCrumb) secCrumb.textContent = calc.section;
  }
  mountCalculator(calc, formRoot, resultRoot);
}
