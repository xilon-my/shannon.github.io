const project = {
  slug: 'multica',
  name: 'Multica',
  url: 'https://github.com/multica-ai/multica',
  description: '一个开源的多智能体协作平台。像分配给同事一样给 AI 编程代理分配 Issue，代理自主编写代码、报告阻塞、更新进度。',
  tags: ['Go', 'AI Agents', 'DevTools'],
  stars: '42k+',
  author: 'multica-ai',
  images: [],
  detail: `Multica 是一个将 AI 编程代理变成真正队友的开源平台。你不再需要在终端里复制粘贴 Prompt —— 只需在看板上创建 Issue 并分配给代理，它们会自动写代码、跑测试、报告阻塞，并实时更新状态。

后端用 Go 编写，前端是 Next.js 16，支持多种 Agent CLI（Claude Code、Codex、CodeBuddy、GitHub Copilot CLI 等），保持厂商中立。核心创新在于 Squad（小队）系统：多个代理和人类组成一队，由 leader 代理分配任务，实现大规模的并行执行。

其他亮点功能：Autopilot 支持定时/周期性任务（cron 或 webhook 触发），可复用技能系统让已完成的方案沉淀为团队资产，统一的运行时面板同时管理本地 daemon 和云端计算。工作区提供完全隔离环境。

项目采用 Apache 2.0 许可证，已快速增长到 42k+ stars。背后的核心理念是：大规模管理 AI 代理需要的不是一个终端，而是一个协作平台。`,
}

export default project
