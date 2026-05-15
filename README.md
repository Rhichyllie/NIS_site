# NIS Site Institucional

[![Deploy](https://img.shields.io/badge/deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Site estático](https://img.shields.io/badge/site-estatico-42505E)](https://www.nisconsultoria.com.br)
[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Jinja2](https://img.shields.io/badge/templates-Jinja2-B41717)](https://jinja.palletsprojects.com/)

Site institucional da **NIS - Negócios, Inovações e Soluções LTDA**.

O projeto é um site estático gerado a partir de templates Jinja2 e assets locais. A versão final publicada fica em `public/`, que também é o diretório de saída usado pela Vercel.

URL institucional: [www.nisconsultoria.com.br](https://www.nisconsultoria.com.br)

## Estrutura

```text
.
|-- templates/        # Templates fonte
|-- static/           # CSS, JS, imagens, vídeos e ícones fonte
|-- public/           # Build estático gerado para deploy
|-- render_pages.py   # Gerador estático
|-- requirements.txt  # Dependências Python do build
|-- vercel.json       # Configuração de deploy Vercel
`-- README.md
```

## Páginas Ativas

- `index.html`
- `servicos.html`
- `processos.html`
- `contato.html`

O portfólio não está ativo na navegação pública.

## Requisitos

- Python 3.11 ou superior
- Dependências listadas em `requirements.txt`

## Rodar Localmente

Instale as dependências:

```bash
python -m pip install -r requirements.txt
```

Gere o build estático:

```bash
python render_pages.py
```

Sirva a pasta `public/` localmente:

```bash
cd public
python -m http.server 8000
```

Acesse:

```text
http://localhost:8000
```

## Fluxo de Edição

1. Edite templates em `templates/`.
2. Edite assets fonte em `static/`.
3. Rode `python render_pages.py`.
4. Valide o resultado em `public/`.
5. Suba para o GitHub com `public/` atualizado.

## Deploy na Vercel

Este repositório está preparado para deploy estático na Vercel.

Configuração usada:

- Build Command: `python3 render_pages.py`
- Install Command: `python3 -m pip install --quiet -r requirements.txt`
- Output Directory: `public`
- Framework Preset: `Other`

O arquivo `vercel.json` já declara esses parâmetros.

## Checklist Antes de Publicar

- Rodar `python render_pages.py`.
- Confirmar que `public/index.html`, `public/servicos.html`, `public/processos.html` e `public/contato.html` existem.
- Confirmar que `public/static/` foi atualizado.
- Testar links internos principais.
- Conferir CTAs de WhatsApp, LinkedIn e e-mail.
- Confirmar que `public/favicon.ico` existe.
- Confirmar que não há arquivos temporários no `git status`.

## Publicação no GitHub

```bash
git status
git add .
git commit -m "Prepare static site for production deploy"
git push origin main
```

Depois do push, conecte o repositório na Vercel e aponte o domínio `www.nisconsultoria.com.br` nas configurações do projeto.
