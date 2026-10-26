// 生成旧大纲 → 新课程体系的迁移映射表。
// 运行：node scripts/build-migration-map.mjs
// 输出：docs/phase-0/migration-map.csv、module-map.csv、migration-summary.json
//
// 说明：这是「迁移分诊表」，不是最终课程设计。
// - keep：主题对齐，可作为新课时种子，补正文/图/实验/题；
// - rewrite：主题属于新体系，但层级/表述/深度需要重写；
// - split：一个旧模块对应多门新课程，需要拆分；
// - archive：选修/竞赛/过细工具内容，暂不进入核心 86 门；
// - project：进入 P0–P5 项目线。

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DATA_DIR = path.join(ROOT, 'src', 'data')
const OUT_DIR = path.join(ROOT, 'docs', 'phase-0')

const DOMAINS = [
  { file: 'languages', id: 'languages', title: '编程语言基础' },
  { file: 'dsa', id: 'dsa', title: '数据结构与算法' },
  { file: 'fundamentals', id: 'fundamentals', title: '计算机基础四大件' },
  { file: 'engineering', id: 'engineering', title: '方向进阶与项目实战' },
  { file: 'ai', id: 'ai', title: 'AI 与新兴技术' },
]

// 模块级分诊：75 个旧模块 → 新课程 / 处置 / 优先级
const MODULE_MAP = {
  // ── languages ─────────────────────────────────────────────
  'lang-computing': {
    course: 'F00+F01',
    hint: 'F00 计算机系统全景；F01 程序如何运行',
    disposition: 'split',
    priority: 'P0',
    reason: '旧模块同时讲系统全景与 Python 入门，拆成 F00 与 F01',
  },
  'lang-tools': {
    course: 'F02',
    hint: '开发者工具链',
    disposition: 'keep',
    priority: 'P0',
    reason: '命令行/Git/调试器与 F02 对齐',
  },
  'lang-python-syntax': {
    course: 'F01',
    hint: 'Python 第一行代码',
    disposition: 'keep',
    priority: 'P0',
    reason: '语法/数据结构可直接作为 F01 种子',
  },
  'lang-python-oop': {
    course: 'C01',
    hint: '程序设计进阶：OOP 与异常',
    disposition: 'rewrite',
    priority: 'P1',
    reason: 'OOP/异常属于 C01，需补工程化与测试',
  },
  'lang-python-engineering': {
    course: 'C01+E01',
    hint: 'C01 工程实践；E01 测试/协作',
    disposition: 'split',
    priority: 'P1',
    reason: '标准库/工程实践拆到 C01 与 E01',
  },
  'lang-js-ts': {
    course: 'X01',
    hint: 'Web 前端（选修，待建）',
    disposition: 'archive',
    priority: 'P3',
    reason: '核心体系不再并行教 JS/TS，转为 Web 前端选修',
  },
  'lang-java': {
    course: 'X02',
    hint: 'Java/JVM（选修，待建）',
    disposition: 'archive',
    priority: 'P3',
    reason: '核心不要求 Java，转为选修',
  },
  'lang-cpp': {
    course: 'C02+X03',
    hint: 'C02 C 与系统编程；X03 C++（选修）',
    disposition: 'split',
    priority: 'P1',
    reason: 'C 系统编程进入核心；C++/STL/RAII 转为选修',
  },
  'lang-memory-concurrency': {
    course: 'C02+S05',
    hint: 'C02 内存模型；S05 并发/一致性',
    disposition: 'split',
    priority: 'P2',
    reason: '内存模型与并发拆到 C02 与 S05',
  },
  'lang-runtime-performance': {
    course: 'S06',
    hint: '编译原理：类型/运行时/优化',
    disposition: 'rewrite',
    priority: 'P2',
    reason: '运行时/类型/性能属于 S06，需重写',
  },
  'lang-project-app': {
    course: 'P1',
    hint: 'P1 入门作品：CLI/Web 服务',
    disposition: 'project',
    priority: 'P1',
    reason: '项目线 P1，不占用核心课时',
  },
  'lang-project-interpreter': {
    course: 'P2',
    hint: 'P2 核心 Lab：解释器/编译器',
    disposition: 'project',
    priority: 'P2',
    reason: '解释器项目升级为 P2 核心 Lab',
  },
  'lang-expert-design': {
    course: 'S06',
    hint: '编译原理：语言设计',
    disposition: 'rewrite',
    priority: 'P3',
    reason: '语言设计并入 S06 高级模块',
  },
  'lang-expert-runtime': {
    course: 'S06+X04',
    hint: 'S06 运行时；X04 JIT/GC（选修）',
    disposition: 'archive',
    priority: 'P3',
    reason: 'JIT/GC 源码级内容转为方向选修，不进入核心',
  },

  // ── dsa ───────────────────────────────────────────────────
  'dsa-p0-base': {
    course: 'C03',
    hint: '复杂度与递归',
    disposition: 'keep',
    priority: 'P0',
    reason: '算法思维/复杂度与 C03 对齐',
  },
  'dsa-p0-complexity': {
    course: 'C03',
    hint: '复杂度与递归',
    disposition: 'keep',
    priority: 'P0',
    reason: '复杂度/递归可直接作为 C03 种子',
  },
  'dsa-array': {
    course: 'C03',
    hint: '数组、字符串与双指针',
    disposition: 'keep',
    priority: 'P0',
    reason: '线性结构主题对齐',
  },
  'dsa-list': {
    course: 'C03',
    hint: '链表、栈与队列',
    disposition: 'keep',
    priority: 'P0',
    reason: '线性结构主题对齐',
  },
  'dsa-hash-heap': {
    course: 'C03',
    hint: '哈希表与堆',
    disposition: 'keep',
    priority: 'P0',
    reason: '哈希/堆主题对齐',
  },
  'dsa-tree': {
    course: 'C03',
    hint: '树与 BST',
    disposition: 'keep',
    priority: 'P0',
    reason: '树结构主题对齐',
  },
  'dsa-union-trie': {
    course: 'C04',
    hint: '并查集与 Trie',
    disposition: 'rewrite',
    priority: 'P2',
    reason: '高级结构属于 C04',
  },
  'dsa-graph': {
    course: 'C04',
    hint: '图论与最短路',
    disposition: 'rewrite',
    priority: 'P2',
    reason: '图论属于 C04',
  },
  'dsa-dp': {
    course: 'C04',
    hint: '动态规划',
    disposition: 'rewrite',
    priority: 'P2',
    reason: 'DP 属于 C04',
  },
  'dsa-greedy-string': {
    course: 'C04',
    hint: '贪心与字符串算法',
    disposition: 'rewrite',
    priority: 'P2',
    reason: '贪心/字符串属于 C04',
  },
  'dsa-advanced-ds': {
    course: 'C04',
    hint: '高级数据结构与摊还分析',
    disposition: 'rewrite',
    priority: 'P2',
    reason: '高级结构属于 C04',
  },
  'dsa-viz': {
    course: 'P2',
    hint: 'P2 项目：算法可视化',
    disposition: 'project',
    priority: 'P2',
    reason: '项目线 P2',
  },
  'dsa-oj': {
    course: 'P2',
    hint: 'P2 项目：在线判题',
    disposition: 'project',
    priority: 'P2',
    reason: '项目线 P2',
  },
  'dsa-advanced-algo': {
    course: 'X05',
    hint: '竞赛算法（选修，待建）',
    disposition: 'archive',
    priority: 'P3',
    reason: '竞赛专题不作为核心必修，转为选修',
  },
  'dsa-algo-engineering': {
    course: 'C04',
    hint: '算法工程化与研究',
    disposition: 'keep',
    priority: 'P3',
    reason: '可作为 C04 的延伸阅读',
  },

  // ── fundamentals ─────────────────────────────────────────
  'fund-intro': {
    course: 'F00+S01',
    hint: 'F00 系统全景；S01 组成',
    disposition: 'split',
    priority: 'P0',
    reason: '全景进入 F00，硬件部分进入 S01',
  },
  'fund-binary': {
    course: 'S01+C02',
    hint: 'S01 数据表示；C02 内存布局',
    disposition: 'split',
    priority: 'P1',
    reason: '二进制/浮点进入 S01；内存/指针进入 C02',
  },
  'fund-co': {
    course: 'S01',
    hint: '数字逻辑与 CPU',
    disposition: 'keep',
    priority: 'P1',
    reason: '组成原理主题对齐',
  },
  'fund-os': {
    course: 'S02',
    hint: '操作系统基础',
    disposition: 'keep',
    priority: 'P1',
    reason: 'OS 主题对齐',
  },
  'fund-net': {
    course: 'S03',
    hint: '网络分层与 IP',
    disposition: 'keep',
    priority: 'P0',
    reason: '网络基础进入 S03，作为旗舰前段种子',
  },
  'fund-co2': {
    course: 'S01',
    hint: '流水线/缓存/性能',
    disposition: 'rewrite',
    priority: 'P1',
    reason: '性能部分需要重写为可测量实验',
  },
  'fund-os2': {
    course: 'S02',
    hint: '虚拟内存/文件系统/并发',
    disposition: 'rewrite',
    priority: 'P1',
    reason: '需要补实验与内核视角',
  },
  'fund-net2': {
    course: 'S03',
    hint: 'TCP/IP 与 HTTP/TLS',
    disposition: 'rewrite',
    priority: 'P0',
    reason: '网络旗舰核心，需要重写为抓包/实现课',
  },
  'fund-db': {
    course: 'S04',
    hint: '关系模型/SQL/索引/事务',
    disposition: 'keep',
    priority: 'P1',
    reason: '数据库主题对齐',
  },
  'fund-os3': {
    course: 'S02',
    hint: '调度/内存/并发高级',
    disposition: 'rewrite',
    priority: 'P2',
    reason: '高级 OS 内容需要论文/源码级重写',
  },
  'fund-dist': {
    course: 'S05',
    hint: '分布式与一致性',
    disposition: 'rewrite',
    priority: 'P2',
    reason: '分布式需要 Raft/论文/实验重写',
  },
  'fund-db2': {
    course: 'S04',
    hint: '存储引擎与查询优化',
    disposition: 'rewrite',
    priority: 'P2',
    reason: '存储引擎/优化器需要实现型重写',
  },
  'fund-proj-sys': {
    course: 'P2',
    hint: 'P2 项目：mini OS / TCP 栈',
    disposition: 'project',
    priority: 'P2',
    reason: '项目线 P2',
  },
  'fund-proj-db': {
    course: 'P2',
    hint: 'P2 项目：存储引擎',
    disposition: 'project',
    priority: 'P2',
    reason: '项目线 P2',
  },
  'fund-exp-kernel': {
    course: 'S02',
    hint: '内核/虚拟化高级',
    disposition: 'rewrite',
    priority: 'P3',
    reason: '专家级内容转为 S02 高级模块/论文',
  },
  'fund-exp-scale': {
    course: 'S05',
    hint: '大规模分布式/性能',
    disposition: 'rewrite',
    priority: 'P3',
    reason: '专家级内容转为 S05 高级模块/论文',
  },

  // ── engineering ──────────────────────────────────────────
  'eng-web': {
    course: 'F02+E01',
    hint: 'F02 工具链；E01 Web 工作原理',
    disposition: 'split',
    priority: 'P0',
    reason: 'Web 工作原理进入 F02/E01',
  },
  'eng-web-lang': {
    course: 'X01',
    hint: 'Web 前端（选修，待建）',
    disposition: 'archive',
    priority: 'P3',
    reason: 'HTML/CSS/JS 转为 Web 前端选修',
  },
  'eng-fe-base': {
    course: 'X01',
    hint: 'Web 前端（选修，待建）',
    disposition: 'archive',
    priority: 'P3',
    reason: '前端框架转为选修',
  },
  'eng-be-base': {
    course: 'E01+S04',
    hint: 'E01 后端基础；S04 数据库',
    disposition: 'split',
    priority: 'P1',
    reason: '后端/数据库拆到 E01 与 S04',
  },
  'eng-http-collab': {
    course: 'E01',
    hint: 'HTTP/接口/团队协作',
    disposition: 'keep',
    priority: 'P1',
    reason: '与 E01 对齐',
  },
  'eng-fe-adv': {
    course: 'X01',
    hint: 'Web 前端（选修，待建）',
    disposition: 'archive',
    priority: 'P3',
    reason: '前端进阶转为选修',
  },
  'eng-api-test-cicd': {
    course: 'E01',
    hint: 'API/测试/CI-CD',
    disposition: 'keep',
    priority: 'P1',
    reason: '与 E01 对齐',
  },
  'eng-db-adv': {
    course: 'S04',
    hint: '数据库设计与 SQL 优化',
    disposition: 'keep',
    priority: 'P1',
    reason: '与 S04 对齐',
  },
  'eng-fe-perf': {
    course: 'X01',
    hint: 'Web 前端（选修，待建）',
    disposition: 'archive',
    priority: 'P3',
    reason: '前端性能转为选修',
  },
  'eng-be-hc': {
    course: 'S05+AR02',
    hint: 'S05 并发；AR02 高并发架构',
    disposition: 'split',
    priority: 'P2',
    reason: '高并发/缓存/消息拆到 S05 与 AR02',
  },
  'eng-cloud': {
    course: 'K03+K06',
    hint: 'K03 Kubernetes；K06 SRE',
    disposition: 'rewrite',
    priority: 'P3',
    reason: '云原生内容进入云计算方向',
  },
  'eng-proj-fullstack': {
    course: 'P4',
    hint: 'P4 生产级 Capstone：全栈',
    disposition: 'project',
    priority: 'P2',
    reason: '项目线 P4',
  },
  'eng-proj-scale': {
    course: 'P4',
    hint: 'P4 生产级 Capstone：高并发',
    disposition: 'project',
    priority: 'P2',
    reason: '项目线 P4',
  },
  'eng-expert-arch': {
    course: 'E02+AR01',
    hint: 'E02 系统设计；AR01 架构',
    disposition: 'split',
    priority: 'P2',
    reason: '架构/选型拆到 E02 与 AR01',
  },
  'eng-expert-eff': {
    course: 'E01+AR04',
    hint: 'E01 工程；AR04 研发效能',
    disposition: 'split',
    priority: 'P2',
    reason: '工程效能拆到 E01 与 AR04',
  },

  // ── ai ────────────────────────────────────────────────────
  'ai-intro': {
    course: 'A01+F01',
    hint: 'A01 AI 全景；F01 Python 数据处理',
    disposition: 'split',
    priority: 'P3',
    reason: 'Python 数据部分前移到 F01/C01；AI 全景进入 A01',
  },
  'ai-math': {
    course: 'M02+M03+M04',
    hint: '线代/概率/微积分',
    disposition: 'split',
    priority: 'P1',
    reason: 'AI 数学拆到 M02/M03/M04',
  },
  'ai-ml-1': {
    course: 'A01',
    hint: '机器学习：监督学习',
    disposition: 'rewrite',
    priority: 'P3',
    reason: '需要补推导/实验/评估',
  },
  'ai-ml-2': {
    course: 'A01',
    hint: '树模型/聚类/集成',
    disposition: 'rewrite',
    priority: 'P3',
    reason: '需要补推导/实验/评估',
  },
  'ai-ml-3': {
    course: 'A01',
    hint: '特征工程/评估/调参',
    disposition: 'rewrite',
    priority: 'P3',
    reason: '需要补真实数据/实验',
  },
  'ai-dl-1': {
    course: 'A02',
    hint: '神经网络/PyTorch',
    disposition: 'rewrite',
    priority: 'P3',
    reason: '需要从零实现/反向传播实验',
  },
  'ai-dl-2': {
    course: 'A02+A03+A04',
    hint: 'CNN/RNN/序列',
    disposition: 'split',
    priority: 'P3',
    reason: 'CNN→A03，RNN/序列→A04/A02',
  },
  'ai-dl-3': {
    course: 'A02+A04',
    hint: 'Transformer/注意力',
    disposition: 'split',
    priority: 'P3',
    reason: 'Transformer 原理→A02，NLP→A04',
  },
  'ai-llm': {
    course: 'A07',
    hint: '大模型预训练',
    disposition: 'rewrite',
    priority: 'P3',
    reason: '需要从零训练/缩放律实验',
  },
  'ai-align': {
    course: 'A07',
    hint: '微调与对齐',
    disposition: 'rewrite',
    priority: 'P3',
    reason: '需要 SFT/DPO 实验',
  },
  'ai-serving': {
    course: 'A07+A08',
    hint: '推理优化/评测/安全',
    disposition: 'split',
    priority: 'P3',
    reason: '推理→A08，评测/安全→A07',
  },
  'ai-rag': {
    course: 'P4',
    hint: 'P4 Capstone：RAG',
    disposition: 'project',
    priority: 'P3',
    reason: '项目线 P4；A07 的应用 Capstone',
  },
  'ai-agent-deploy': {
    course: 'P4',
    hint: 'P4 Capstone：Agent/模型服务',
    disposition: 'project',
    priority: 'P3',
    reason: '项目线 P4；A07 的应用 Capstone',
  },
  'ai-expert-dist': {
    course: 'A08',
    hint: '分布式训练',
    disposition: 'rewrite',
    priority: 'P3',
    reason: '需要 DP/TP/PP/ZeRO 实验',
  },
  'ai-expert-infra': {
    course: 'A08',
    hint: '推理内核/AI 基础设施',
    disposition: 'rewrite',
    priority: 'P3',
    reason: '需要论文/系统级重写',
  },
}

