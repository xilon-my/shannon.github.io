const project = {
  slug: 'pi',
  date: '2026-07-29',
  name: 'Pi Agent Harness',
  url: 'https://github.com/earendil-works/pi',
  description: '一个极简 AI Agent 工具包。统一的多供应商 LLM 接口，带差分渲染的 TUI，可扩展的 Agent 运行时，和自解释的编码 Agent CLI。',
  tags: ['TypeScript', 'Agent Harness', 'CLI'],
  stars: '79.5k+',
  author: 'earendil-works',
  detail:
`Agent 框架现在多到数不过来，每个都在往里面塞东西——加 MCP、加子 Agent、加权限弹窗、加 Plan Mode。功能越堆越多，留给用户自己发挥的空间就越小。

Pi 反着来的。它核心功能少到不能再少，然后把扩展做到极致。你需要什么自己装，不需要的零开销。

这个理念听起来挺反直觉的，但 Databricks 最近发的一篇 benchmark 报告给了它一个有力的数据支撑。

## Databricks 的实测验证

2026 年 7 月，Databricks 在博客上公开了他们内部的编码 Agent 评测结果。他们用了自己百万行级别的真实代码仓库、真实的 PR、持久的测试用例来做评测——不是用 SWE-Bench 那种公开榜单。

结果有一个发现特别值得注意：**同一个模型，跑在不同的 Agent 框架上，成本和效率差距超过 2 倍，但质量几乎不变**。

![Pi vs Claude Code/Codex 成本对比](/discover/db-dumbbell.png)

图中对比的是 OpenAI 的某个模型分别在 Pi 和 Claude Code/Codex 上跑同一批任务的表现。Pi 每轮发送的上下文少了大约 3 倍，跑的轮数更少，单任务成本只有 Claude Code/Codex 的一半不到，但任务通过率几乎没有差别。

为什么会这样？因为 Pi 保持了一个更紧凑的工作集。它不会把整个项目历史、全部文件内容、无用的 tool 列表都塞进 context——它只带需要的东西。Claude Code 和 Codex 内置了大量你未必用得上的功能，这些功能本身就要消耗 token：Plan Mode 的提示词、权限弹窗的逻辑、MCP 的工具定义、子 Agent 的指令模板。Pi 没有这些，所以 context 更干净、token 消耗更少。

从更宏观的视角看，这是 2026 年编码 Agent 市场的 Pareto 前沿：

![编码 Agent Pareto 前沿](/discover/db-pareto.png)

Opus 4.8 和 GLM 5.2 在能力顶端，但代价不低。GPT 5.4 Mini、Haiku 这些模型占据中间地带，性价比更高。而框架的选择同样在影响成本——同一个模型，换一个框架就能省一半的 token。

## 四个包

Pi 由四个包组成，@earendil-works/pi-ai 管统一 LLM 接口（15+ 供应商），@earendil-works/pi-agent-core 管 Agent 运行时和 tool calling，@earendil-works/pi-coding-agent 是面向用户的 CLI，@earendil-works/pi-tui 是终端 UI 组件库。TypeScript + Bun 写的。

用起来就是设个环境变量，\`/model\` 切模型。我之前设过 \`DEEPSEEK_API_KEY\`，\`/model\` 里直接出现 deepseek-v4-flash，不需要配供应商。

## "What we didn't build"

Pi 的 README 里有一节专门讲他们刻意不做什么，挺能说明这项目的性格。没有 MCP 支持，因为觉得"Build CLI tools with READMEs"就够了。没有子 Agent，留给扩展实现。没有权限弹窗，进程有什么权限 Pi 就有什么权限。没有 Plan Mode，不需要就是不支持。没有内置 Todo，文件就是你的 todo。没有后台 bash，因为已经有 tmux 了。

每个"没有"后面都跟了理由。Claude Code 把这些全部内置了，Pi 说这些东西不一定每个人都想要，所以你想要就自己装。装的方式有三种：Extensions（TypeScript 模块）、Skills（遵循 Agent Skills 标准的 Markdown 包）、Themes（JSON 配色）。

Extensions 自带了几十个例子。\`plan-mode/\` 大概 50 行就能实现只读模式。\`permission-gate.ts\` 30 行搞定危险命令确认。\`todo.ts\` 把状态存在 session 里，利用 Pi 的树形会话结构自然支持分支隔离。还有 \`doom-overlay\`——Agent 思考的时候渲染 Doom。

Skills 的设计也很聪明。启动时 Pi 只扫名字和描述加到 system prompt，完整内容等 Agent 判断任务匹配了再加载。不是一股脑全塞进 context——这本身就是在省 token。

![Pi 对话截图](/discover/pi-agent.png)

## Formal ability 和 Representational ability 的发展

现在大家比 Agent 都是比"能不能写代码"、"能调几个 tool"，但其实有两个更深层的能力在悄悄决定这些框架的上限。

### Formal ability

Formal ability 说的是 Agent 跟外部系统打交道的方式有多"正式"。它的反面是"在 prompt 里写一段自然语言来描述怎么调用"。Formal 意味着用结构化 schema 替代自然语言、用可验证的协议替代约定、用类型约束替代运行时检查。

最早期的 Agent 就是调 API 然后解析字符串，错误处理靠 prompt 里写"如果出错了就重试"。OpenAI 的 function calling 是一个转折点。从那之后分了三步走：function calling / JSON mode → MCP → Agent Skills 标准。

有意思的是三个工具在这个链条上选了不同的位置。Claude Code 推 MCP，Codex 跟着 Workflow.md 走，Pi 则明确拒绝了 MCP——与其搞一个抽象协议层不如让 Agent 直接读工具的 README。但它兼容 Skills 标准，并且 RPC 模式有严格的 JSONL 帧结构。

Databricks 的评测间接证明了这条路行得通——Pi 的 context 管理更紧凑，说明它没有为了 formal 而 formal，而是找到了一个够用的平衡点。

### Representational ability

如果说 formal 解决的是"怎么跟外面说话"，representational 解决的就是"自己怎么想事情"。这是 Agent 内部怎么表示知识和状态——不是 UI 好不好看，是它脑子里有没有一张"地图"。

早期 LLM Agent 本质上没有表征能力。Function calling 让表示从自由文本变成了 schema，但问题是这些表示是"用完即弃"的。后来出现了记忆系统和上下文管理方案，但本质上都是外挂的存储——Agent"知道"文件被修改了是因为 context 里有 git diff，不是因为它有一个内部状态模型。

最新的研究通过探针分析发现，LLM 在做空间导航任务时，中间层会激活与空间位置强相关的神经元，而且这些表征不随 prompt 表述方式的变化而变化。[MIT 的研究](https://www.csail.mit.edu/event/thesis-defense-world-models-user-models-and-self-models-ai-systems)揭示了模型内部确实存在一张"地图"。

同一项研究还有个实用的发现：**外部表示的格式直接影响模型构建内部表征的质量**。用 Cartesian 坐标（x=10, y=20）比用文字描述（"在左上角附近"）做空间任务的成功率高得多——[8B 模型 66% vs 30%](https://ar5iv.labs.arxiv.org/html/2502.16690)。

回到三个工具来看，在 internal representation 层面它们都依赖底层模型的能力。区别在于**外部表征**的设计。Pi 的 Session 不存成线性日志，而是树形结构。\`/tree\` 看到全部分支，\`/resume <id>\` 跳到任意节点继续，\`/fork\` 从当前点分叉。这个设计的底层观点是：Agent 的对话历史不是一条线，而是一棵可以任意导航的树。

## 供应链安全

顺便提一句，Pi 把依赖安全做得挺极端。\`.npmrc\` 设了 \`save-exact=true\` 和 \`min-release-age=2\`，\`package-lock.json\` 是"依赖的事实标准"，pre-commit 拦截意外的 lockfile 变更。CI 用 \`npm ci --ignore-scripts\` 安装，定时跑 \`npm audit\` 加签名验证。`,
  takeaway: 'Databricks 的 benchmark 给 Pi 的"极简哲学"做了一个有力的注脚：同一个模型跑在不同的框架上，成本差距超过 2 倍，质量几乎不变。少即是多不只是理念问题——它在 token 账单上能直接体现出来。Pi 在 formal ability 上拒绝了 MCP 选择了更轻的路，在 representational ability 上用树形 Session 给出了不一样的设计，这些选择在 benchmark 中被证明是有效的。',
}

export default project
