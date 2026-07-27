const project = {
  slug: 'symphony',
  name: 'Symphony',
  url: 'https://github.com/openai/symphony',
  description: 'OpenAI 的自主编码自动化参考实现。监控 Issue 跟踪器，自动派发 AI 代理实现任务，要求提供工作量证明后才能合入代码。',
  tags: ['Elixir', 'AI Agents', 'Automation'],
  stars: '26k+',
  author: 'OpenAI',
  images: [],
  detail: `Symphony 是 OpenAI 发布的一个低调试水工程预览，用于实现自主软件开发。它将项目管理任务转化为隔离的、自主的实现流程：代理捡起一个 Issue，创建隔离工作区，实现代码变更，跑 CI，发起代码审查，录制操作演示视频，最后才提交 PR 等待合并。

参考实现使用 Elixir 编写，但项目有意保持语言无关 —— 真正的价值在于规范模式本身。README 明确邀请你根据提供的规范用任何语言实现 Symphony。

核心设计原则包括：强制工作量证明（CI 通过、审查通过、复杂度分析）、隔离工作区确保 Agent 的实验不会污染主代码库、以及 WORKFLOW.md 配置文件告诉代理如何行为。目前支持 Linear 作为 Issue 跟踪器，OpenAI Codex 作为 Agent 运行时。

26k+ stars 的 Symphony 代表了对"工程化护栏（harness engineering）"的押注 —— 如果你用清晰的约定和护栏来设计代码仓库，AI 代理可以在其中比在临时拼凑的设置中自主得多。`,
}

export default project
