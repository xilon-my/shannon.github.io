const project = {
  slug: 'pi',
  date: '2026-07-28',
  name: 'Pi Agent Harness',
  url: 'https://github.com/earendil-works/pi',
  description: '一个极简 AI Agent 工具包。统一的多供应商 LLM 接口，带差分渲染的 TUI，可扩展的 Agent 运行时，和自解释的编码 Agent CLI。',
  tags: ['TypeScript', 'Agent Harness', 'CLI'],
  stars: '79.5k+',
  author: 'earendil-works',
  images: ['/discover/pi-agent.png'],
  detail:
`Agent 框架现在多到数不过来，每个都在往里面塞东西——加 MCP、加子 Agent、加权限弹窗、加 Plan Mode。功能越堆越多，留给用户自己发挥的空间就越小。

Pi 反着来的。它核心功能少到不能再少，然后把扩展做到极致。你需要什么自己装，不需要的零开销。

整个项目四个包，@earendil-works/pi-ai 管统一 LLM 接口（OpenAI、Anthropic、DeepSeek、Google、Groq，加起来 15+ 供应商），@earendil-works/pi-agent-core 管 Agent 运行时和 tool calling，@earendil-works/pi-coding-agent 是那个面向用户的 CLI，@earendil-works/pi-tui 是终端 UI 组件库。TypeScript + Bun 写的。

用起来最简单的方式就是设个环境变量，\`/model\` 切到想用的模型就行。我之前设过 \`DEEPSEEK_API_KEY\`，Pi 自动检测到了，\`/model\` 里直接出现 deepseek-v4-flash，不需要配供应商。

## "What we didn't build"

Pi 的 README 里有一节专门讲他们刻意不做什么，挺能说明这项目的性格。我总结一下就是：

没有 MCP 支持，因为觉得"Build CLI tools with READMEs"就够了。没有子 Agent，留给扩展实现。没有权限弹窗，进程有什么权限 Pi 就有什么权限。没有 Plan Mode，不需要就是不支持。没有内置 Todo，文件就是你的 todo。没有后台 bash，因为已经有 tmux 了。

每个"没有"后面都跟了理由。不是做不了，是不想替你做这个决定。

这和 Claude Code 或者 Codex 是完全不同的思路。Claude Code 内置了 Plan Mode、权限弹窗、子 Agent，你觉得好用就直接用。Pi 说这些东西不一定每个人都想要，所以你想要的自己装。装的方式有三种：Extensions（TypeScript 模块）、Skills（遵循 Agent Skills 标准的 Markdown 包）、Themes（JSON 配色调，改了即时生效）。

Extensions 自带了几十个例子。\`plan-mode/\` 大概 50 行，在 \`before_tool_call\` 事件里拦写入操作就是只读模式。\`permission-gate.ts\` 用正则匹配 \`rm -rf\` 和 \`sudo\`，匹配到了弹确认框，30 行。\`todo.ts\` 把状态存在 session 条目里而不是文件里——巧的是 Pi 的 session 是树形结构的，分支时每个分支自动有正确的 todo 状态。还有一个 \`doom-overlay\`，Agent 思考的时候在 TUI 里渲染 Doom，纯属整活但说明扩展什么都能做。

Skills 的设计也挺聪明。每个 skill 是一个目录，里面有 \`SKILL.md\` 和脚本。启动时 Pi 只扫名字和描述加到 system prompt 里，完整内容等 Agent 判断任务匹配了再按需加载，不是一股脑全塞进 context。

![Pi 对话截图](/discover/pi-agent.png)

## Formal ability 和 Representational ability 的发展

现在大家比 Agent 都是比"能不能写代码"、"能调几个 tool"，但其实有两个更深层的能力在悄悄决定这些框架的上限。

**Formal ability**

最早期的 Agent 就是调 API 然后解析字符串，错误处理靠 prompt 里写"如果出错了就重试"。OpenAI 的 function calling 是一个转折点——模型的输出终于有 schema 约束了。

从那之后这个能力分了三步走。第一步是 function calling / JSON mode，现在 Claude Code 和 Codex 都在用。第二步是 MCP，把 tool 的定义和调用标准化——Claude Code 是主要推手。第三步是 Agent Skills 标准，比 MCP 更高一层，定义的是"一个能力包"的完整格式，包括 SKILL.md 的 frontmatter、前置条件、效果描述。

有意思的是三个工具在这个链条上选了不同的位置。Claude Code 推 MCP，Codex 跟着 Workflow.md 走，Pi 则明确拒绝了 MCP——它的理由是"Build CLI tools with READMEs"，与其搞一个抽象协议层不如让 Agent 直接读工具的 README。但它兼容 Skills 标准，并且 RPC 模式用严格的 JSONL 帧结构，请求-响应、错误码、流控都有定义。

下一站在学术界已经能看到苗头了——形式化验证。[有人在做的研究](https://arxiv.org/abs/2605.23951)让 Agent 的接口协议可静态检查、可证明正确，Agent 调一个 tool 之前不是"试试看"，而是先验证调用是否在允许集内。还很早期，但方向是清楚的。

**Representational ability**

这个能力说的是 Agent 内部怎么表示知识和状态——不是 UI 好不好看，是它脑子里有没有一张"地图"。

最早期的 LLM Agent 本质上没有表征能力，给它一段文本它生成下一段文本，不"理解"自己在做什么。Function calling 和结构化输出让表示从自由文本变成了 schema，这是一次跃迁。但问题是这些表示是"用完即弃"的——每次对话都是新的，Agent 不维护对世界状态的持续表示。

后来出现了各种记忆系统和上下文管理方案。Claude Code 用 session 记录历史，Codex 跟 Symphony 配合时有 workspace 和状态机。但这些本质上都是外挂的存储——Agent"知道"文件被修改了是因为 context 里有 git diff，不是因为它有一个内部状态模型。

最新的研究开始揭示一些更深层的东西。[Belinda Li（MIT）的论文](https://www.csail.mit.edu/event/thesis-defense-world-models-user-models-and-self-models-ai-systems)通过探针分析发现，LLM 在做空间导航任务时，中间层会激活与空间位置强相关的神经元，而且这些表征不随 prompt 表述方式的变化而变化。换句话说，模型内部确实有一张"地图"，不是单纯在匹配模式。

同一项研究还有个实用的发现：**外部表示的格式直接影响模型构建内部表征的质量**。用 Cartesian 坐标（x=10, y=20）比用文字描述（"在左上角附近"）做空间任务的成功率高得多——[8B 模型 66% vs 30%，90B 模型用坐标达到了 98%](https://ar5iv.labs.arxiv.org/html/2502.16690)。

但问题在于当前这些内部表征是静态的。[Kim 和 Hwang（2025）](https://arxiv.org/abs/2507.22281)指出 LLM 训练完世界模型就固定了，没法在交互中动态更新，导致规划逐渐偏离真实状态。

回到三个工具来看，在 internal representation 层面它们都依赖底层模型的能力，大家站在同一条起跑线上。区别在于**外部表征**的设计——你用线性日志、状态机、还是树形结构来组织 Agent 的上下文和工作流。

Pi 在这一点上做得最不一样。它的 Session 不存成线性日志，而是树形结构。\`/tree\` 看到全部分支，\`/resume <id>\` 跳到任意节点继续，\`/fork\` 从当前点分叉，每个分支上下文独立。这个设计的底层观点是：Agent 的"对话历史"不应该是一条线，而是一棵可以任意导航的树。

下一步大概两个方向：一是让 Agent 的内部表征可以动态更新，而不是训练完就冻住；二是用更好的外部表示格式——结构化 schema、可视化状态图——来辅助模型构建更精确的内部表征。现在 Agent 的输出还停留在 Markdown + 代码块，离真正的表示能力还有距离。

## 供应链安全

Pi 把依赖安全做得挺极端。\`.npmrc\` 设了 \`save-exact=true\` 和 \`min-release-age=2\`，\`package-lock.json\` 是"依赖的事实标准"，pre-commit 会拦截意外的 lockfile 变更。CI 用 \`npm ci --ignore-scripts\` 安装，定时跑 \`npm audit\` 加签名验证。发布的 CLI 自带了 \`npm-shrinkwrap.json\` 锁定传递依赖。

## 适合什么

适合愿意花时间定制工具的人。不适合开箱即用派。

Claude Code 是精装修的套房，Pi 是毛坯房加一仓库装修工具。选哪个取决于你想直接住还是想自己装。`,
  takeaway: 'Pi 跟市面上的 Agent 框架都不一样——它在砍功能然后用扩展系统补回来。Claude Code 的 Plan Mode 是内置的，Pi 觉得你不一定需要，想要的话 50 行装一个。这种"用户说了算"的理念在 Agent 工具链里确实少见。Formal ability 和 representational ability 这两个维度在决定 Agent 的上限，Pi 在 formal 上选了跟 MCP 不同的路，在 representational 上它的 Session 树是目前最不一样的设计。',
}

export default project
