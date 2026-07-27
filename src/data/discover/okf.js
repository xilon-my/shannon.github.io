const project = {
  slug: 'okf',
  name: 'Open Knowledge Format (OKF)',
  url: 'https://github.com/GoogleCloudPlatform/knowledge-catalog',
  description: '一个供应商中立的开放知识格式，用 Markdown 文件加 YAML 前置元数据来表示知识。设计为人可读、AI 代理也可消费。',
  tags: ['Specification', 'Knowledge', 'Markdown'],
  stars: '7.8k+',
  author: 'Google Cloud',
  images: [],
  detail: `现在 AI Agent 越来越多了，但有个很尴尬的问题：每个 Agent 的知识都锁在不同的系统里。数据血缘在 Dataplex，指标定义在 Wiki，SQL 逻辑在代码库 —— 每个都有自己的 API，谁也读不懂谁。Agent 好不容易搞清楚一个查询的含义，也没法写回去，下次换个 Agent 来又得重新摸索。

OKF 的解决方式特别朴实：就是 Markdown 文件加个 YAML 头，放目录里，用 Git 管。没了。不搞新东西，不搞专有格式，人能直接看，Agent 也能直接读。

它只规定一件事：每个文件必须有一个 type 字段。其他什么 title、description、tags 都是可选的。没有中央注册表，不需要 SDK，不需要任何特殊工具。

我觉得最有意思的是 v0.2 加的那套可信度体系。每条知识可以记录：

- 谁写的（generated）：是人还是 Agent？
- 谁核验的（verified）：机器确认还是人工审过？
- 多久过期（stale_after）：今天还靠谱吗？
- 引用来源（sources）：信息来源是哪，被用过多少次，最近谁改过？

比如这样：

\`\`\`yaml
generated: { by: reference_agent/gemini-2.5-pro, at: 2026-06-20T22:53:05Z }
verified: { by: human:ahormati, at: 2026-06-25T09:00:00Z }
stale_after: 2026-09-23
sources:
  - id: rev-policy
    resource: https://wiki.acme/finance/revenue-recognition
    author: team:finance-fpa
    usage_count: 5000
    last_modified: 2026-04-02
\`\`\`

还有一个叫 Attested Computation 的东西，挺硬核的。不光是说"收入是多少"，而是规定了"收入应该怎么算" —— 一段 SQL，Agent 只能填参数不能改逻辑。跑完之后有个 attester 来验证 Agent 确实跑的是这段 SQL，结果也对得上。财务、合规这类场景就很需要这个。

仓库里有个示例包 bundles/acme_retail/，一个零售公司的知识包：

\`\`\`
bundles/acme_retail/
├── index.md
├── log.md
├── tables/orders.md
├── metrics/revenue.md
├── computations/gross-margin-period.md
├── policies/revenue-recognition.md
├── attesters/sql_equality.py
└── viz.html
\`\`\`

打开 viz.html 能看到一个交互式的知识图谱，所有概念之间的链接关系都画出来了。

反正它的思路就是：用 Markdown + YAML + Git 这套人已经用得很好的东西来管知识，不给 Agent 搞特权格式。\
`,
}

export default project
