const project = {
  slug: 'okf',
  name: 'Open Knowledge Format (OKF)',
  url: 'https://github.com/GoogleCloudPlatform/knowledge-catalog',
  description: '开放知识格式，用 Markdown 文件加 YAML 前置元数据来表示知识。设计为人可读、AI 代理也可消费。',
  tags: ['Specification', 'Knowledge', 'Markdown'],
  stars: '7.8k+',
  author: 'Google Cloud',
  images: [],
  detail:
`现在 Agent 越来越多了，但每个 Agent 的知识都锁在不同的系统里 —— 数据血缘在 Dataplex，指标定义在 Wiki，SQL 在代码库。各有各的 API，谁也读不懂谁。

OKF 的解法很粗暴：就用 Markdown。

一个知识包就是一个目录，里面一堆 .md 文件，每个文件头顶 YAML 写元数据，正文写内容。人用 cat 能看，Agent 也能直接丢进 context。放 Git 里，改就是 PR，历史就是 git log。

具体到每个文件长这样：

\`\`\`markdown
---
type: BigQuery Table
title: Customer Orders
description: 一行一个已完成的客户订单，全渠道。
tags: [sales, orders]
resource: https://console.cloud.google.com/bigquery?p=acme&d=sales&t=orders
generated: { by: reference_agent/gemini-2.5-pro, at: 2026-06-20T14:30:00Z }
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| order_id | STRING | 全局唯一订单ID |
| customer_id | STRING | 外键，关联 customers 表 |
| total_usd | NUMERIC | 订单总额（美元） |

关联 [customers](/tables/customers.md) 表。
\`\`\`

格式只强制一个字段：type。别的全是可选的。没有中央注册表，不需要 SDK。

代码仓里 okf/bundles/ 下面放了几个示例包：

\`\`\`
okf/bundles/
├── acme_retail/                # 虚构的零售公司，最完整
├── ga4/                        # Google Analytics 4 电商数据集
├── stackoverflow/              # Stack Overflow 公开数据集
└── crypto_bitcoin/             # Bitcoin 区块链数据
\`\`\`

以 acme_retail 为例：

\`\`\`
bundles/acme_retail/
├── index.md                    # 目录清单，列出有什么
├── log.md                      # 变更日志，记录谁什么时候改了啥
├── tables/
│   ├── index.md
│   └── orders.md               # 数据表定义
├── metrics/
│   ├── index.md
│   ├── revenue.md              # 指标定义
│   └── gross-margin.md
├── computations/
│   ├── index.md
│   ├── gross-margin-period.md  # 可验证的计算（SQL 定死了怎么算）
│   └── revenue-ytd.md
├── policies/
│   ├── index.md
│   └── revenue-recognition.md  # 政策文档
├── attesters/
│   ├── index.md
│   └── sql_equality.py         # 验证脚本，用来验 Agent 跑的结果对不对
└── viz.html                    # 可视化页面
\`\`\`

viz.html 是把整个知识包渲染成交互式图谱的工具。用 Cytoscape.js 画的力导向图 —— 每个概念是一个节点，Markdown 里的链接关系是边。点一个节点能看到它的 frontmatter 和正文，还能搜索和筛选类型。不需要后端，一个 HTML 就能跑。

这个 viz 是通过 \`reference_agent visualize --bundle ./bundles/acme_retail\` 生成的，本身也是一个 OKF consumer 的参考实现。

除了 bundles，仓库里还带了两套参考实现，把整个"从数据源到知识包"的流程跑通：

**1. reference_agent（Python + Google ADK）**

两阶段 Producer Agent，自动从数据源生成 OKF 知识包：

\`\`\`
第一阶段：BQ pass
  从 BigQuery 读表结构（列名、类型、描述），为每张表写一个 OKF 概念文件

第二阶段：Web pass
  给 Agent 一组 seed URL（比如 GA4 官方文档链接），它会自己去爬、
  判断哪些页面能补充已有的概念，把有用的信息写进对应的 .md 文件里。
  有页面数量上限和域名限制，不会爬疯。

跑完后自动生成 index.md 目录清单。

命令：
reference-agent enrich --source bq --dataset project.dataset \\
  --web-seed-file seeds.txt --out ./bundles/my-bundle

还带一个 visualize 子命令，把知识包渲染成交互式 HTML 图谱。

**2. toolbox/mdcode（TypeScript）**

做的是反向的事情：把你的知识包和数据目录保持双向同步。

\`\`\`
mdcode init --bigquery-dataset project.dataset    # 从 BQ 初始化
mdcode pull                                        # 从数据目录拉最新结构
mdcode push                                        # 把本地的改动推回去
\`\`\`

相比于 reference_agent 用 Agent 来自动写文档，mdcode 更像个数据同步 CLI —— 它读你的数据目录结构（Dataplex Entry Group、BigQuery 数据集、Knowledge Base），生成 Manifest，然后做双向 sync。适合已经用了 Google 数据目录产品的团队。

v0.2 还加了一套可信度机制 —— 每条知识可以记录谁写的（人还是 Agent）、谁核验过、什么时候过期、来源是啥、来源活不活跃。

\`\`\`yaml
generated: { by: reference_agent/gemini-2.5-pro, at: 2026-06-20T22:53:05Z }
verified: { by: human:ahormati, at: 2026-06-25T09:00:00Z }
stale_after: 2026-09-23
sources:
  - id: rev-policy
    resource: https://wiki.acme/finance/revenue-recognition
    usage_count: 5000
\`\`\`

还有一个 Attested Computation 类型 —— 不只说"收入是多少"，而是把"收入应该怎么算"写成 SQL 定死，Agent 只能填参数不能改逻辑。跑完有 attester 来验。财务合规场景很实用。

实践中怎么用？

在你的项目里建一个 \`kb/\` 目录，开始写 .md 文件。不需要装任何东西，不需要跑任何服务。type 字段随便填，能区分概念就行。配合 Git，团队成员可以 PR 来 PR 去地 review 知识变更。

如果需要从已有数据源批量生成，跑 \`reference_agent enrich\` 连 BigQuery，或者用 toolbox/mdcode 做双向同步。

用了之后最直接的变化：Agent 不再需要人喂上下文了。你告诉它 "去看 kb/tables/orders.md"，它自己就能读。而且每一条知识都有可信度标记 —— Agent 可以判断这条信息是机器生成的还是人审过的、有没有过期。

相比之下，现在常见的做法是在 prompt 里塞一堆上下文，或者让 Agent 自己去爬文档 —— 前者不可持续，后者不可控。`,
}

export default project
