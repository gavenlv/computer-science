# 07 · 内容数据模型

> 目标：让「课程 → 模块 → 课时 → 知识块 → 知识点」可结构化生产、可组路径、可做搜索、
> 可记录掌握度、可迁移旧内容。本文是**概念模型 + 接口草案**，不是最终数据库实现。

---

## 1. 建模原则

1. **内容与学习状态分离**：课程内容可版本化、可复用；学习者的进度/掌握/笔记单独存储。
2. **结构稳定，展示灵活**：课程/模块/课时是稳定骨架；页面布局、推荐、路径是视图。
3. **知识点是原子单位**：课时可以重组，知识点用于先修、复习、能力雷达、搜索。
4. **先修是图，不是树**：一个课程可以有多个先修，一个知识点可以被多门课引用。
5. **一切可引用**：课程、模块、课时、知识点、论文、实验、题目都有稳定 ID。
6. **旧 ID 不删除**：迁移用 `aliases` + 301，避免链接与进度失效。
7. **内容有来源与审校**：每个事实/图/代码都能追溯到来源与审校人。

---

## 2. 实体总览

```
School / Direction
   └── Course
         ├── Module
         │     ├── Lesson
         │     │     ├── Block (prose / visual / interactive / code / quiz / callout)
         │     │     └── KnowledgePoint (many-to-many)
         │     ├── Lab
         │     └── Assessment (quiz / exam)
         ├── Project (P0–P5)
         └── Paper / Resource

Path ── PathStep ── Course
Learner ── Enrollment ── Progress ── Mastery ── ReviewItem
                              └── Note
```

### 2.1 实体职责

| 实体 | 职责 | 关键字段 |
| --- | --- | --- |
| `School` | 学院/方向聚合（核心、AI、网络…） | id, name, description, accent |
| `Course` | 一门完整课程 | id, title, level, modules, prereqs, outcomes, hours |
| `Module` | 课程内的主题单元 | id, title, lessons, lab, assessment, objectives |
| `Lesson` | 一次 25–40 分钟的学习 | id, title, objectives, blocks, kps, duration |
| `Block` | 课时的内容块 | type, content, media, interaction, source |
| `KnowledgePoint` | 原子概念 | id, name, aliases, domain, difficulty |
| `Prerequisite` | 先修边 | from, to, type, rationale, testOut |
| `Lab` | 可运行实验 | id, env, starter, steps, rubric |
| `Assessment` | 测验/考试 | id, items, passScore, attempts |
| `Project` | 项目 | id, level, requirements, rubric, deliverables |
| `Paper` | 论文 | id, title, venue, year, difficulty, tasks |
| `Resource` | 书/文档/视频/源码 | id, type, url, license, verifiedAt |
| `Path` | 预设学习路径 | id, persona, steps, hours |
| `Learner` | 学习者 | id, profile, goals, placement |
| `Progress` | 课时/课程进度 | learnerId, contentId, state, score |
| `Mastery` | 知识点掌握 | learnerId, kpId, score, confidence |
| `ReviewItem` | 间隔复习卡 | learnerId, kpId, dueAt, interval |
| `Note` | 笔记 | learnerId, anchor, markdown |

---

## 3. 内容模型（TypeScript 草案）

