# Marcelo Sckio — Site institucional

Site institucional (one-page) para **Marcelo Sckio**, consultor em processos produtivos e
eficiência operacional, com foco em médias e grandes indústrias de Campinas e região.

Posicionamento central: **encontrar o lucro que a indústria está perdendo dentro da própria operação.**

- HTML + CSS + JS puro, sem build, sem dependências e sem framework.
- **Mobile first**: o layout é projetado para o celular e expandido em 760px / 1024px.
- Publicação: basta servir a pasta como site estático (Vercel, Netlify, S3, Apache, Nginx...).

```
marcelo-sckio/
├── index.html
├── robots.txt · sitemap.xml · site.webmanifest
└── assets/
    ├── css/styles.css
    ├── js/main.js
    ├── fonts/            Archivo + Inter (subsets latin/latin-ext, self-hosted)
    └── img/              retratos, ícones e imagem de compartilhamento (OG)
```

## Estrutura da página

Hero · O problema (6 cards) · Quebra de impacto · Metodologia (01–06) · Autoridade ·
Calculadora do custo invisível · Para quem é · Campinas e região (SEO) · Formulário ·
Agendar uma visita · Rodapé · WhatsApp flutuante.

## Decisões que valem revisão

### 1. Domínio (placeholder)
`https://www.marcelosckio.com.br/` é usado em `canonical`, Open Graph, JSON-LD,
`robots.txt` e `sitemap.xml`. **Troque pelo domínio real antes de publicar**
(uma busca e substituição resolve).

### 2. Formulário
Não há backend. Ao enviar, os campos são montados em uma mensagem e o visitante é
direcionado ao WhatsApp de Marcelo (`+55 19 98836-4023`) — o lead chega mesmo sem servidor.
Se no futuro houver CRM/e-mail, basta substituir o bloco `#leadForm` em `assets/js/main.js`
por um `fetch()` para o endpoint desejado.

Campos obrigatórios: nome, empresa e WhatsApp.

### 3. Calculadora
Simulação ilustrativa, exibida como tal no próprio bloco:

```
perdas anuais        = custo operacional mensal × % de perdas × 12
ganho anual          = perdas anuais × % de redução
impacto no faturamento = ganho anual ÷ (faturamento mensal × 12)
```

Nenhum número de resultado de cliente foi inventado. A única afirmação de resultado é a
fornecida no briefing ("dezenas de milhões de reais"), sem percentuais ou cases.

### 4. Fotografia industrial
O retrato de Marcelo é a foto real enviada (recortada do fundo, sem qualquer alteração de rosto).

As imagens de contexto industrial são **fotos reais do Pexels** (licença livre, inclusive
comercial, sem atribuição obrigatória), carregadas pelo CDN com `srcset`, `loading="lazy"` e
tratamento gráfico (dessaturação + máscara grafite) para manter a unidade visual.
O ambiente de desenvolvimento não tinha acesso de rede ao Pexels, então **as imagens não
puderam ser conferidas visualmente** — vale abrir os links abaixo e trocar o que não estiver
à altura (o ideal, quando possível, é usar fotos reais de indústrias atendidas):

| Seção | Foto | Link |
|---|---|---|
| Impacto | Factory Production Line | https://www.pexels.com/photo/factory-production-line-13974251/ |
| Metodologia | Engineer in Industrial Factory Using Tablet | https://www.pexels.com/photo/engineer-in-industrial-factory-using-tablet-32845694/ |
| Para quem é | Modern Warehouse Operations with Employees and Forklift | https://www.pexels.com/photo/modern-warehouse-operations-with-employees-and-forklift-30824313/ |
| Campinas e região | Industrial Robot Arm in a Manufacturing Facility | https://www.pexels.com/photo/industrial-robot-arm-in-a-manufacturing-facility-34207359/ |
| Agendar visita | Woman Working in a Factory | https://www.pexels.com/photo/woman-working-in-a-factory-23232403/ |

Se alguma imagem externa falhar, o bloco cai para um fundo gráfico sóbrio (classe `is-broken`) —
nunca aparece ícone de imagem quebrada.

## Performance

- Fontes self-hosted (woff2 variável, subset latin) com `preload` e `font-display:swap`.
- Retrato do hero em WebP, três larguras (400/560/788) + `preload` com `imagesrcset`.
- Imagens externas com `srcset` por viewport, `loading="lazy"` e `decoding="async"`.
- CSS ~30 KB e JS ~8 KB, sem dependências; `width`/`height` em todas as imagens (evita CLS).

## Acessibilidade

Contraste AA nos textos, alvos de toque ≥ 44px, inputs com 16px+ (sem zoom no iOS),
labels reais em todos os campos, foco visível, `skip link`, menu com `aria-expanded`,
resultado da calculadora em `aria-live` e suporte a `prefers-reduced-motion`.

## Desenvolvimento

```bash
cd marcelo-sckio
python3 -m http.server 8099
# http://localhost:8099
```

## Ajustes rápidos

| O quê | Onde |
|---|---|
| WhatsApp | `WHATSAPP` em `assets/js/main.js` + links `wa.me` no `index.html` |
| Cor institucional | `--accent` em `assets/css/styles.css` |
| Tipografia | `--font-display` / `--font-body` |
| Cidades da região | lista `.regiao__tags` no `index.html` |
