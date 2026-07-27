const project = {
  slug: 'okf',
  name: 'Open Knowledge Format (OKF)',
  url: 'https://github.com/GoogleCloudPlatform/knowledge-catalog',
  description: 'A vendor-neutral, open format for representing knowledge as Markdown files with YAML frontmatter. Designed to be both human-readable and AI-agent-consumable.',
  note: 'A rare example of Google publishing a genuinely open spec without tying it to their cloud. The simplicity is the point: just Markdown files in a directory, but with enough structure for agents to navigate.',
  tags: ['Specification', 'Knowledge', 'Markdown'],
  stars: '7.8k+',
  author: 'Google Cloud',
  license: 'Apache-2.0',
  detail: `Open Knowledge Format (OKF) is a specification for representing knowledge as self-contained bundles of Markdown files. It was originally published by Google Cloud in June 2026 as part of the knowledge-catalog repository, but the format itself is completely vendor-neutral — no Google APIs or services required.

The core idea is simple: a Knowledge Bundle is a directory of .md files, each with YAML frontmatter containing at minimum a type field. Files can link to each other via standard Markdown links, creating a graph of concepts that's navigable by both humans (in any Markdown viewer) and AI agents (programmatically). Optional fields include title, description, resource, tags, and timestamp.

What makes OKF interesting is what it doesn't do: no SDK required, no proprietary schema language, no lock-in. It composes with existing tools — Obsidian, Hugo, MkDocs, or just a text editor. The reference implementation includes a producer agent (enriches bundles from BigQuery) and a consumer visualizer (renders bundles as a force-directed graph with search and type filters).

At 7.8k+ stars, the ecosystem is growing quickly with community tools like okf-lint, okf-toolset, and agent skills that teach AI coding agents to read and write OKF. It's the closest thing to a standard format for agent-readable knowledge.`,
}

export default project
