# 计科学习 · 计算机科学学习体系

> 从一个高中生或零基础大学生，到「计算机核心全懂 + 一个方向达到硕士等效/专家工程」。
> 不是科普站，也不是工具教程站，而是一条有先修、有实验、有项目、有论文训练的完整路径。

## 当前状态：框架 v1 + 决策已锁定（内容待生产）

仓库里已经有一个可运行的站点壳和 **5 个板块 / 75 个模块 / 471 条课时大纲**。
这些大纲是「目录种子」，不是完整课程：没有正文、图、交互、实验、题目和项目。

新的课程框架已经完成，核心结论：

| 维度 | 现有 | 新框架目标 |
| --- | ---: | ---: |
| 结构 | 5 个混合板块 | 核心学院 + 10 个专业方向 |
| 课程 | 约 5 门（按板块折算） | 23 门核心 + 63 门方向 = **86 门** |
| 模块 | 75 | 约 **590 个** |
| 课时 | 471 条大纲 | 约 **3,000 个**完整课时 |
| 单条路径 | 无明确路径 | 核心 + 1 方向 + 研究 ≈ **1,500–1,800 小时** |

**完整框架文档入口：[`docs/README.md`](docs/README.md)**

- [00 已锁定决策](docs/framework/00-decisions.md)
- [01 愿景、学习者与能力模型](docs/framework/01-vision-and-model.md)
- [02 全局课程地图](docs/framework/02-curriculum-map.md)
- [03 核心课程大纲](docs/framework/03-core-curriculum.md)
- [04 专业方向大纲](docs/framework/04-specializations.md)
- [05 单课内容标准](docs/framework/05-content-standard.md)
- [06 网站信息架构](docs/framework/06-site-ia.md)
- [07 内容数据模型](docs/framework/07-data-model.md)
- [08 差距分析与建设路线](docs/framework/08-gap-and-roadmap.md)
- [09 核心优先执行计划（团队加速版）](docs/framework/09-core-first-plan.md)
- [10 三个样板课 Storyboard](docs/framework/10-storyboards.md)
- [11 单人执行策略](docs/framework/11-solo-strategy.md)
- [Phase 0 样板课与迁移表](docs/phase-0/README.md)
- [调研笔记](docs/research/00-research-notes.md)

## Phase 0 已产出

| 文件 | 内容 |
| --- | --- |
| [F00 从点击到像素](docs/phase-0/lessons/F00-click-to-pixel.md) | 全景课完整样课：抽象分层、点击链路、故障排查 |
| [F00 从算盘到芯片](docs/phase-0/lessons/F00-history.md) | 历史课完整样课：计算跃迁、存储程序、摩尔定律 |
| [F00 程序是什么](docs/phase-0/lessons/F00-program.md) | 原理课完整样课：源码/字节码/机器码、指令周期 |
| [F01 循环](docs/phase-0/lessons/F01-loops.md) | 零基础概念课完整样课 |
| [F01 函数](docs/phase-0/lessons/F01-functions.md) | 概念课完整样课：print/return、作用域、调用栈 |
| [F01 列表与字典](docs/phase-0/lessons/F01-collections.md) | 数据组织完整样课：list/dict/set、复杂度、别名 |
| [F01 文件与异常](docs/phase-0/lessons/F01-files.md) | 持久化完整样课：with、编码、CSV/JSON、try/except |
| [F01 小项目](docs/phase-0/lessons/F01-project.md) | 项目课完整样课：分层、记账本、五个里程碑 |
| [F01 调试](docs/phase-0/lessons/F01-debug.md) | 调试课完整样课：traceback、断点、最小复现 |
| [S03 TCP 三次握手](docs/phase-0/lessons/S03-tcp-handshake.md) | 网络旗舰完整样课 |
| [S01 缓存](docs/phase-0/lessons/S01-cache.md) | 系统机制课完整样课 |
| [迁移分诊](docs/phase-0/migration-summary.md) | 471 条旧大纲：keep 99 / rewrite 168 / split 86 / project 65 / archive 53 |
| [不迁移清单](docs/phase-0/archive-list.md) | 53 条归档内容 |
| [第一年 backlog](docs/phase-0/year-1-backlog.md) | 130 课时生产队列，下一节 F00 互联网是什么 |
| [设计系统 v0](docs/design/design-system-v0.md) | 颜色/字体/图/交互/无障碍/组件契约 |
| [迁移 CSV](docs/phase-0/migration-map.csv) | 471 行课时级映射 |
| [生成脚本](scripts/build-migration-map.mjs) | 可复现生成迁移表 |

## 已锁定的四个决定

2026-10-25 确认，详见 [00 决策记录](docs/framework/00-decisions.md)。

