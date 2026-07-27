# shannon.zone

Personal website built with Vite + React. Features a terminal-inspired Catppuccin dark/light theme, an interactive live terminal, blog with markdown posts, a CV/timeline page, and a curated GitHub projects showcase.

## Pages

| Route | Page |
|---|---|
| `/` | Home — intro, contact, interactive terminal |
| `/cv` | CV — timeline, awards, skills |
| `/discover` | Discover — curated open-source projects |
| `/discover/:slug` | Project detail with full intro & GitHub link |
| `/blog` | Blog — post list with category filter |
| `/blog/:slug` | Blog post (markdown rendered) |

## Stack

- **React 19** + **React Router 7**
- **Vite** for building
- **react-markdown** for blog rendering
- **GitHub Actions** for auto-deploy to GitHub Pages

## Quick start

```bash
npm install
npm run dev      # dev server at localhost:5173
npm run build    # production build → dist/
```

## Write a blog post

Add a `.md` file to `src/posts/` with frontmatter:

```yaml
---
title: "My Post"
date: 2026-07-25
tags: [tag1, tag2]
category: project | note
---
```

Push to `main` → GitHub Action builds & deploys automatically.
