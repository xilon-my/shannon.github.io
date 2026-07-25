# shannon.zone

Personal website built with Vite + React. Features a terminal-inspired dark/light theme, blog with markdown posts, and a CV page.

## Stack

- **React 19** + **React Router 7**
- **Vite** for building
- **TipTap** for rich text editing (Write page)
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
