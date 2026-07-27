const project = {
  slug: 'openai-agents-python',
  name: 'OpenAI Agents SDK',
  url: 'https://github.com/openai/openai-agents-python',
  description: 'OpenAI 官方发布的 Python SDK，用于构建多智能体工作流。轻量但强大，支持 100+ 大语言模型，提供 Agent 编排、护栏、追踪等功能。',
  tags: ['Python', 'AI Agents', 'SDK'],
  stars: '28k+',
  author: 'OpenAI',
  images: [],
  detail: `OpenAI Agents SDK 是 OpenAI 官方的多智能体工作流框架。如其名所示，它是一个轻量但功能强大的工具包，用于构建、编排和部署 AI 代理。虽然由 OpenAI 发布，但它是供应商中立的 —— 除了 OpenAI 自己的 API，还通过集成支持 100+ 其他大语言模型。

核心功能包括：

- **Agent** —— 配置了指令、工具、护栏和转交能力的 LLM
- **Sandbox Agent** —— 在容器内运行的预配置代理，适合需要文件检查、命令执行或打补丁的长时间任务
- **Agent 转交与工具调用** —— 代理可以将子任务委派给其他代理，或使用工具（函数、MCP、托管工具）
- **Guardrails（护栏）** —— 可配置的输入/输出安全检查
- **Human-in-the-Loop** —— 内置人工介入机制
- **会话管理** —— 跨运行自动追踪对话历史
- **Tracing（追踪）** —— 内置可观测性，用于调试和优化工作流
- **Realtime Agent** —— 基于 WebSocket 的语音/多模态代理，由 gpt-realtime-2.1 驱动

技术栈上，要求 Python 3.10+，核心依赖包括 Pydantic、Requests、MCP Python SDK。可选的 extras 包括语音（voice）、Redis 会话（redis）和 Docker 沙箱（docker）。项目采用 MIT 许可证，文档完善，配套有 JS/TS 版本（openai/openai-agents-js）。

它代表了 OpenAI 在"代理框架"层面的战略 —— 不是提供一个黑盒产品，而是开源一个框架，让开发者自己构建和定制 AI 代理工作流。`,
}

export default project
