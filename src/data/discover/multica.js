const project = {
  slug: 'multica',
  date: '2026-07-30',
  name: 'Multica',
  url: 'https://github.com/multica-ai/multica',
  description: '一个开源的多智能体管理平台。像分配给同事一样给 AI 编程代理分配 Issue，代理自主编写代码、报告阻塞、更新进度。',
  tags: ['Go', 'AI Agents', 'DevTools'],
  stars: '42k+',
  author: 'multica-ai',
  detail:
`用 Symphony 的时候我就在想一个问题：你有了能写代码的 Agent，但你总不能每次都手动分配任务、手动检查进度、手动跟踪谁在干什么。人多了需要 Jira，Agent 多了也需要一个 Jira。

Multica 就是干这个的。

它不是又一个能写代码的 Agent——它不写代码，它管理写代码的 Agent。你装一个后台 daemon，连上 Claude Code、Codex、Pi、Copilot 或者其他 15 种 Agent CLI，然后在网页上给它们分任务。就像在 GitHub Issues 里 @一个人一样 @Agent。

## 怎么工作的

流程很简单。装好 CLI 跑一遍 \`multica setup\`，启动 daemon，daemon 自动检测你机器上装了哪些 Agent CLI。然后在网页上创建一个 Agent 配置文件，选一个 runtime 和一个 provider（比如 Claude Code），之后就能创建 Issue 分配给这个 Agent。

Agent 拿到 Issue 后的生命周期：接单 → 启动 → 执行 → 完成或失败。过程中通过 WebSocket 实时更新进度，会在 Issue 下面留言、报告阻塞、创建子任务。

\`\`\`
你创建 Issue → 分配给 Agent
                  ↓
Agent 接单 → 拉代码 → 分析 → 编码 → 测试 → 提交 PR
                  ↓
            你在网页上看进度，跟看同事干活一样
\`\`\`

## Squads：关键的创新

单个 Agent 能做的事情有限，但多 Agent 怎么协作是个没标准答案的问题。Multica 的答案是 **Squad（小队）**——把多个 Agent 和人类组队，指定一个 leader，任务分配给小队而不是个人。

比如你有前端 Agent、后端 Agent、设计 Agent，把它们组一个 Squad，assign Issue 给 \`@FrontendTeam\`。leader Agent 决定谁来接这个任务，团队扩张时路由规则不用改。

Leader 在分任务时会收到一份简报，包含小队成员列表（谁是谁、各自有什么技能）和操作协议。Leader 可以评估执行结果，决定这个 Issue 要不要继续、跳过、或者标记失败。

这个设计比硬编码的工作流灵活——你把决策权交给 leader Agent，而不是在配置文件里写死路由规则。

## Autopilot：定时任务

Autopilot 让 Agent 按计划干活。三种触发方式：

- **Cron** —— 每天早上的站会总结、每周的报告、定期的代码审查，设好 cron 表达式自动跑
- **Webhook** —— 外部系统触发，比如 CI 失败时自动创建一个 Issue 分配给对应的 Agent
- **手动** —— UI 上点"立即执行"

有两种执行模式：\`create_issue\`（创建一个 Issue 上板，留下审计记录）和 \`run_only\`（直接执行不留记录）。并发策略有 skip、queue、replace 三种。

## Skills：可复用的能力包

每个 Agent 完成任务后产出的方案可以沉淀为 **Skill**。Skill 是一个包含 \`SKILL.md\` 和支持文件的目录，可以在团队内复用。

导入方式很灵活——可以从 URL 导入、从本地 zip 上传、或者直接连到 GitHub 仓库里的 \`SKILL.md\`。导入了之后绑定到 Agent，下次 Agent 跑任务时 daemon 会自动把 Skill 注入到工作目录里（Claude Code 的 \`.claude/skills/\` 目录、Codex 的 \`CODEX_HOME/skills/\` 等）。

系统里有个 \`skills-lock.json\`，类似 npm 的 lockfile，锁定了每个 Skill 的版本和哈希。这在团队里很重要——你知道今天用的"部署流程"Skill 跟上周是一样的。

## 跟 Symphony 的对比

我在 Symphony 那篇文章里提到 Multica 做"理解与规划"，Symphony 做"执行与编排"。现在看来这个区分还是准的。

Symphony 的定位是编码自动化——盯 Linear 面板，自动派 Codex 去干活。它假设你已经有了一套项目管理流程（Linear），它只负责"把 Issue 变成代码"这一段。

Multica 覆盖的范围更广。它自己就是项目管理平台（有一套看板和 Issue 系统），Agent 管理只是它的一部分功能。它不挑 Agent 类型——Claude Code、Codex、Pi、Copilot 都支持，Symphony 只跟 Codex 配合。

技术上，Multica 后端用 Go（Chi router + sqlc + PostgreSQL），前端 Next.js 16，daemon 跑在本地机器上。后端管理任务队列和状态，daemon 负责实际调用 Agent CLI。

## 架构

\`\`\`
浏览器 (Next.js 前端)
     ↕ HTTP
Go 后端 (Chi + PostgreSQL)
     ↕
Daemon (运行在本地机器上)
     ↕ 调用
Claude Code / Codex / Pi / Copilot / ...
\`\`\`

这个分离的好处是：后端的任务管理和前端的看板不依赖本地 daemon。你在网页上创建 Issue 时 daemon 可以离线，它重新上线后会拉取所有待处理的任务。

## 适合什么

它解决的不是"Agent 写不出代码"的问题——那是 Claude Code 和 Codex 的事。它解决的是"Agent 多了怎么管"的问题。

- ✅ 团队里同时跑多个 Agent
- ✅ Agent 分布在不同的机器上
- ✅ 需要定时任务和自动化
- ✅ 想把 Agent 产出沉淀下来复用
- ❌ 你只有一个 Agent 在本地跑跑

一个比较合适的场景：后端 Agent 写 API、前端 Agent 写页面、CI Agent 跑测试，三个人类工程师 + 三个 Agent 组一个 Squad。你在看板上看到的是 6 个"人"在干活，分不清谁是人类谁是 Agent，也不需要在分清楚。`,
  takeaway: 'Multica 解决的问题跟 Symphony 不一样——Symphony 是"让 Agent 自己写代码"，Multica 是"让一群 Agent 像队友一样协作"。它的 Squad 系统是目前看到的多 Agent 编排里最实用的设计之一，不硬编码路由规则，把决策权交给 leader Agent。如果你手上有多个 Agent 在跑，迟早需要一个 Multica。',
}

export default project