```ts
type ID = string

type Level = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5'

interface Course {
  id: ID                    // 'S03'
  slug: string              // 'networking'
  title: string             // '计算机网络'
  subtitle: string          // 一句话定位
  schoolId: ID              // 'core' | 'ai' | 'network' | ...
  level: Level              // 主要阶段
  modules: Module[]
  prerequisites: Prereq[]
  outcomes: string[]        // 学完能做什么（可验收）
  projects: ID[]            // 结课项目
  papers: ID[]              // 推荐论文
  hours: number             // 预计学时
  contentVersion: string    // '1.0.0'
  status: 'draft' | 'review' | 'published' | 'deprecated'
  updatedAt: string
  reviewedBy: string[]
  aliases?: ID[]            // 旧 ID
}

interface Module {
  id: ID                    // 'S03.transport'
  title: string             // '传输层：UDP 与 TCP'
  objectives: string[]      // 3–5 条
  lessons: Lesson[]
  labId?: ID
  assessmentId?: ID
  projectMilestone?: string
}

interface Lesson {
  id: ID                    // 'S03.transport.tcp-handshake'
  title: string             // '用三次握手建立连接'
  objectives: {
    explain: string[]       // 能解释
    derive: string[]        // 能推导
    implement: string[]     // 能实现
  }
  durationMin: number       // 35
  difficulty: 1 | 2 | 3 | 4 | 5
  blocks: Block[]
  knowledgePoints: ID[]     // ['kp.tcp.handshake', ...]
  prereqLessons?: ID[]
  sources: Source[]
  status: 'draft' | 'review' | 'published'
  aliases?: ID[]
}

type Block =
  | { type: 'prose'; markdown: string }
  | { type: 'callout'; variant: 'why' | 'warning' | 'tip' | 'history'; markdown: string }
  | { type: 'visual'; component: string; props: Record<string, unknown>; caption: string; alt: string; readingTask?: string }
  | { type: 'interactive'; component: string; props: Record<string, unknown>; goal: string; reset: boolean }
  | { type: 'code'; language: string; code: string; runnable: boolean; expected?: string }
  | { type: 'quiz'; itemIds: ID[] }
  | { type: 'experiment'; labId: ID; steps: string[] }
  | { type: 'compare'; left: string; right: string; dimensions: string[] }
```

### 3.1 知识块（Block）类型

| type | 用途 | 必填 |
| --- | --- | --- |
| `prose` | 正文段落 | markdown |
| `callout` | 为什么/警告/技巧/历史 | variant, markdown |
| `visual` | 图/动画 | component, caption, alt |
| `interactive` | 交互 | component, goal |
| `code` | 代码 | language, code, runnable |
| `quiz` | 检查点 | itemIds |
| `experiment` | 实验步骤 | labId, steps |
| `compare` | 对比 | left, right, dimensions |

> 正文用 MDX/Markdown 写入 `prose`，复杂交互用 React 组件按 `component` 注册。
> 这样内容作者写 Markdown，可视化工程师写组件，互不阻塞。

---

## 4. 知识点与图

### 4.1 知识点

```ts
interface KnowledgePoint {
  id: ID                    // 'kp.tcp.handshake'
  name: string              // 'TCP 三次握手'
  aliases: string[]         // ['three-way handshake', 'SYN-SYNACK-ACK']
  domain: string            // 'networking'
  summary: string           // 一句话
  difficulty: 1 | 2 | 3 | 4 | 5
  prerequisites: ID[]       // 其他 kp
  related: ID[]             // 相关/对比
  assessments: ID[]         // 可测题目
  resources: ID[]           // 论文/文档/源码
}
```

### 4.2 图的边

| 边 | 从 → 到 | 含义 | 用途 |
| --- | --- | --- | --- |
| `part_of` | Module → Course, Lesson → Module | 结构包含 | 导航 |
| `requires` | Course → Course, KP → KP | 先修 | 路径/解锁 |
| `teaches` | Lesson → KP | 教学 | 掌握度聚合 |
| `assesses` | AssessmentItem → KP | 测评 | 诊断/复习 |
| `applies_in` | KP → Direction/Project | 应用 | 推荐/动机 |
| `contrasts` | KP ↔ KP | 易混 | 对比学习 |
| `derived_from` | KP → Paper/Standard | 来源 | 可信度 |
| `supports` | Resource → Lesson/KP | 延伸 | 阅读 |
| `alias_of` | ID → ID | 迁移 | 重定向 |

### 4.3 先修边

```ts
interface Prereq {
  from: ID                  // 先修课程/知识点
  to: ID                    // 后续课程/知识点
  type: 'hard' | 'soft'     // 硬先修/建议
  rationale: string         // 为什么需要
  testOut?: ID              // 可跳过的测试
}
```

示例：

```json
{
  "from": "S02",
  "to": "S03",
  "type": "hard",
  "rationale": "网络编程需要理解进程、文件描述符、阻塞/非阻塞 IO",
  "testOut": "test.S02.core"
}
```

