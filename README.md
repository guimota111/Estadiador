# Estadiador

Site estático com **calculadoras de estadiamento tumoral** (TNM / AJCC 8ª edição, baseadas nos protocolos da CAP), hospedado no GitHub Pages.

O usuário abre a calculadora do caso, informa os parâmetros e recebe o **texto do estadiamento pronto para copiar** no laudo.

## Como funciona

- **Sem build.** HTML + CSS + JavaScript (ES modules). Basta servir os arquivos.
- **Orientado a dados.** Cada tumor é um módulo em `js/calculators/` que descreve os campos e as regras de estadiamento. O motor (`js/engine.js`) renderiza o formulário, calcula e monta o laudo.

## Estrutura

```
index.html            Página inicial — seções + busca
calculadora.html      Página genérica de uma calculadora (?id=...)
css/style.css         Estilos
js/
  registry.js         Lista central das calculadoras
  engine.js           Motor genérico (renderiza + calcula + copia)
  home.js             Lógica da página inicial
  calc-page.js        Carrega a calculadora por ?id=
  calculators/
    colorectal.js     Carcinoma colorretal (AJCC 8ª ed.)
    gastric.js        Carcinoma gástrico (AJCC 8ª ed.)
```

## Adicionar uma calculadora nova

1. Crie `js/calculators/<nome>.js` seguindo o contrato documentado no topo de `engine.js`.
2. Importe e registre em `js/registry.js`.
3. Pronto — aparece automaticamente na seção correspondente.

## Publicar no GitHub Pages

Em **Settings → Pages**, defina a origem como a branch desejada (raiz `/`).
O arquivo `.nojekyll` garante que o Jekyll não interfira nos ES modules.

## Aviso

Ferramenta de **apoio ao patologista**. O estadiamento final e a conferência do
laudo são sempre responsabilidade do profissional. Confira o conteúdo com a
versão vigente dos protocolos CAP / AJCC.
