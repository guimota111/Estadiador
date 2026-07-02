/* home.js — página inicial: barra lateral de sistemas + grade de calculadoras */
import { calculators, groupBySection } from './registry.js';
import { sectionIcon } from './icons.js';

const sectionsRoot = document.getElementById('sections');
const navRoot = document.getElementById('side-nav');
const searchInput = document.getElementById('search');

const slug = s => 'sec-' + s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');

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
  let secHtml = '', navHtml = '<span class="side-label">Sistemas</span>';
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
    const id = slug(section);

    navHtml += `<a class="nav-item" href="#${id}">
      <span class="ico">${sectionIcon(section)}</span>
      <span class="txt">${section}</span>
      <span class="n">${matched.length}</span>
    </a>`;

    secHtml += `<section class="section" id="${id}">
      <div class="section-head">
        <span class="ico">${sectionIcon(section)}</span>
        <h2>${section}</h2>
        <span class="count">${matched.length}</span>
        <span class="bar"></span>
      </div>
      <div class="grid">${matched.map(cardHtml).join('')}</div>
    </section>`;
  }

  sectionsRoot.innerHTML = total
    ? secHtml
    : `<div class="empty-state">Nenhuma calculadora encontrada para “${filter}”.</div>`;
  navRoot.innerHTML = navHtml;

  setupScrollSpy();
}

/* Realça na barra lateral a seção visível. */
let observer = null;
function setupScrollSpy() {
  if (observer) observer.disconnect();
  const secs = [...document.querySelectorAll('.section[id]')];
  const navItems = new Map([...document.querySelectorAll('#side-nav .nav-item')].map(a => [a.getAttribute('href').slice(1), a]));
  observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navItems.forEach(a => a.classList.remove('active'));
        const a = navItems.get(e.target.id);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-15% 0px -70% 0px' });
  secs.forEach(s => observer.observe(s));
}

searchInput.addEventListener('input', e => render(e.target.value));
render();

document.getElementById('total-count').textContent = calculators.length;