### 4.4 掌握度传播

```
课时测验/实验 → 课时掌握 → 模块掌握 → 课程掌握 → 方向能力
知识点掌握 → 能力雷达 / 复习队列 / 推荐
```

规则：

- 一个知识点被多节课教过，取最高掌握分，但保留「最近一次」；
- 先修知识点未掌握 → 后续知识点标记「有风险」，推荐补课；
- 课程掌握 ≠ 平均分，核心模块权重更高；
- 项目/Rubric 可以「覆盖」多个知识点，但需要人工/规则映射。

---

## 5. 课时 JSON 示例

```json
{
  "id": "S03.transport.tcp-handshake",
  "title": "用三次握手建立连接",
  "objectives": {
    "explain": ["为什么需要三次握手", "两次握手会带来什么问题"],
    "derive": ["画出双方状态迁移", "推导 seq/ack 的选择"],
    "implement": ["在 Wireshark 中识别握手包", "用 socket 观察握手"]
  },
  "durationMin": 35,
  "difficulty": 3,
  "knowledgePoints": ["kp.tcp.handshake", "kp.tcp.seq-ack", "kp.tcp.state-machine"],
  "blocks": [
    {
      "type": "prose",
      "markdown": "你点开一个网页，0.2 秒内，浏览器和服务器先说了哪三句话？"
    },
    {
      "type": "interactive",
      "component": "PredictChoice",
      "props": {
        "question": "如果只握手两次，可能会发生什么？",
        "options": [
          "服务器会一直等待",
          "可能建立重复连接",
          "无法加密",
          "没有任何影响"
        ]
      },
      "goal": "暴露「两次握手足够」的前概念"
    },
    {
      "type": "visual",
      "component": "TcpHandshakeDiagram",
      "props": { "step": true, "showState": true },
      "caption": "三次握手的报文与状态迁移",
      "alt": "客户端与服务器之间依次发送 SYN、SYN-ACK、ACK，状态从 CLOSED 到 ESTABLISHED",
      "readingTask": "注意看第二个包的 ack 为什么是 seq+1"
    },
    {
      "type": "code",
      "language": "bash",
      "code": "ss -lnt\nsudo tcpdump -i any 'tcp[tcpflags] & tcp-syn != 0'",
      "runnable": false,
      "expected": "看到 SYN/SYN-ACK 包与监听队列"
    },
    {
      "type": "quiz",
      "itemIds": ["q.tcp.handshake.1", "q.tcp.handshake.2", "q.tcp.handshake.3"]
    }
  ],
  "sources": [
    { "type": "rfc", "id": "RFC 9293", "url": "https://www.rfc-editor.org/rfc/rfc9293" },
    { "type": "book", "id": "Kurose & Ross, Computer Networking" }
  ],
  "status": "published"
}
```

---

## 6. 课程/路径 JSON 示例

```json
{
  "id": "S03",
  "slug": "networking",
  "title": "计算机网络",
  "subtitle": "从信号到 HTTP/3，能抓包、能排障、能设计网络",
  "schoolId": "core",
  "level": "L2",
  "hours": 50,
  "prerequisites": [
    { "from": "C02", "to": "S03", "type": "hard", "rationale": "需要系统编程与 socket 基础" },
    { "from": "M03", "to": "S03", "type": "soft", "rationale": "拥塞控制/测量会用到概率" }
  ],
  "outcomes": [
    "能解释从信号到 HTTP 的完整链路",
    "能用 Wireshark 分析握手、重传、拥塞",
    "能实现 TCP 子集与 HTTP 服务器",
    "能设计高并发接入与 CDN 方案"
  ],
  "modules": ["S03.overview", "S03.physical", "S03.link", "S03.ip", "S03.routing", "S03.transport", "S03.congestion", "S03.application", "S03.programming", "S03.architecture"],
  "projects": ["P2.tcp-http-server"],
  "papers": ["paper.end-to-end", "paper.bbr", "paper.quic"],
  "contentVersion": "0.1.0",
  "status": "draft"
}
```

---

## 7. 测评模型