// ── 解析旧数据 ──────────────────────────────────────────────
function parseDomain({ file, id, title }) {
  const source = fs.readFileSync(path.join(DATA_DIR, `${file}.ts`), 'utf8')
  const modMatches = [...source.matchAll(/mod\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',/g)]
  const modules = []

  for (let i = 0; i < modMatches.length; i++) {
    const m = modMatches[i]
    const start = m.index
    const end = i + 1 < modMatches.length ? modMatches[i + 1].index : source.length
    const body = source.slice(start, end)
    const lessons = [...body.matchAll(/l\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),/g)].map((l) => ({
      id: l[1],
      title: l[2],
      level: l[3],
      minutes: Number(l[4]),
    }))
    modules.push({ id: m[1], title: m[2], stage: m[3], lessons })
  }

  return modules.map((m) => ({ ...m, domainId: id, domainTitle: title, file }))
}

function lessonOverride(moduleId, lesson, mapping) {
  const title = lesson.title
  let course = mapping.course
  let hint = mapping.hint
  let disposition = mapping.disposition
  let priority = mapping.priority
  let reason = mapping.reason

  // AI 数学按主题拆分
  if (moduleId === 'ai-math') {
    if (/向量|矩阵|特征|SVD|线性/.test(title)) {
      course = 'M02'
      hint = '线性代数'
      disposition = 'rewrite'
      priority = 'P1'
    } else if (/概率|分布|估计|贝叶斯|统计/.test(title)) {
      course = 'M03'
      hint = '概率统计'
      disposition = 'rewrite'
      priority = 'P1'
    } else if (/导数|梯度|优化|微积分|泰勒/.test(title)) {
      course = 'M04'
      hint = '微积分与最优化'
      disposition = 'rewrite'
      priority = 'P1'
    }
  }

  // AI 入门里的 Python 数据内容前移
  if (moduleId === 'ai-intro' && /Python|NumPy|Pandas|可视化|数据处理/.test(title)) {
    course = 'F01+C01'
    hint = 'Python 数据处理（前移）'
    disposition = 'rewrite'
    priority = 'P1'
    reason = '旧 AI 入门中的 Python 数据内容前移到 F01/C01，服务零基础'
  }

  // 二进制模块按主题拆到组成/系统编程
  if (moduleId === 'fund-binary' && /内存|指针|可执行|栈|字节序/.test(title)) {
    course = 'C02'
    hint = 'C 与系统编程：内存布局'
    disposition = 'split'
    priority = 'P1'
  }

  // C++ 专属内容转选修
  if (moduleId === 'lang-cpp' && /C\+\+|STL|RAII|智能指针|类/.test(title)) {
    course = 'X03'
    hint = 'C++（选修，待建）'
    disposition = 'archive'
    priority = 'P3'
    reason = 'C++ 专属内容转为选修；C 系统编程部分进入 C02'
  }

  // 项目类课时统一走项目线
  if (/项目/.test(title) && disposition !== 'project') {
    disposition = 'project'
    reason = `旧课时为项目内容；${reason}`
  }

  return { course, hint, disposition, priority, reason }
}

const modules = DOMAINS.flatMap(parseDomain)
const allLessons = modules.flatMap((mod) => mod.lessons)
const expectedLessons = 471

if (allLessons.length !== expectedLessons) {
  console.error(`课时数不一致：解析到 ${allLessons.length}，预期 ${expectedLessons}`)
  process.exit(1)
}

const missing = modules.filter((m) => !MODULE_MAP[m.id])
if (missing.length) {
  console.error('缺少模块映射：', missing.map((m) => `${m.id} ${m.title}`).join('\n'))
  process.exit(1)
}

const rows = []
for (const mod of modules) {
  const mapping = MODULE_MAP[mod.id]
  for (const lesson of mod.lessons) {
    const override = lessonOverride(mod.id, lesson, mapping)
    rows.push({
      old_domain: mod.domainId,
      old_domain_title: mod.domainTitle,
      old_module_id: mod.id,
      old_module_title: mod.title,
      old_stage: mod.stage,
      old_lesson_id: lesson.id,
      old_lesson_title: lesson.title,
      old_level: lesson.level,
      old_minutes: lesson.minutes,
      new_course: override.course,
      new_module_hint: override.hint,
      disposition: override.disposition,
      priority: override.priority,
      reason: override.reason,
      source_file: `src/data/${mod.file}.ts`,
    })
  }
}

// ── CSV 输出 ────────────────────────────────────────────────
function csvCell(value) {
  const s = String(value ?? '')
  return `"${s.replace(/"/g, '""')}"`
}

function toCsv(items, columns) {
  const header = columns.join(',')
  const lines = items.map((item) => columns.map((c) => csvCell(item[c])).join(','))
  return `\uFEFF${header}\n${lines.join('\n')}\n`
}

const lessonColumns = [
  'old_domain',
  'old_domain_title',
  'old_module_id',
  'old_module_title',
  'old_stage',
  'old_lesson_id',
  'old_lesson_title',
  'old_level',
  'old_minutes',
  'new_course',
  'new_module_hint',
  'disposition',
  'priority',
  'reason',
  'source_file',
]

const moduleRows = modules.map((mod) => {
  const mapping = MODULE_MAP[mod.id]
  return {
    old_domain: mod.domainId,
    old_module_id: mod.id,
    old_module_title: mod.title,
    old_stage: mod.stage,
    lesson_count: mod.lessons.length,
    new_course: mapping.course,
    new_module_hint: mapping.hint,
    disposition: mapping.disposition,
    priority: mapping.priority,
    reason: mapping.reason,
  }
})

const moduleColumns = [
  'old_domain',
  'old_module_id',
  'old_module_title',
  'old_stage',
  'lesson_count',
  'new_course',
  'new_module_hint',
  'disposition',
  'priority',
  'reason',
]

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(path.join(OUT_DIR, 'migration-map.csv'), toCsv(rows, lessonColumns), 'utf8')
fs.writeFileSync(path.join(OUT_DIR, 'module-map.csv'), toCsv(moduleRows, moduleColumns), 'utf8')

function countBy(key) {
  return rows.reduce((acc, row) => {
    acc[row[key]] = (acc[row[key]] ?? 0) + 1
    return acc
  }, {})
}

const summary = {
  generatedAt: new Date().toISOString(),
  totals: {
    domains: DOMAINS.length,
    modules: modules.length,
    lessons: rows.length,
  },
  disposition: countBy('disposition'),
  priority: countBy('priority'),
  domains: DOMAINS.map((d) => {
    const rowsForDomain = rows.filter((r) => r.old_domain === d.id)
    return {
      id: d.id,
      title: d.title,
      modules: modules.filter((m) => m.domainId === d.id).length,
      lessons: rowsForDomain.length,
      disposition: rowsForDomain.reduce((acc, row) => {
        acc[row.disposition] = (acc[row.disposition] ?? 0) + 1
        return acc
      }, {}),
      priority: rowsForDomain.reduce((acc, row) => {
        acc[row.priority] = (acc[row.priority] ?? 0) + 1
        return acc
      }, {}),
    }
  }),
  newCourses: [...new Set(rows.map((r) => r.new_course))].sort(),
}

fs.writeFileSync(
  path.join(OUT_DIR, 'migration-summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
  'utf8',
)

console.log('已生成：')
console.log(`- ${path.relative(ROOT, path.join(OUT_DIR, 'migration-map.csv'))}（${rows.length} 行）`)
console.log(`- ${path.relative(ROOT, path.join(OUT_DIR, 'module-map.csv'))}（${moduleRows.length} 行）`)
console.log(`- ${path.relative(ROOT, path.join(OUT_DIR, 'migration-summary.json'))}`)
console.log('处置分布：', summary.disposition)
console.log('优先级分布：', summary.priority)
