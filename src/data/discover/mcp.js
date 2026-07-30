const project = {
  slug: 'mcp',
  date: '2026-07-29',
  name: 'Model Context Protocol (MCP)',
  url: 'https://github.com/modelcontextprotocol',
  description: 'AI Agent 与外部工具之间的开放标准协议。由 Anthropic 创建，现由 Linux 基金会旗下的 AAIF 管理，让模型以统一的方式调用工具、读取数据、执行操作。',
  tags: ['Protocol', 'Standard', 'Agents'],
  stars: '40k+',
  author: 'Anthropic / AAIF',
  detail:
`在 MCP 出现之前，给 AI 模型接工具是一个工具一套写法。你要让 Claude 能查数据库，写一个 database tool；让 ChatGPT 也能查同一个数据库，再写一个。每个模型都有自己的 tool calling 格式——OpenAI 的是 function calling，Anthropic 的是 tool use，参数怎么传、错误怎么返回，全不一样。N 个模型 × M 个工具 = N×M 个适配器。

MCP 的思路是把这层标准化：每个工具写一个 MCP server，所有兼容 MCP 的客户端（Claude、ChatGPT、Cursor、VS Code 等等）都能用它。这就是一个标准插座，谁都能插。不用为每个模型重复造工具。

但光说"标准插座"还不够，得看它具体是怎么接的。

## 一个请求的完整流程

假设你装了天气查询的 MCP server，然后问 Claude "东京今天多少度"。背后发生的事情是：

\`\`\`
你 → Claude Desktop (Host)
         ↓ 发现你有天气 MCP server
         ├─ MCP Client(weather) → JSON-RPC over HTTP → MCP Server(weather)
         │                              ↓
         │                     Server 返回 tools/list
         │                              ↓
         ├─ Claude 看到有 get_forecast 这个 tool
         │    ↓ 决定调用
         ├─ MCP Client(weather) → tools/call {name:"get_forecast", args:{city:"东京"}}
         │                              ↓
         │                     Server 查天气API，返回结果
         │                              ↓
         └─ Claude 收到结果，组织成自然语言回复你
\`\`\`

这就是 MCP 的核心模型。三个角色：

- **Host** —— 你直接用的 AI 应用（Claude Desktop、Cursor、VS Code）。它负责管理哪些 MCP server 是打开的、每个连接权限如何。
- **Client** —— Host 内部跟每个 Server 一一对应的协议客户端。Host 启动时会为每个配置好的 MCP server 创建一个 Client。Client 负责把 Host 的请求翻译成 JSON-RPC 2.0 发给 Server。
- **Server** —— 一个轻量程序，暴露该工具的能力。Server 不需要知道对面是什么模型，它只做一件事：收到请求，干活，返回结果。

一个 Host 可以同时连接多个 Server（比如一个连文件系统、一个连数据库、一个连 Slack），每个 Server 被一个独立的 Client 管理。

## Server 暴露什么

每个 MCP server 可以暴露三类主要能力：

| 能力 | 就像 | 干什么用 |
|------|------|---------|
| **Tools** | 函数/API | Agent 主动调用，执行操作（发邮件、查天气、创建 Jira） |
| **Resources** | 文件/数据 | Agent 读取上下文（读文件、查文档、查数据库记录） |
| **Prompts** | 模板 | 预置的 prompt 模板，Server 告诉 Agent 怎么跟自己打交道 |

最常用的是 Tools。Agent 调用 tool 的完整流程是：

1. Host 通过 Client 发 \`tools/list\`，Server 返回有哪些 tool 可用（名字、参数 schema、描述）
2. 模型（比如 Claude）根据用户问题决定调哪个 tool
3. Host 通过 Client 发 \`tools/call {name, arguments}\`
4. Server 执行操作，返回结果
5. Host 把结果送回给模型，模型生成回复

整个过程走 **JSON-RPC 2.0** 协议。传输层有两种：本地用 **stdio**（把 Server 当子进程启动，走 stdin/stdout），远程用 **Streamable HTTP**。生产环境要求 HTTPS。

## 为什么需要这套东西

在 MCP 出现之前，给 AI 接工具的工作流是：你在 prompt 里描述工具 → 模型输出特定格式 → 你解析 → 你调 API → 你把结果塞回去。每家做的格式不一样，换个模型整套重来。

MCP 把"模型怎么声明工具有哪些"、"怎么调用"、"错误怎么返回"这些全部标准化了。换句话说，它把 AI tool calling 从"各家自己定"变成了"行业标准协议"。

## 发展简史

MCP 最早是 Anthropic 在 2024 年 11 月开源的。初期只有简单的工具调用和文件读取，走 SSE 长连接。

几个关键转折点：

**2025 年 4 月** — OpenAI 和 Google 都宣布在自己的产品里接入 MCP。这标志着 MCP 从 Anthropic 一家的事情变成了行业标准。

**2025 年 12 月** — Anthropic 把 MCP 捐给了 Linux 基金会旗下的 **Agentic AI Foundation（AAIF）**。AWS、Google、Microsoft、OpenAI 都是 AAIF 会员。从此没有任何一家公司能控制 MCP 的方向。

**2026 年 7 月 28 日** — MCP 最大的更新发布。

## 2026-07-28 更新

这次更新最核心的变化是**去掉了 session**。

原来的 MCP 需要客户端和服务端先通过 initialize 握手建立 session，之后所有请求都绑定这个 session。这在普通服务器上没问题，但 serverless 环境（AWS Lambda、Cloudflare Workers）用不了——它们不维护持久连接。

新版本每个 HTTP 请求自包含协议版本和能力声明：

\`\`\`
POST /mcp HTTP/1.1
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: search
\`\`\`

Server 不需要记住你是谁，每个请求都是独立的。Session 没了，但状态还在——只是从隐含的传输层变成了显式的 tool 参数。

两个新加的扩展机制：

- **MCP Apps** —— 在对话里嵌入交互式 UI（sandboxed iframe）。不只是返回文本，Server 可以返回一个仪表盘或表单渲染在对话里。
- **Tasks** —— 异步长时间任务，客户端轮询获取结果，不需要保持连接。

认证方面对齐了企业标准：OAuth 2.0 / OpenID Connect，支持 Entra、Okta 这些身份提供商。

## 生态

到 2026 年中，MCP 的 SDK 月下载量已经超过 4 亿次，Claude 的连接器目录收录了 950+ Server。SDK 覆盖 TypeScript、Python、Go、C#、Rust、Java。

Pi 拒绝 MCP 的理由是"Build CLI tools with READMEs"——让 Agent 直接读 README 然后调用 CLI，不要中间层。这是个可选的立场，但从生态数据看，MCP 已经成为 Agent 工具连接的事实标准。`,
  takeaway: 'MCP 把 AI 工具调用从各家自定义格式变成了行业标准协议。Host/Client/Server 三层模型、JSON-RPC 2.0 通信、无状态设计——它在 Agent 基础设施层扮演的角色，某种程度上类似 HTTP 之于 Web：不是唯一的选择，但大多数人都在用。',
}

export default project