```ts
interface AssessmentItem {
  id: ID
  type: 'mcq' | 'multi' | 'predict' | 'find-bug' | 'order' | 'fill' | 'code' | 'short' | 'design'
  stem: string
  options?: { id: string; text: string; misconception?: string }[]
  answer: unknown
  explanation: string
  knowledgePoints: ID[]
  difficulty: 1 | 2 | 3 | 4 | 5
  source?: string
  reviewedBy?: string[]
}
```

要求：

- 每个错误选项有 `misconception`，用于生成反馈；
- 每题绑定 1–3 个知识点；
- 题目有难度/区分度数据（后期）；
- 代码题有测试用例与容错；
- 设计题有 Rubric，而不是标准答案。

---

## 8. 学习者状态模型

```ts
interface Progress {
  learnerId: ID
  contentId: ID             // lesson/module/course
  state: 'not-started' | 'in-progress' | 'completed' | 'mastered'
  readRatio?: number
  checkpointScore?: number
  labCompleted?: boolean
  quizScore?: number
  lastAt: string
}

interface Mastery {
  learnerId: ID
  kpId: ID
  score: number             // 0–100
  confidence: number        // 0–1
  attempts: number
  lastAt: string
}

interface ReviewItem {
  learnerId: ID
  kpId: ID
  dueAt: string
  intervalDays: 1 | 3 | 7 | 21 | 60
  ease: number
  lapses: number
}
```

### 8.1 状态规则

- `completed`：读完 + 完成实验 + 测验 ≥ 60；
- `mastered`：测验 ≥ 80 + 实验通过 + 项目里程碑（若有）；
- 课程 `mastered`：所有核心模块 mastered + 结课项目 ≥ 3 分；
- 方向 `mastered`：核心课 + Capstone + 论文复现/答辩。

> 不做「滚动到底 = 完成」。完成必须有证据。

---

## 9. 内容存储与版本

### 9.1 存储建议

| 内容 | 格式 | 位置 |
| --- | --- | --- |
| 课程结构 | YAML/JSON/TS | `content/courses/*.yaml` |
| 课时正文 | MDX | `content/lessons/**/*.mdx` |
| 交互组件 | React/TS | `src/components/visualizers/*` |
| 题目 | JSON/YAML | `content/items/*.yaml` |
| 实验 | Markdown + 代码/容器 | `content/labs/*` |
| 项目 | YAML + Markdown | `content/projects/*` |
| 论文 | YAML + Markdown | `content/papers/*` |
| 媒体 | WebP/MP4/SVG | CDN/对象存储 |
| 搜索索引 | JSON | 构建时生成 |

### 9.2 版本与审校

- `contentVersion`：语义化版本，重大改写升 minor/major；
- `status`：draft → review → published → deprecated；
- `reviewedBy`：学科审校 + 代码审校 + 语言审校；
- `updatedAt`：每次发布更新；
- `sources`：事实/图/代码来源；
- `changelog`：每课时可查看「改了什么」。

### 9.3 国际化

- `lang`: `zh-CN` / `en`；
- 课程/课时可有 `translations`；
- 术语表双语；
- 代码/论文标题保留英文。

---

## 10. 旧数据迁移

### 10.1 现有模型

```ts
Domain { id, title, abbr, tagline, description, accent, outcome, modules }
Module { id, title, stage, summary, lessons }
Lesson { id, title, level, minutes, points }
```

问题：

- `Domain` 混合了「学院/课程/方向」三种粒度；
- `stage` 是六阶，但 `level` 又是五档，语义重叠；
- `points` 是纯文本大纲，没有知识点 ID、来源、实验、题目；
- 没有先修、项目、论文、测评、版本。

### 10.2 映射规则

| 旧 | 新 | 说明 |
| --- | --- | --- |
| `Domain` | `School` + `Course` | 一个旧板块拆成多门课 |
| `Module.stage` | `Course.level` / `Module.level` | 六阶映射到 L0–L5 |
| `Lesson.level` | `Lesson.difficulty` | 入门→2，基础→2，进阶→3，高级→4，专家→5 |
| `Lesson.minutes` | `Lesson.durationMin` | 保留 |
| `Lesson.points` | `Lesson.blocks`（draft prose）+ `knowledgePoints` | 先导入为草稿，再改写 |
| `Module.summary` | `Module.objectives` | 改写为可验收目标 |
| `Domain.outcome` | `Course.outcomes` | 拆分到课程 |

