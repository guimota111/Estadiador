/* home.js — monta a página inicial (seções + busca) */
import { calculators, groupBySection } from './registry.js';

const grid = document.getElementById('sections');
const searchInput = document.getElementById('search');

function cardHtml(c) {
  return `<a class="card" href="calculadora.html?id=${encodeURIComponent(c.id)}">
    <h3>${c.name}</h3>
    <p>${c.summary || ''}</p>
    <div class="meta">
      <span class="chip sys">${c.system}</span>
      ${c.version ? `<span class="chip">${c.version}</span>` : ''}
    </div>
  </a>`;
}

function render(filter = '') {
  const q = filter.trim().toLowerCase();
  const groups = groupBySection();
  let html = '';
  let total = 0;

  for (const [section, items] of groups) {
    const matched = items.filter(c =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      section.toLowerCase().includes(q) ||
      (c.summary || '').toLowerCase().includes(q)
    );
    if (!matched.length) continue;
    total += matched.length;
    html += `<section class="section">
      <div class="section-head">
        <h2>${section}</h2>
        <span class="count">${matched.length}</span>
        <span class="bar"></span>
      </div>
      <div class="grid">${matched.map(cardHtml).join('')}</div>
    </section>`;
  }

  grid.innerHTML = total
    ? html
    : `<div class="empty-state">Nenhuma calculadora encontrada para “${filter}”.</div>`;
}

searchInput.addEventListener('input', e => render(e.target.value));
render();

document.getElementById('total-count').textContent = calculators.length;