| 决定 | 结论 |
| --- | --- |
| 方向范围 | **10 个方向全做**，不收敛到 4 个 |
| 建设顺序 | **先完成计算机基础**：Core v1（15 门 / 555 课时）→ Core v2（8 门 / 256 课时）→ 方向 |
| 第一旗舰课 | **计算机网络**（S03 为核心课，N01/N03 为方向深化） |
| 「硕士级」表述 | 统一为 **「能力等效，不授学位」**，用论文/复现/项目/答辩作为证据 |
| 团队规模 | **1 人 + AI 辅助 + 外部学科审校**；单人主排期见 [11](docs/framework/11-solo-strategy.md) |
| 内容模式 | **分层内容**：核心+网络+AI 原创；数据/安全/云精编；图形/嵌入式/架构/HCI/量子导读 |

> 网络是唯一允许在核心阶段提前做的方向，因为 S03 本身就是核心课。
> 其余 9 个方向在 Core v2 完成后按顺序推进。
>
> **单人现实**：2,931 课时全原创需 20–30 年；采用「核心+网络+AI 原创、数据/安全/云精编、其余导读」的分层模式，约 **14–16 年**。详见 [11](docs/framework/11-solo-strategy.md)。

## 新框架一页纸

```
L0 启程 → L1 入门 → L2 核心 → L3 专精 → L4 专家 → L5 研究
              │
              ├── 核心学院（23 门）：数学 · 编程 · 算法 · 组成 · OS · 网络 · 数据库
              │                      分布式 · 编译 · 理论 · 安全 · 软工 · 系统设计
              │
              └── 10 个方向（63 门）：AI · 网络通信 · 大数据 · 网络安全 · 云计算
                                      图形学与游戏 · 嵌入式与 IoT · 软件架构
                                      人机交互 · 量子计算与前沿
```

每一阶都有出口能力、项目证据和测评；每个方向都有 Capstone、论文清单与复现任务。
「硕士等效」用能力证据定义，不授予学位。

## 现有站点（legacy）

当前页面仍是旧结构，用于验证站点壳与交互，不代表新框架的最终信息架构。

### 快速开始

```bash
npm install
npm run dev      # http://127.0.0.1:5174/
npm run build    # 类型检查 + 生产构建
npm run preview
```

### 现有路由

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | 首页 | Hero 概览、阶段模型、五大板块、推荐起步 |
| `/roadmap` | 学习路线 | 六阶阶段目标、周期与任务 |
| `/domain/:domainId` | 板块页 | 板块简介、模块与课时列表 |
| `/domain/:domainId/:moduleId` | 模块页 | 课时列表、模块进度、上下模块 |
| `/domain/:domainId/:moduleId/:lessonId` | 课时页 | 知识大纲、完成标记、上下课时 |

学习进度写入 `localStorage`（key: `cs-learn:progress:v1`），刷新后保留。
顶栏提供全站课时搜索与面包屑导航。

### 现有目录结构

```
src/
├── components/
│   ├── AppShell.tsx        # 侧边导航 + 顶栏（面包屑 / 搜索）
│   └── ProgressBar.tsx     # 进度条
├── data/                   # 旧大纲数据源（待迁移）
│   ├── languages.ts
│   ├── dsa.ts
│   ├── fundamentals.ts
│   ├── engineering.ts
│   ├── ai.ts
│   ├── roadmap.ts
│   └── index.ts
├── pages/                  # 首页 / 学习路线 / 板块 / 模块 / 课时
├── store/ProgressContext.tsx
├── types.ts                # Domain / Module / Lesson
├── App.tsx
├── main.tsx
└── index.css
```

## 下一步

1. **Phase 0 剩余**：3 个组件原型（LoopStepper / CacheSimulator / TcpHandshake）、
   P0 78 条迁移评审、浏览器沙箱/pcap 回放技术验证；样课、迁移表、设计系统已产出。
2. **第 1 年（100–130 课时）**：按 [year-1-backlog](docs/phase-0/year-1-backlog.md) 推进；
   下一节 F00「互联网是什么」；目标 2–3 节/周；F00–F03 + C01 前 20 + S03 前 10。
3. **第 2–5 年（Core v1）**：完成 15 门 / 555 课时；第 4–5 年可支撑第一版完整课程。
4. **第 6–8 年**：Core v2（256）+ 网络方向（240），完成「核心 + 网络」。
5. **第 9–10 年**：AI 方向（290），完成「核心 + 网络 + AI」。
6. **第 11–16 年**：数据/安全/云精编（720）+ 图形/嵌入式/架构/HCI/量子导读（870），完成 10 个方向。
7. **仍需确认**：账号/云同步；内容语言；是否做认证/付费。

详细排期见 [11 单人执行策略](docs/framework/11-solo-strategy.md)；
团队加速版见 [09 核心优先执行计划](docs/framework/09-core-first-plan.md)。

## 技术栈

Vite + React 18 + TypeScript + react-router-dom（HashRouter），原生 CSS 变量设计系统。
