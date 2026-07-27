const project = {
  slug: 'okf',
  name: 'Open Knowledge Format (OKF)',
  url: 'https://github.com/GoogleCloudPlatform/knowledge-catalog',
  description: '一个供应商中立的开放知识格式，用 Markdown 文件加 YAML 前置元数据来表示知识。设计为人可读、AI 代理也可消费。',
  tags: ['Specification', 'Knowledge', 'Markdown'],
  stars: '7.8k+',
  author: 'Google Cloud',
  images: [],
  detail: `## 目的：解决什么问题

AI Agent 越来越多，但知识被锁在各自专有系统里：

- **数据血缘**在 Dataplex 里，**指标定义**在 Wiki 里，**SQL 逻辑**在代码库里 —— 每个系统有自己的 API、鉴权、查询方式，Agent 互相读不懂
- Agent 发现了某个数据质量问题，或者理解了一个复杂查询的含义，**无法写回知识库**，下次另一个 Agent 得重新摸索
- 知识变更没有版本管理 —— 字段含义改了、指标口径换了，**没有 git diff / blame / PR review**
- **人和 Agent 用不同的语言理解同一个东西** —— 数据表的描述写在文档里，LLM 要么靠 RAG 猜，要么等人专门喂

OKF 的方案极其简单：**把知识写成 Markdown 文件 + YAML 头，放在目录里，用 Git 管理。** 不发明新东西，把软件工程的最佳实践直接用过来。

## 重点：设计亮点

**1. 极简规范**

整个格式只规定一件事：每个 \`.md\` 文件必须有一个 YAML frontmatter，里面至少有一个 \`type\` 字段。其他全部可选 —— title、description、tags、resource，都是建议。

没有 schema registry，没有中央权威，不需要 SDK。

**2. Provenance（来源）与 Trust（可信度）**

这是 v0.2 的核心升级，专门为 Agent 维护的知识库设计：

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

每条知识的来源、生成者、核验者、过期时间都记录在 frontmatter 里。Consumer 可以据此判断：
- 谁写的？Agent 还是人？
- 谁核验的？机器确认还是人工审核？
- 多久过期？今天还适用吗？
- 引用来源是否活跃？被用了多少次？

**3. Attested Computation（可验证的计算）**

不只说"收入是多少"，而是规定"收入**应该怎么算**"：

\`\`\`yaml
type: Attested Computation
runtime: bigquery
parameters:
  - { name: year, type: integer, required: true }
executor:
  resource: references/skills/run-on-bq.md
  receipt: [job_id, executed_sql, result]
attester:
  resource: references/attesters/sql-equality.py
\`\`\`

Agent 只能填参数，不能改 SQL。跑完后 attester 会验证 Agent 执行的确实是这段 SQL、参数正确、结果一致。这对财务、合规等场景至关重要。

**4. 渐进式披露**

通过 \`index.md\` 实现目录清单，Agent 或人可以先看有什么，再决定打开哪个文件。不需要一次性加载整个知识包。

**5. 链接即关系**

概念之间用标准 Markdown 链接互相引用，构成一个有向图。仓库附带的可视化工具会把链接渲染为力导向图：

\`\`\`markdown
See the [customers table](/tables/customers.md) for the join key.
\`\`\`

## 实例：长什么样

这是仓库里 \`bundles/acme_retail/\` 的目录结构，一个零售行业的知识包：

\`\`\`
bundles/acme_retail/
├── index.md                          # 目录清单
├── log.md                            # 变更日志
├── tables/
│   ├── index.md
│   └── orders.md                     # 类型: BigQuery Table
├── metrics/
│   ├── index.md
│   ├── revenue.md                    # 类型: Metric
│   ├── gross-margin.md               # 类型: Metric
│   └── gross-margin-legacy.md        # 已废弃的旧指标
├── computations/
│   ├── index.md
│   ├── gross-margin-period.md        # 类型: Attested Computation
│   └── revenue-ytd.md
├── policies/
│   ├── index.md
│   ├── margin-standard.md
│   └── revenue-recognition.md
├── attesters/
│   ├── index.md
│   └── sql_equality.py               # 验证脚本
└── viz.html                          # 可视化页面
\`\`\`

每个 \`orders.md\` 大概长这样：

\`\`\`markdown
---
type: BigQuery Table
title: Customer Orders
description: 一行一个已完成的客户订单，全渠道。
tags: [sales, orders]
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

就是这么简单 —— 一个 Markdown 文件，人能读，Agent 也能读。所有东西放 Git 里，改就是 PR，历史就是 git log。`,
}

export default project
