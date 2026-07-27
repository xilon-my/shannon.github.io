const project = {
  slug: 'multica',
  name: 'Multica',
  url: 'https://github.com/multica-ai/multica',
  description: 'An open-source managed agents platform. Assign issues to AI coding agents like you\'d assign to a colleague — agents autonomously write code, report blockers, and update progress.',
  tags: ['Go', 'AI Agents', 'DevTools'],
  stars: '42k+',
  author: 'multica-ai',
  detail: `Multica is an open-source platform that transforms AI coding agents into real teammates. Instead of copy-pasting prompts into a terminal, you create issues on a board and assign them to agents — they autonomously write code, run tests, report blockers, and update their status in real time.

Built with a Go backend and Next.js 16 frontend, it supports multiple agent CLIs including Claude Code, Codex, CodeBuddy, and GitHub Copilot CLI — making it vendor-neutral. The core innovation is the Squads system: groups of agents and humans led by a leader agent that delegates work, enabling parallel execution at scale.

Other standout features: Autopilots for scheduled/recurring tasks (cron or webhook-triggered), a reusable Skills system where completed solutions become team assets, and a unified runtime dashboard that manages both local daemons and cloud compute. Workspaces provide full isolation between projects.

The project is Apache 2.0 licensed and has rapidly grown to 42k+ stars, driven by the realization that managing agents at scale requires more than a terminal — it needs a collaboration platform.`,
}

export default project
