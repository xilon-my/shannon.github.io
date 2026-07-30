const project = {
  slug: 'superpowers-openspec',
  date: '2026-07-30 15:00',
  name: 'Superpowers + OpenSpec',
  url: 'https://github.com/obra/superpowers',
  description: 'Superpowers 是一套给 AI 编程代理用的结构化方法论，OpenSpec 是一个 AI 原生的 spec 驱动开发框架。一个管过程一个管契约，放在一起看才完整。',
  tags: ['Framework'],
  stars: '9.2k+ / 12k+',
  author: 'Obra (Prime Radiant) / Fission AI',
  detail:
`AI Agent 写代码的能力已经很强了，但用起来还是觉得不稳——不是它写不出来，是它写出来的东西不知道靠不靠谱，它自己也不知道。

两个项目正好从两个方向在理清这件事。

Superpowers 管行为——给 Agent 一套强制的工作流程，不让你跳过步骤。
OpenSpec 管契约——把"要做什么"写成明文，人和 AI 对着同一个东西做事。

一个从外面框住 Agent 的行为，一个从里面框住 Agent 的目标。只用一个总觉得差点意思。

## Superpowers：Agent 的纪律

Superpowers 的作者是 Jesse Vincent（Obra），做 Perl 的那个，现在是 Prime Radiant 的创始人。这哥们的 CLAUDE.md 第一句是"这个仓库有 94% 的 PR 被拒"，下面列了一堆 AI 贡献者常犯的错误，用词是"your job is to protect your human partner from that outcome"和"that is not being helpful. that is being a tool of embarrassment"——语气毫不含糊。

整个项目就是这个气质：帮 AI 建立纪律，而且这个纪律是强制的。

### 做了什么

Superpowers 是一组 skill 文件，让 Agent 启动后自动走一套完整的开发流程：

\`\`\`
brainstorming → 用 worktree 隔离 → 写计划 → 子 Agent 驱动开发 → TDD → 代码审查 → 收尾
\`\`\`

每个步骤都是强制的。bootstrap skill 里有个"Red Flags"表，列出了 Agent 可能用来跳过流程的常见借口——"这个很简单"、"我先看看代码"、"我知道那个意思"——然后每条后面写"不行，你必须走"。在本地跑 Claude Code 的时候试过，确实绕不过去。

最有意思的设计是 Subagent-Driven Development（SDD）：主 Agent 把任务拆成小块，每块传一个干净的子 Agent 去执行。子 Agent 不继承会话历史，只拿到当前任务的上下文，执行完了还有两轮审查（先查是否满足 spec，再查代码质量）。5 轮上限，超了主 Agent 介入仲裁。

### 为什么 Cross-Harness 这件事值得注意

Superpowers 目前支持 11 个平台：Claude Code、Cursor、Codex、Gemini CLI、Kimi Code、OpenCode、Pi、Antigravity、Copilot CLI、Factory Droid，还有一堆。

它的架构分三层：

1. **skills/** —— 纯行为描述，不提具体工具的 API
2. **tool mapping** —— 每个平台一个映射文件，把行为翻译成具体工具的调用
3. **bootstrap** —— 启动时注入 skill 内容 + tool mapping

底层逻辑是：Methodology 应该跟平台无关。你在 Claude Code 上学到的纪律，换到 Codex 上应该一样成立。

不过实际用下来有一些摩擦。Claude Code 的 plugin 系统天然支持 hook 注入，体验最好。Pi 需要安装 extension，Cursor 走的是不同的 hooks 格式（key 是 lowerCamelCase 不是 kebab-case）。跨平台维护一套行为规范是好事，但每次换平台都要确认工具映射是对的——这可能是 Superpowers 后续需要解决的开发者体验问题。

## OpenSpec：Agent 的蓝图

如果说 Superpowers 管的是"Agent 怎么干活"，OpenSpec 管的就是"Agent 要干什么活"。

它来自 Fission AI，核心开发者是 Tabish Bidiwale。项目 description 写的是"the most loved spec framework"，口气不小，但它的设计确实解决了一个很实际的问题。

### Spec 驱动的核心设计

OpenSpec 的工作目录长这样：

\`\`\`
openspec/
├── config.yaml          # 项目配置
├── specs/               # 当前系统的行为描述（事实来源）
│   ├── artifact-graph/
│   ├── cli-init/
│   ├── telemetry/
│   └── ...
└── changes/             # 进行中的变更
    ├── add-dark-mode/
    │   ├── proposal.md  # 为什么干
    │   ├── specs/       # delta spec（改了啥行为）
    │   ├── design.md    # 技术方案
    │   └── tasks.md     # 实施清单
    └── archive/         # 已完成变更
\`\`\`

五个核心概念：Spec 是事实 → Change 是工作单元 → Delta spec 描述差异 → Artifact 层层递进 → Archive 把变更融回事实。

它的工作流是 slash command 驱动的。你一个命令就能走完整个周期：

\`\`\`
/opsx:explore            → 跟 AI 讨论方案
/opsx:propose name       → 生成 proposal + specs + design + tasks
/opsx:apply              → AI 逐项实施
/opsx:archive            → 变更归档，specs 更新
\`\`\`

试了一下 \`openspec init\`，它帮你生成 openspec/ 目录结构和 config.yaml。跑完之后感觉……确实轻。没有 Schema Registry，没有中央服务器，没有 SDK 依赖——就一个 CLI 加一个目录。

### Delta Spec 是关键创新

大部分 spec 框架要求你先写完所有文档再开始编码。这对绿地上的项目可能行，但对已有的几十万行代码来说不现实。

OpenSpec 的解法是 delta：在 Change 里只写"新增了什么要求"、"修改了什么"、"删除了什么"。Archive 的时候这些 delta 自动合并到主 spec 里。

这是它跟 GitHub Spec Kit 和 Kiro 最大的区别——不是让你一次性写完所有文档，而是允许你在一个已有的系统上渐进式地加 spec。换句话说，它是在回答"怎么给一条正在航行的船换零件"这个问题。

## 放在一起看

这两个项目放在一起不是巧合。

Superpowers 是一个能约束 Agent 行为的方法论。但方法论管的是"怎么做"，不是"做什么"。没有 OpenSpec 的话，Agent 按 Superpowers 的流程跑完 brainstorming 和 planning，但它的"计划"还是基于对话历史里那些零散的描述——不是基于一份结构化的、可审计的 spec。

反过来也一样。OpenSpec 给了你一份漂亮的 spec 文档，但如果没有 Superpowers 那样的流程约束，Agent 可能在写了三行代码之后就跑偏了，或者跳过了测试，或者做了 scope creep——spec 还在那里，但代码已经不是 spec 的样子了。

\`\`\`
         Superpowers                OpenSpec
    ┌──────────────────┐      ┌──────────────────┐
    │   brainstorming   │      │  proposal.md     │
    │   writing-plans   │      │  specs/ (delta)  │
    │   TDD             │      │  design.md       │
    │   code-review     │      │  tasks.md        │
    │   finishing-branch│      │  archive         │
    └──────────────────┘      └──────────────────┘
           行为框架                     契约框架
\`\`\`

一个是"Agent 不准跳过测试"，一个是"你刚改的那个 API 对应这条 requirement"。

一个成熟的项目两个都需要。Superpowers 解决"Agent 怎么写代码"，OpenSpec 解决"Agent 写的是什么"——一个偏执行质量，一个偏目标对齐。

## 各自的瓶颈

Superpowers 目前最大的门槛是学习成本。94% 的 PR 被拒率说明他们在维护上有极高的标准，但对普通用户来说，装完触发的第一个 brainstorming 会话可能会觉得太啰嗦——它真的会在你问"帮我改个按钮颜色"的时候走完 brainstorm → plan → TDD 的全流程。在不需要全流程的场景下（比如确实就是改个按钮颜色），这是噪音。它的文档也提到了"如果 agent 觉得某个 skill 不适合当前场景，可以跳过"，但 Red Flags 表的存在说明跳过的门槛不低。

OpenSpec 的问题是它依赖团队纪律。没人拦着你跳过 \`/opsx:propose\` 直接改代码——但一旦跳了，spec 就跟代码脱节了，然后整个系统就退化成"一堆没人看的 Markdown"。这不是 OpenSpec 独有的问题，所有文档驱动开发都面临这个，但 OpenSpec 把它暴露得更清晰，因为它太轻了——轻到你可以随时开始，也可以随时放弃。

OpenSpec 的 dogfooding 做得很好。它自己的 \`openspec/\` 目录里有 35 个 spec 文件、80+ 个已归档变更。装完之后看一眼他们自己怎么用的，基本就知道这套东西的边界在哪了。`,
  takeaway: 'Superpowers 和 OpenSpec 从两个方向回答同一个问题——怎么让 AI Agent 产出可靠的结果。Superpowers 管行为流程，OpenSpec 管需求契约。两个项目出自不同作者、不同社区，但它们解决的问题恰好互补。如果选一个开始，先用 OpenSpec 把"我要做什么"写下来，再用 Superpowers 让 Agent 按流程把这个"什么"做出来。只有行为框架没有契约框架，Agent 可能在正确的时间做错误的事；只有契约框架没有行为框架，Agent 可能在错误的时间做正确的事。',
}

export default project
