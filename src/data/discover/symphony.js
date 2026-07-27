const project = {
  slug: 'symphony',
  name: 'Symphony',
  url: 'https://github.com/openai/symphony',
  description: 'OpenAI\'s reference implementation for autonomous coding automation. Monitors issue trackers, spawns AI agents to implement tasks, and requires proof-of-work before merging.',
  note: 'The "harness engineering" philosophy is fascinating — design your codebase so agents can work autonomously, then let them go. A spec worth studying regardless of implementation language.',
  tags: ['Elixir', 'AI Agents', 'Automation'],
  stars: '26k+',
  author: 'OpenAI',
  license: 'Apache-2.0',
  detail: `Symphony is OpenAI's low-key engineering preview for autonomous software development. It turns project management tasks into isolated, autonomous implementation runs: an agent picks up an issue, creates an isolated workspace, implements the change, runs CI, solicits code review, records a walkthrough video, and only then submits a PR for merging.

The reference implementation is written in Elixir, but the project is intentionally language-agnostic — the real value is the specification pattern. The README explicitly invites you to implement Symphony in any language using the provided spec.

Key design principles include: mandatory proof-of-work (CI green, review approved, complexity analysis), isolated workspaces so agent experiments never pollute the main codebase, and a WORKFLOW.md configuration file that tells agents how to behave. It currently supports Linear as the issue tracker and OpenAI Codex as the agent runtime.

At 26k+ stars, Symphony represents a bet on "harness engineering" — the idea that if you design your repo with clear conventions and guardrails, AI agents can operate far more autonomously than in an ad-hoc setup.`,
}

export default project
