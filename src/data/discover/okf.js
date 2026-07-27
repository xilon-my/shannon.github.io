const project = {
  slug: 'okf',
  name: 'Open Knowledge Format (OKF)',
  url: 'https://github.com/GoogleCloudPlatform/knowledge-catalog',
  description: '一个供应商中立的开放知识格式，用 Markdown 文件加 YAML 前置元数据来表示知识。设计为人可读、AI 代理也可消费。',
  tags: ['Specification', 'Knowledge', 'Markdown'],
  stars: '7.8k+',
  author: 'Google Cloud',
  images: [],
  detail:
`Agent 越来越多，知识散得到处都是 —— 数据血缘在 Dataplex，指标定义在 Wiki，SQL 在代码库。各有各的 API，互相读不懂。Agent 搞清楚一件事也写不回去，换个 Agent 来又重来。

OKF 说：别搞了，就用 Markdown。

一个目录，一堆 .md 文件，每个文件头顶 YAML 写元数据，正文写内容。人用 cat 能看，Agent 直接丢进 context 也能看。放 Git 里，改就是 PR，历史就是 git log。

你只要给每个文件一个 type 就行，别的都是可选的。

v0.2 加了套可信度机制 —— 每条知识可以记：谁写的（是人还是 Agent）？谁核验过？什么时候过期？引用了什么来源？来源活不活跃？

\`\`\`yaml
generated: { by: reference_agent/gemini-2.5-pro, at: 2026-06-20T22:53:05Z }
verified: { by: human:ahormati, at: 2026-06-25T09:00:00Z }
stale_after: 2026-09-23
\`\`\`

还有个 Attested Computation，挺有意思。不只说"收入是多少"，而是把"收入应该怎么算"写成 SQL 定死。Agent 只能填参数不能改逻辑，跑完有人验。财务合规场景很实用。

反正思路就是：不搞特权格式，人用什么 AI 就用什么。`,
}

export default project
