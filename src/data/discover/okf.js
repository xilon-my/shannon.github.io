const project = {
  slug: 'okf',
  name: 'Open Knowledge Format (OKF)',
  url: 'https://github.com/GoogleCloudPlatform/knowledge-catalog',
  description: '一个供应商中立的开放知识格式，用 Markdown 文件加 YAML 前置元数据来表示知识。设计为人可读、AI 代理也可消费。',
  tags: ['Specification', 'Knowledge', 'Markdown'],
  stars: '7.8k+',
  author: 'Google Cloud',
  images: [],
  detail: `Open Knowledge Format（OKF）是一种用自包含 Markdown 文件包来表示知识的规范。由 Google Cloud 于 2026 年 6 月在 knowledge-catalog 仓库中发布，但格式本身完全供应商中立 —— 不需要任何 Google API 或服务。

核心思想很简单：一个知识包就是一个目录，里面放 .md 文件，每个文件有 YAML 前置元数据，至少包含一个 type 字段。文件之间可以通过标准 Markdown 链接互相引用，形成一个概念图，既可由人类（在任何 Markdown 查看器中）浏览，也可由 AI 代理（编程式）导航。可选字段包括 title、description、resource、tags 和 timestamp。

OKF 有趣之处在于它不做的事：不需要 SDK，不需要专有模式语言，没有锁定。它可以与现有工具组合使用 —— Obsidian、Hugo、MkDocs，或者就一个文本编辑器。参考实现包含一个 Producer Agent（从 BigQuery 丰富知识包）和一个 Consumer 可视化工具（将知识包渲染为力导向图，支持搜索和类型过滤）。

社区工具生态正在快速增长，包括 okf-lint、okf-toolset，以及教 AI 编码代理读写 OKF 的 agent skills。它是最接近"AI 代理可读知识标准格式"的东西。`,
}

export default project
