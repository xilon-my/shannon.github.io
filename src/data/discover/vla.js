const project = {
  slug: 'vla',
  date: '2026-08-03 23:15',
  name: 'VLA: Vision-Language-Action, When Robots Follow Instructions',
  url: 'https://arxiv.org/abs/2410.24164',
  url2: 'https://arxiv.org/abs/2506.01844',
  description: '具身智能的第三代范式:VLA 一个模型同时吃"画面 + 指令 + 状态",直接输出动作——从"学会一个任务"变成"听懂指令"。用 4.5 亿参数的 smolvla 在 LIBERO 仿真里实测,它真的把碗放到了盘子上。',
  tags: ['RL'],
  author: 'Shannon',
  takeaway: 'VLA 是具身智能的第三代范式:一个模型同时吃"画面 + 指令 + 状态",直接输出动作,把机器人从"学会一个任务"变成"听懂指令"。π0(2024)定下"VLM 骨干 + flow-matching 动作专家"的架构,smolvla(2025)把它压到 4.5 亿参数,证明小模型 + 社区数据就能追平十亿级模型。实测 smolvla_libero 在 LIBERO 仿真里听懂一句英文指令、真的把碗放到盘子上(check_success=True)。仿真是学习 VLA 最好的起点——不碰硬件,也能亲眼看到机器人"听话干活"。',
  detail:
`上一篇文章(《Embodied AI from Scratch》)讲了具身智能的两次范式切换:从 RL 奖励试错,到模仿学习 + Diffusion Policy。这篇文章讲正在发生的第三次:VLA(Vision-Language-Action)——机器人第一次真正"听懂人话"。

VLA 不再绑定单一任务。给它看相机画面、听一句自然语言指令,它直接输出机械臂动作。特斯拉 Optimus、Physical Intelligence 的 π0、HuggingFace 的 smolvla——2025 年之后,这才是具身智能的主流。

## 第三代:从"学任务"到"听懂指令"

| 维度 | RL | 模仿学习 (Diffusion Policy) | VLA |
|---|---|---|---|
| 学什么 | 奖励试错 | 专家演示 | 演示 + 语言指令 |
| 输入 | 状态 | 画面 | 画面 + 指令 + 状态 |
| 动作生成 | 网络直接输出 | 噪声去噪 | 噪声去噪 (flow matching) |
| 绑定任务 | 是 | 是 | 否——换指令即可 |
| 主要代价 | 奖励设计难 | 数据质量 | 数据质量 + 多模态对齐 |

一句话:前两代学会的是"一个任务",VLA 学会的是"听话"。同一个模型,换一句指令就换一个任务——这是质的变化,不是量的提升。

## π0:VLA 的架构蓝图

2024 年 10 月,Physical Intelligence 发布 π0 论文("π₀: A Vision-Language-Action Flow Model for General Robot Control",arXiv:2410.24164),把 VLA 的架构定了下来。它由两半拼成:

\`\`\`
相机画面 ──┐
文字指令 ──┤→ VLM 骨干 (PaliGemma, 30亿) ──→ 局势理解 token ──→ 动作专家 (3亿)
状态 ──────┘                                 (flow-matching transformer)
                                                   │
                                                   └──→ 未来50步动作块 (50×7)
\`\`\`

- **VLM 骨干 = 参谋部**。用开源的 PaliGemma(3B)做"眼睛和耳朵":图像进视觉编码器、指令进语言模型,融合成对当前局势的完整理解。好处是继承了互联网级语义——它"知道"盘子、碗、还有"放上去"是什么意思。
- **动作专家 = 执行部**。一个更小的 transformer(约 3 亿参数),读参谋部的分析,生成机械臂动作。整个模型 33 亿参数。

动作是**连续值**,用 flow matching 生成(不是像 OpenVLA 那样把动作离散成 token 逐个自回归)。一次生成未来 50 步的动作块,推理时做 10 步去噪。

训练是纯行为克隆:10,000+ 小时真机数据 + 条件 flow matching loss。零样本、微调新技能都超过 OpenVLA、Octo、ACT、Diffusion Policy——从此 VLA 成了机器人学习的新基线。

## smolvla:把 π0 压到 4.5 亿参数

π0 的 33 亿参数不是谁都跑得起。2025 年 6 月,HuggingFace LeRobot 团队发布 smolvla("SmolVLA: A Vision-Language-Action Model for Affordable and Efficient Robotics",arXiv:2506.01844),把 π0 的思路压到 **4.5 亿参数**(VLM 骨干换 SmolVLM2,动作专家约 1 亿)。三个省算力的设计:

- **视觉 token 缩减**:每帧只留 64 个视觉 token(PixelShuffle 把 1024 个压下来)。
- **层跳跃**:动作专家只读 VLM 一半层的特征。
- **交替注意力**:交叉注意力(动作"看"局势)与自注意力(动作之间时间平滑)交错,比全注意力轻量。

数据也很"穷":不到 3 万个社区演示 episode,比其他 VLA 少一个数量级。但效果不差——LIBERO 平均成功率 87.3,超过 33 亿参数的 π0(86.0)和 70 亿的 OpenVLA(76.5);真机 SO-100 上 78.3%,吊打 ACT 的 48.3%。

## 动作到底怎么生成:flow matching

这是 VLA 和 Diffusion Policy 共享的底层机制。你已经知道 DDPM:给干净动作加噪声,训练网络反着去噪,推理时从纯噪声走几十上百步洗出动作。

flow matching 换了个更省的写法:

- **连续路径**:把"噪声→数据"看作一条连续插值路径 \`x_t = (1−t)·噪声 + t·数据\`,t 从 0 到 1。
- **学速度**:训练网络预测"当前位置该往哪个方向走"(指向数据的速度向量),而不是像 DDPM 那样预测噪声。
- **推理就是跟着箭头走**:从纯噪声出发,做 10 步欧拉积分 \`x_{t+Δt} = x_t + v·Δt\`,就到了干净动作。

10 步 flow matching ≈ 200 步 DDPM 的质量——这是它被选中的原因:同样要"看画面理解、再生成动作",快 20 倍。

\`\`\`python
# 训练:给专家动作块加噪声,教网络还原"该往哪走"的方向
loss = mse(v_predicted, clean_action - noise)

# 推理:从噪声出发,走 10 步欧拉积分
x = randn_like(action_chunk)
for _ in range(10):
    x = x + v_theta(x, t) * dt   # v_theta 就是"箭头",由 VLM 上下文条件化
\`\`\`

## 实测:smolvla 把碗放到了盘子上

跑这个模型用的是 **LIBERO** 基准:robosuite/MuJoCo 仿真的桌面操作,40 个任务(4 套件 × 10),全部语言指令控制。给 smolvla_libero(450M,在 LIBERO 上微调过的 checkpoint)喂一句指令:

\`\`\`
pick up the black bowl between the plate and the ramekin and place it on the plate
\`\`\`

(把盘子和小碗之间的黑色碗,拿起来放到盘子上。)

它自主执行了 78 步:伸手 → 下降 → 闭合夹爪 → 举高 → 移到盘子上方 → 放下,\`check_success=True\`。碗的 3D 位置全程追踪,能看见它真的离开桌面、被举起来、落到盘子上:

| step | 碗的位置 xyz | 状态 |
|---|---|---|
| 0 | [-0.063, 0.202, 0.898] | 桌面上,盘子旁 |
| 50 | [-0.044, 0.207, 0.907] | 被抓离桌面 |
| 60 | [0.011, 0.201, 0.975] | 举高并移向盘子 |
| 70 | [0.101, 0.192, 0.975] | 盘子上方 |
| 77 | [0.09, 0.204, 0.914] | 放到盘子上 |

![smolvla 实测:把碗放到盘子上](/discover/vla-rollout.gif)

这就是"看图 + 听懂 + 动手"三条腿走通的样子:参谋部看懂"碗在盘子旁边、指令要放上去",执行部生成动作,仿真闭环执行。

## 跑通它踩的两个坑

仿真里跑 VLA 有两个坑,几乎每个模型都会遇到:

1. **观测格式必须和训练一致**。喂进去的画面/状态和训练对不上,模型就"看走眼"——动作数值不小,但机械臂只在原地轻微漂移。我们的教训:state 必须是 \`[eef_pos, axis_angle, gripper_qpos]\` 8 维,图像要归一化、翻转,不能多塞训练时没有的相机。
2. **环境成功会自动 reset**。LIBERO 回合成功时会把物体放回原位、重置仿真,于是"回合结束后再查碗在哪"永远是初始位置,看起来像没成功。要驱动底层 env 才能拿到真实最终状态——上面那张轨迹表就是这么来的。

## 结论

三代方法的反馈来源一路在变:RL 用环境奖励、模仿学习用专家演示、VLA 用"演示 + 语言指令"。VLA 的价值不在"更聪明的策略",而是**把机器人从'学会一个任务'变成'听懂指令'**——同一套权重,换一句话就换一个任务。

π0 定了架构,smolvla 证明 4.5 亿参数 + 社区数据就能追平十亿级模型,而且纯仿真就能跑通全部流程。对学习者来说,这就是最好的起点:不碰硬件,也能亲眼看到机器人"听话干活"。`,
}

export default project
