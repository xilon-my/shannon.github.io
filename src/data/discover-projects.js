const projects = [
  {
    slug: 'llama-cpp',
    name: 'llama.cpp',
    url: 'https://github.com/ggml-org/llama.cpp',
    description: 'Inference of LLaMA family LLMs in pure C/C++. Minimal dependencies, runs on CPU, GPU, or hybrid — made local LLMs accessible to everyone.',
    note: 'The project that democratized local LLMs. Brilliant engineering — SIMD optimizations, GGUF format, quantisation techniques all in one portable codebase.',
    detail: `llama.cpp is a C/C++ inference engine for LLaMA-family large language models, originally created by Georgi Gerganov. It strips away the Python dependency stack (PyTorch, transformers, etc.) and runs models directly — on CPU, GPU, or a mix of both.

What makes it remarkable is the breadth of optimisation work packed into a single codebase: 4-bit and 8-bit quantisation via GGUF format, SIMD acceleration for x86 and ARM, CUDA/Metal/Vulkan backends, and even Apple Neural Engine support. The GGUF format has become the de facto standard for distributing local LLM weights.

Beyond inference, the project spawned a whole ecosystem: llama-server (HTTP API with continuous batching), embedding endpoints, vision model support (LLaVA), and grammars for constrained output. It's the engine behind most local-first LLM tools today.`,
    tags: ['C/C++', 'LLM', 'ML'],
    stars: '70k+',
    author: 'Georgi Gerganov',
    license: 'MIT',
  },
  {
    slug: 'n8n',
    name: 'n8n',
    url: 'https://github.com/n8n-io/n8n',
    description: 'Fair-code workflow automation platform with 400+ integrations. Connect APIs, databases, LLMs, and services with a visual editor or code nodes.',
    note: 'Technical automation done right — fair-code license, local-first, and the AI agent nodes make it a perfect self-hosted alternative to Zapier.',
    detail: `n8n is a workflow automation platform that lets you connect any service with a visual drag-and-drop editor, then run it on your own infrastructure. It supports 400+ integrations including HTTP requests, databases, email, cloud services, and AI models.

The standout feature is the approach to data transformation: between every node you can write JavaScript or Python code to transform data, making it far more flexible than traditional no-code tools. The AI agent nodes (integration with LangChain, OpenAI, local LLMs) turn it into a powerful agent orchestration platform.

It's fair-code licensed — free to self-host and modify, with paid cloud and enterprise features. The community edition runs in a single Docker container and handles production workloads.`,
    tags: ['TypeScript', 'Automation', 'Self-hosted'],
    stars: '55k+',
    author: 'n8n-io',
    license: 'Sustainable Use License',
  },
  {
    slug: 'zellij',
    name: 'zellij',
    url: 'https://github.com/zellij-org/zellij',
    description: 'A terminal workspace with a built-in multiplexer, layout system, and plugin system. Think tmux reimagined for the modern terminal.',
    note: 'Finally a tmux alternative that feels intentional. The floating panes, layout strider, and WASM plugin system show what thoughtful terminal UX can be.',
    detail: `Zellij is a terminal multiplexer and workspace written in Rust. It reimagines the tmux/screen concept with a focus on discoverability and modern UX — you can see all keybindings with Ctrl+T, use floating panes that overlap instead of strictly splitting, and define layouts declaratively in YAML.

The plugin system is the most innovative part: plugins run as WebAssembly modules inside the terminal, so you can write a status bar, file browser, or custom UI element in any language that compiles to WASM. The layout strider lets you navigate panes by moving in a direction (like vim splits) without remembering complex key chords.

It's designed for teams too — there's a session management system and the ability to share terminal sessions with read-only views.`,
    tags: ['Rust', 'Terminal', 'CLI'],
    stars: '22k+',
    author: 'Zellij Organization',
    license: 'MIT',
  },
  {
    slug: 'uv',
    name: 'uv',
    url: 'https://github.com/astral-sh/uv',
    description: 'An extremely fast Python package and project manager, written in Rust. Drops in to replace pip, pip-tools, and virtualenv.',
    note: 'Speed is its headline feature, but the lockfile format and project management DX are what make it stick. pip never saw it coming.',
    detail: `uv by Astral (the Ruff team) is a Python package and project manager built in Rust. It's designed as a drop-in replacement for pip, pip-tools, pip-compile, and virtualenv — but 10-100x faster.

Key features include: a universal lockfile format (works across platforms and Python versions), dependency resolution that's both fast and correct, a built-in Python version manager (uv python install), virtual environment management, and workspace support for monorepos.

The project management mode (uv init, uv add, uv run, uv build) replaces Poetry and PDM for many users, while the pip-compatible interface means existing workflows (requirements.txt, setup.py) keep working. The compatibility layer is so good that you can alias pip='uv pip' without noticing the difference.`,
    tags: ['Rust', 'Python', 'CLI'],
    stars: '45k+',
    author: 'Astral',
    license: 'Apache-2.0',
  },
  {
    slug: 'lazygit',
    name: 'lazygit',
    url: 'https://github.com/jesseduffield/lazygit',
    description: 'A simple terminal UI for git commands, with a side-by-side diff panel, interactive rebase, and stash management — all keyboard-driven.',
    note: 'The one tool that changed my git workflow permanently. Even for power users, the staging and rebase UI surfaces operations you knew existed but never used.',
    detail: `lazygit is a terminal UI for git written in Go, created by Jesse Duffield. It wraps git commands in an intuitive TUI with panels for branches, commits, files, and the stash — all browsable with arrow keys and vim-style bindings.

The interactive rebase panel is the killer feature: you can reword, reorder, squash, and drop commits with a few keystrokes instead of editing a rebase todo file. The staging interface lets you stage individual hunks or lines side-by-side with the diff. Custom commands let you define your own git workflows and bind them to keys.

Despite the "lazy" name, it's designed for power users — every panel has a filter/search mode, custom keybindings, and the ability to run arbitrary git commands. It's one of those tools that makes you wonder why the official git CLI doesn't have this built in.`,
    tags: ['Go', 'Terminal', 'Git'],
    stars: '55k+',
    author: 'Jesse Duffield',
    license: 'MIT',
  },
  {
    slug: 'httpie',
    name: 'HTTPie',
    url: 'https://github.com/httpie/cli',
    description: 'A user-friendly HTTP client for the terminal. JSON-native output with syntax highlighting, intuitive args, and persistent sessions.',
    note: 'curl is fine, but HTTPie is designed — the `:`, `==`, `=@` argument syntax and colorised JSON output make API debugging almost enjoyable.',
    detail: `HTTPie (pronounced "aitch-tee-tee-pie") is a command-line HTTP client that makes API calls human-friendly. Unlike curl's extensive flag set, HTTPie uses an intuitive argument syntax: positional arguments for the URL, headers are written as Name:Value, query parameters as name==value, and form data as name=value.

The output is what really sets it apart: JSON responses are syntax-highlighted and formatted by default, headers are colour-coded by type (request vs response), and the body is separated clearly with a colourised divider. Sessions persist cookies and auth across requests, making it great for exploring authenticated APIs without repeating credentials.

It also supports file uploads with progress bars, whole-body JSON editing, and HTTPS with automatic certificate verification. For anyone who tests APIs regularly, HTTPie is a genuine productivity improvement over raw curl.`,
    tags: ['Python', 'CLI', 'HTTP'],
    stars: '35k+',
    author: 'Jakub Roztocil',
    license: 'BSD-3-Clause',
  },
  {
    slug: 'bat',
    name: 'bat',
    url: 'https://github.com/sharkdp/bat',
    description: 'A cat(1) clone with syntax highlighting, git integration, and automatic paging. Supports 200+ languages out of the box.',
    note: 'One of those "how did I live without this" tools. Git change markers in the gutter and automatic --theme matching make it indispensable.',
    detail: `bat is a modern replacement for the cat command, written in Rust by David Peter (sharkdp). It adds syntax highlighting for 200+ languages, git modification markers in the gutter, automatic paging for long files, and line numbers.

The smart defaults are what make it great: bat automatically detects the file type and applies the right syntax highlighting, shows non-printable characters as visual glyphs, and pipes to a pager only when the output is longer than the terminal height. The --theme flag matches your terminal's colour scheme automatically.

It integrates with various tools as a pager (e.g., git diff uses bat for syntax-highlighted diffs), supports custom themes and syntaxes, and comes with a man-page reader mode. Setting alias cat=bat is one of the first things I do on a new machine.`,
    tags: ['Rust', 'CLI', 'Terminal'],
    stars: '50k+',
    author: 'David Peter',
    license: 'MIT',
  },
  {
    slug: 'vite',
    name: 'Vite',
    url: 'https://github.com/vitejs/vite',
    description: 'A build tool that leverages native ESM and esbuild for near-instant dev server startup and HMR. The modern frontend foundation.',
    note: 'This site is built with Vite. The instant HMR on save is the kind of developer experience that raises the baseline expectation for all tools.',
    detail: `Vite (French for "quick", pronounced /vit/) is a build tool created by Evan You (creator of Vue.js) that leverages native ES modules in the browser for a dev server that starts instantly, regardless of project size.

The architecture is what sets it apart: in development, Vite serves files as native ES modules — the browser does the importing, so there's no bundling step. esbuild handles pre-bundling of dependencies once, and the result is cached. Hot Module Replacement (HMR) is done over WebSocket, and the updates are instant because only the changed module needs to be invalidated.

For production builds, Vite uses Rollup under the hood, with pre-configured optimisations for code splitting, CSS handling, and asset management. The plugin API is Rollup-compatible, so any Rollup plugin works in Vite. It ships with built-in support for TypeScript, JSX, CSS pre-processors, and Web Workers — zero configuration needed.`,
    tags: ['TypeScript', 'Build Tool', 'Frontend'],
    stars: '70k+',
    author: 'Evan You / Vite Team',
    license: 'MIT',
  },
]

export default projects
