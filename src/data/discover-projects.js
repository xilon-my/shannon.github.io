const projects = [
  {
    slug: 'multica',
    name: 'Multica',
    url: 'https://github.com/multica-ai/multica',
    description: 'An open-source managed agents platform. Assign issues to AI coding agents like you\'d assign to a colleague — agents autonomously write code, report blockers, and update progress.',
    note: 'The most well-designed open-source agent orchestration platform I\'ve seen. Treating agents as first-class teammates on a Kanban board is a genuinely new paradigm.',
    detail: `Multica is an open-source platform that transforms AI coding agents into real teammates. Instead of copy-pasting prompts into a terminal, you create issues on a board and assign them to agents — they autonomously write code, run tests, report blockers, and update their status in real time.

Built with a Go backend and Next.js 16 frontend, it supports multiple agent CLIs including Claude Code, Codex, CodeBuddy, and GitHub Copilot CLI — making it vendor-neutral. The core innovation is the Squads system: groups of agents and humans led by a leader agent that delegates work, enabling parallel execution at scale.

Other standout features: Autopilots for scheduled/recurring tasks (cron or webhook-triggered), a reusable Skills system where completed solutions become team assets, and a unified runtime dashboard that manages both local daemons and cloud compute. Workspaces provide full isolation between projects.

The project is Apache 2.0 licensed and has rapidly grown to 42k+ stars, driven by the realization that managing agents at scale requires more than a terminal — it needs a collaboration platform.`,
    tags: ['Go', 'AI Agents', 'DevTools'],
    stars: '42k+',
    author: 'multica-ai',
    license: 'Apache-2.0',
  },
  {
    slug: 'symphony',
    name: 'Symphony',
    url: 'https://github.com/openai/symphony',
    description: 'OpenAI\'s reference implementation for autonomous coding automation. Monitors issue trackers, spawns AI agents to implement tasks, and requires proof-of-work before merging.',
    note: 'The "harness engineering" philosophy is fascinating — design your codebase so agents can work autonomously, then let them go. A spec worth studying regardless of implementation language.',
    detail: `Symphony is OpenAI's low-key engineering preview for autonomous software development. It turns project management tasks into isolated, autonomous implementation runs: an agent picks up an issue, creates an isolated workspace, implements the change, runs CI, solicits code review, records a walkthrough video, and only then submits a PR for merging.

The reference implementation is written in Elixir, but the project is intentionally language-agnostic — the real value is the specification pattern. The README explicitly invites you to implement Symphony in any language using the provided spec.

Key design principles include: mandatory proof-of-work (CI green, review approved, complexity analysis), isolated workspaces so agent experiments never pollute the main codebase, and a WORKFLOW.md configuration file that tells agents how to behave. It currently supports Linear as the issue tracker and OpenAI Codex as the agent runtime.

At 26k+ stars, Symphony represents a bet on "harness engineering" — the idea that if you design your repo with clear conventions and guardrails, AI agents can operate far more autonomously than in an ad-hoc setup.`,
    tags: ['Elixir', 'AI Agents', 'Automation'],
    stars: '26k+',
    author: 'OpenAI',
    license: 'Apache-2.0',
  },
  {
    slug: 'okf',
    name: 'Open Knowledge Format (OKF)',
    url: 'https://github.com/GoogleCloudPlatform/knowledge-catalog',
    description: 'A vendor-neutral, open format for representing knowledge as Markdown files with YAML frontmatter. Designed to be both human-readable and AI-agent-consumable.',
    note: 'A rare example of Google publishing a genuinely open spec without tying it to their cloud. The simplicity is the point: just Markdown files in a directory, but with enough structure for agents to navigate.',
    detail: `Open Knowledge Format (OKF) is a specification for representing knowledge as self-contained bundles of Markdown files. It was originally published by Google Cloud in June 2026 as part of the knowledge-catalog repository, but the format itself is completely vendor-neutral — no Google APIs or services required.

The core idea is simple: a Knowledge Bundle is a directory of .md files, each with YAML frontmatter containing at minimum a type field. Files can link to each other via standard Markdown links, creating a graph of concepts that's navigable by both humans (in any Markdown viewer) and AI agents (programmatically). Optional fields include title, description, resource, tags, and timestamp.

What makes OKF interesting is what it doesn't do: no SDK required, no proprietary schema language, no lock-in. It composes with existing tools — Obsidian, Hugo, MkDocs, or just a text editor. The reference implementation includes a producer agent (enriches bundles from BigQuery) and a consumer visualizer (renders bundles as a force-directed graph with search and type filters).

At 7.8k+ stars, the ecosystem is growing quickly with community tools like okf-lint, okf-toolset, and agent skills that teach AI coding agents to read and write OKF. It's the closest thing to a standard format for agent-readable knowledge.`,
    tags: ['Specification', 'Knowledge', 'Markdown'],
    stars: '7.8k+',
    author: 'Google Cloud',
    license: 'Apache-2.0',
  },
]

export default projects
