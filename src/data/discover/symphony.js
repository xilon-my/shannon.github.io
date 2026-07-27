const project = {
  slug: 'symphony',
  name: 'Symphony',
  url: 'https://github.com/openai/symphony',
  description: 'OpenAI 的自主编码自动化参考实现。监控 Linear 面板，自动派发 AI 代理实现任务，要求提供工作量证明后才能合入代码。',
  tags: ['Elixir', 'AI Agents', 'Automation'],
  stars: '26k+',
  author: 'OpenAI',
  images: [],
  detail:
`Agent 写代码已经不算新鲜了，但每次都要人盯着、手动给 prompt、手动提 PR，本质上还是把 Agent 当高级补全在用。

Symphony 想解决的问题就是这个——它不做代码补全，它做的是**无人值守的编码调度**。你只管往 Linear 里扔 Issue，Symphony 会自动 Claim、分配 Workspace、启动 Agent、等 Agent 写完代码跑完测试、最后提交 PR。整个过程不需要人盯着 Codex 的会话窗口。

## 参考实现为什么用 Elixir

官方参考实现选择了 **Elixir**（跑在 Erlang/BEAM 虚拟机上）。Elixir 的杀手锏是 Actor 模型和超轻量进程——每个进程几微秒的创建开销、独立内存、靠消息通信不共享状态。这对于 Symphony 这种需要同时管理多个 Agent 会话、每个会话有独立状态和生命周期的场景来说非常自然。

一个 Agent 就是一个进程，Issue 的状态流转就是进程间的消息传递，出问题了进程崩了不影响其他 Agent。如果用 Python/Node 做同样的事情，得自己搓事件循环和状态机。

不过 SPEC.md 是语言无关的，README 也说了"让你喜欢的 coding agent 按规范用任何语言实现"，所以你不必学 Elixir 也能理解 Symphony。

## 怎么工作的

一个 Issue 的生命周期大概是这样：

\`\`\`
Todo ──▶ In Progress ──▶ Human Review ──▶ Merging ──▶ Done
                  │                            │
                  └── Rework ◀──────────────────┘
\`\`\`

Symphony 每 5 秒轮询一次 Linear，发现 Todo 状态的 Issue 就 Claim 过来，然后：

1. 创建一个隔离的 Workspace 目录
2. git clone 目标仓库进去
3. 启动 Codex 的 app-server 模式
4. 把 WORKFLOW.md 里的 prompt 注入给 Codex
5. Codex 自主完成：分析 → 编码 → 测试 → commit → push → PR
6. Symphony 检测到完成后清理 Workspace

每个步骤都有对应的状态管理——Agent 卡住了就重试（指数退避），重试超上限就升级成 Human Review，Issue 被移到 Cancelled 就停掉对应的 Agent。

## 仓库里有什么

\`\`\`
symphony/
├── SPEC.md                 # 语言无关的规范（81KB，真正的核心）
├── elixir/                 # Elixir/BEAM 参考实现
│   ├── WORKFLOW.md         # 驱动 Agent 行为的 prompt 模板
│   ├── lib/symphony_elixir/
│   │   ├── orchestrator.ex     # 轮询调度 + 状态管理
│   │   ├── workspace.ex        # Workspace 生命周期
│   │   ├── agent_runner.ex     # 管理 Codex 子进程
│   │   ├── workflow.ex         # 解析 WORKFLOW.md
│   │   ├── tracker.ex          # Linear 适配层
│   │   ├── prompt_builder.ex   # 把 Issue + 模板拼成 prompt
│   │   ├── status_dashboard.ex # Phoenix LiveView 仪表盘
│   │   ├── cli.ex              # 命令行入口
│   │   └── ...
│   ├── config/             # 运行时配置
│   ├── test/               # 测试
│   └── mix.exs
├── docs/                   # 文档
└── .github/                # CI + 演示视频封面
\`\`\`

### SPEC.md 里到底写了什么

81KB 的规范文件，分了 8 章，每章都讲一个子系统：

1. **Problem Statement** — 为什么需要 Symphony，解决哪四个运维问题
2. **Goals and Non-Goals** — 明确做什么和不做什么
3. **System Overview** — 8 大组件（Workflow Loader、Orchestrator、Workspace Manager、Agent Runner……）和 6 层抽象
4. **Core Domain Model** — Issue、Workflow Definition、Workspace、Run Attempt、Retry Entry 等实体的完整定义
5. **Workflow Specification** — WORKFLOW.md 的文件格式、YAML schema、prompt 模板契约、验证规则（最长的章节）
6. **Configuration Specification** — 配置解析管线、动态重载、调度前校验
7. **Dispatch & Retry** — 派发策略、并发控制、指数退避、死信处理
8. **Observability** — 结构化日志、状态面板、指标暴露

Elixir 实现只是这套规范的一种具体化，顺着 SPEC.md 用任何语言都能重写。

## WORKFLOW.md：Agent 的行为契约

这是 Symphony 里最巧妙的设计。Agent 的行为规范不硬编码在代码里，而是作为一个 **WORKFLOW.md** 放在仓库根目录，跟着版本走。

文件分两部分：

**YAML frontmatter** 定义调度参数：

\`\`\`yaml
tracker:
  kind: linear
  project_slug: "my-project"
  active_states: [Todo, In Progress, Merging, Rework]
  terminal_states: [Done, Closed, Cancelled]
polling:
  interval_ms: 5000
workspace:
  root: ~/code/symphony-workspaces
hooks:
  after_create: |
    git clone --depth 1 https://github.com/me/my-repo.git .
codex:
  command: codex --sandbox danger-full-access app-server
  approval_policy: never
  thread_sandbox: danger-full-access
agent:
  max_concurrent_agents: 10
  max_turns: 20
\`\`\`

**Markdown 正文**是 Agent 的 prompt 模板，用 Liquid 风格的插值注入 Issue 数据：

\`\`\`
You are working on a Linear ticket \`{{ issue.identifier }}\`

Issue context:
Title: {{ issue.title }}
Description: {{ issue.description }}
Labels: {{ issue.labels }}

## Step 1: Start execution
- Determine current ticket state
- Find or create a Codex Workpad comment
- ...

## Status map
- \`Todo\` → move to In Progress
- \`In Progress\` → continue execution
- \`Human Review\` → wait for approval
- \`Merging\` → run land skill
- \`Rework\` → address feedback
\`\`\`

Symphony 启动时读这个文件，`workflow.ex` 解析 YAML frontmatter 拿到配置，`prompt_builder.ex` 把 Issue 的标题、描述、标签等信息塞进模板生成最终 prompt，然后发给 Codex。

改工作流就是改这个文件提 PR，跟改代码一个流程。这个思路跟 OKF 的 YAML frontmatter 异曲同工——都是把元数据和内容放在一起，人可读、Agent 也可读。

## 我本地的实际测试

我在本地搭了一套环境，Symphony 的终端面板长这样：

![Symphony TUI](/discover/symphony_tui.png)

架构是这样的：

\`\`\`
Symphony (Elixir/BEAM)
  ├── 轮询 Linear API (每 5s)
  ├── Workspace → ~/code/symphony-workspaces/{ISSUE_ID}/
  ├── Codex app-server 进程
  └── Phoenix 仪表盘 (:4000)
        │
        ▼
mimo2codex 协议代理 (:8788)
  ├── 翻译 Responses API → Chat Completions
  └── 转发到 DeepSeek API
        │
        ▼
DeepSeek V4 Flash (deepseek-v4-flash)
\`\`\`

为什么要加 mimo2codex？因为 Codex CLI 0.142.2 只支持 OpenAI 的 **Responses API**，而 DeepSeek 只提供 **Chat Completions API**，两边对不上。mimo2codex 就是个本地协议翻译器——把 Codex 的请求拆成 Chat Completions 的 messages 数组，再把 DeepSeek 的响应包装回 Responses API 格式。

### 踩坑记录

Symphony 本身跑起来不难，难的是它依赖的那一串工具链：

\`\`\`bash
# 1. bwrap 沙箱权限 —— Ubuntu 24.04 默认禁了用户命名空间
sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0

# 2. Git 认证 —— Workspace 里 push 没凭证
gh auth login --with-token < ~/.github-token
gh auth setup-git

# 3. Sandbox 策略覆盖 —— 默认的 turn_sandbox_policy 把 .git 设成只读
# 在 WORKFLOW.md 里显式配置即可解决
\`\`\`

### 实测：两轮 Issue

我一共跑了两个 Issue，过程挺折腾的。

**Round 1 — SHA-5: 多语言实现 two-sum**

先用最简单的场景测试 Symphony 能不能正常 pick Issue 和调度 Codex。我在 Linear 上创建了一个 Issue，Symphony 自动 pick 后在 Workspace 里启动了 Codex。实际代码是我自己提交的，但这轮验证了 Symphony 的调度链路是通的——从轮询 Linear、创建 Workspace、启动 Codex app-server 到 prompt 注入都没问题。

产出目录结构：

\`\`\`
two-sum/
├── python/two_sum.py + test_two_sum.py
├── javascript/twoSum.js + testTwoSum.js
├── go/two_sum.go + two_sum_test.go
├── rust/src/lib.rs + Cargo.toml
├── java/TwoSum.java
├── cpp/two_sum.cpp + two_sum.h + test_two_sum.cpp
└── README.md
\`\`\`

6 种语言、15 个文件、248 行代码。每种实现都保持了统一的 API 签名 \`twoSum(nums, target) -> indices\`，附了测试。

**Round 2 — SHA-6: 添加 GitHub Actions CI**

我想测试点更实用的东西——给仓库加 CI。Issue 内容是创建 GitHub Actions 工作流 + Makefile，让所有语言的测试能一键跑。

但这轮就没那么顺利了：

\`\`\`
▶ 第一次尝试：Codex 创建了 CI 文件和 Makefile，
  但 git commit 时报错：
  fatal: Unable to create '.git/index.lock': Read-only file system

  原因是 Codex 0.142.2 的 app-server 模式默认把 .git
  设成只读，而 Symphony 生成的默认 turn_sandbox_policy
  是 workspaceWrite，没有覆盖这个限制。

▶ 排查后发现需要显式配置 turn_sandbox_policy。
  改了 WORKFLOW.md 之后重启。

▶ 第二次尝试：Codex 重新运行，
  这次成功 commit → push → 创建 PR #1。
  但 WORKFLOW.md 要求 CI 通过后才能移 Human Review，
  Codex 只能反复轮询 CI 状态，白白消耗了 500 万 token。
\`\`\`

最终 PR 在这里：https://github.com/xilon-my/symphony-test/pull/1

![Linear Issue](/discover/linear.png)

两轮跑下来最大的感受是：Symphony 本身的设计很清晰，但真实环境的工程细节才是真正的耗时点。光解决 sandbox 权限问题就折腾了两次。

## Symphony 适合什么

它最适合的场景是**高信任度、小粒度、无外部依赖的任务**：

- ✅ 批量 Bug 修复（相互独立，互不阻塞）
- ✅ 文档生成 / 翻译
- ✅ 单功能实现（像 two-sum 这种）
- ❌ 跨多模块的复杂功能（没有 DAG 编排，Issue 之间没有依赖管理）
- ❌ 需求模糊的任务（没有意图提取层，需要人来拆解）

Elixir 参考实现还带了一个 Phoenix LiveView 仪表盘，能实时看到每个 Issue 的状态、Agent 的输出、Workspace 路径。启动后访问 \`localhost:4000\` 就能看。

如果把 Symphony 和 Multica 放在一起看就很清晰了——Multica 做"理解与规划"（把需求拆成任务 DAG），Symphony 做"执行与编排"（调度 Agent 逐个执行），两个合起来才接近完整的自主开发流程。`,
  takeaway: 'Symphony 本质上就是个调度器——它不写代码，但它让 Agent 自己写代码。真正的门槛不在 Symphony 本身，而在下游工具链的兼容性：Codex 协议、bwrap 沙箱、git 认证，这些工程基础设施的问题比 Agent 架构的问题更难缠。如果你也在搭类似的东西，先把工具链跑通再谈编排。',
}

export default project