### 10.3 板块级映射

| 旧板块 | 新归属 |
| --- | --- |
| `languages` | F00/F01/F02、C01、C02；JS/Java/Go 等改为选修 `X` 课程 |
| `dsa` | C03、C04 |
| `fundamentals` | F00（导论）、S01、S02、S03、S04、S05 |
| `engineering` | E01、E02、E03；前端/全栈改为选修/项目 |
| `ai` | A01–A08 |

### 10.4 迁移步骤

1. **冻结**：导出当前 5 个数据文件，打 tag；
2. **建映射表**：每条旧 module/lesson 标记 `keep / rewrite / discard / split`；
3. **导入草稿**：用脚本生成 `content/legacy/*.yaml`，保留 `legacyId` 与原文；
4. **人工审校**：学科主编逐条决定去向，补先修/知识点/实验；
5. **重定向**：旧 URL → 新 URL 301；旧 ID 写入 `aliases`；
6. **进度迁移**：`cs-learn:progress:v1` → `cs:progress:v2`，找不到的 ID 保留为「已完成（旧）」；
7. **灰度**：新旧页面并行 2 周，收集 404/搜索失败；
8. **下线**：确认无流量后删除旧路由。

### 10.5 复用率预估

| 内容 | 可复用 | 需改写 | 建议废弃 |
| --- | ---: | ---: | ---: |
| 课程标题/模块结构 | 50% | 40% | 10% |
| 课时标题 | 70% | 25% | 5% |
| 知识点短句 | 40% | 40% | 20% |
| 正文 | 0% | 100% | 0% |
| 实验/题目 | 0% | 100% | 0% |

> 现有 471 条大纲是「种子」，不是「成品」。真正的工作量在正文、图、实验、题目、审校。

---

## 11. 搜索与索引

### 11.1 索引字段

- 课程/模块/课时标题、副标题、目标；
- 知识点名称/别名/摘要；
- 术语中英文；
- 论文标题/作者/会议；
- 实验/项目名称；
- 正文（分段，带锚点）。

### 11.2 搜索排序

```
score = 标题匹配 × 3 + 知识点匹配 × 2 + 正文匹配 × 1 + 热度 × 0.5 + 完成率 × 0.5
```

- 支持中文分词、英文/缩写、拼写纠错；
- 结果分组：课程 / 课时 / 知识点 / 术语 / 论文 / 实验；
- 空结果给「你可能想找」与「建议反馈」。

---

## 12. 埋点与实验

### 12.1 关键事件

| 事件 | 字段 | 用途 |
| --- | --- | --- |
| `lesson_view` | lessonId, source | 完课率 |
| `lesson_complete` | lessonId, time | 进度 |
| `checkpoint_answer` | itemId, correct, time | 题目质量 |
| `lab_run` | labId, success, errorType | 实验可用性 |
| `quiz_submit` | assessmentId, score | 掌握 |
| `project_submit` | projectId, rubric | 项目质量 |
| `review_done` | kpId, result | 复习效果 |
| `search` | query, clicked | 搜索质量 |
| `path_start` | pathId | 路径效果 |

### 12.2 实验原则

- 先埋点再改版，避免「拍脑袋」；
- A/B 只测一个变量；
- 关注学习效果（前后测、掌握率），不只点击率；
- 保护隐私，最小采集。

---

## 13. 未来扩展

- **多语言**：英文版/术语双语；
- **团队/班级**：教师布置、进度看板、互评；
- **AI 导师**：基于知识点与错题的苏格拉底式提问，带引用，不直接给答案；
- **能力证明**：项目作品集、学习记录、第三方评审；
- **内容市场**：外部作者投稿 + 审校流程（谨慎）；
- **离线/移动**：PWA、离线课时、音频版。
