import type { Stage } from '../types'

export interface StageGuide {
  stage: Stage
  /** 该阶段的定位 */
  title: string
  /** 进入该阶段的前提 */
  prerequisite: string
  /** 学完能做什么 */
  outcome: string
  /** 该阶段的训练重点 */
  focus: string[]
}

/**
 * 六阶成长模型：每个板块都必须走完这条路径，
 * 板块内模块的 stage 字段与此处的顺序一致。
 */
export const stageGuide: StageGuide[] = [
  {
    stage: '零基础',
    title: '从零建立认知',
    prerequisite: '不需要任何前置知识',
    outcome: '能解释这门学科解决什么问题，能动手跑通第一个可运行的程序或实验。',
    focus: ['建立整体认知地图', '装好并会用工具链', '跑通第一个最小可运行例子'],
  },
  {
    stage: '基础',
    title: '打牢基本功',
    prerequisite: '完成零基础阶段，能独立运行示例代码',
    outcome: '能独立写出百行级程序 / 完成基础实验，能说清核心概念的来龙去脉。',
    focus: ['核心概念逐个吃透', '手写基础实现而非只会调库', '建立调试与排错习惯'],
  },
  {
    stage: '进阶',
    title: '建立体系与方法论',
    prerequisite: '基础扎实，能独立完成小项目',
    outcome: '能独立完成中等规模模块，能对方案做对比选型并说明取舍。',
    focus: ['成体系地串联知识点', '掌握常见方案与取舍', '开始关注性能与边界条件'],
  },
  {
    stage: '高级',
    title: '深入原理与生产环境',
    prerequisite: '能独立交付模块，理解主流方案',
    outcome: '能从原理层定位复杂问题，能设计并调优生产级方案。',
    focus: ['读源码与规格文档', '处理并发、性能与稳定性问题', '掌握工程化与可观测手段'],
  },
  {
    stage: '项目实战',
    title: '做出可写进简历的成果',
    prerequisite: '高级阶段的知识储备',
    outcome: '产出可运行、可演示、经得起追问的完整项目，具备独立交付能力。',
    focus: ['从需求到上线的完整闭环', '工程规范与质量保障', '性能压测与运维接入'],
  },
  {
    stage: '专家级',
    title: '原理级与极限优化',
    prerequisite: '有真实项目经验，能独立负责系统',
    outcome: '能主导技术方向与架构决策，能解决无先例可循的疑难问题，能产出对外分享的方法论。',
    focus: ['源码级与论文级深入', '极限性能与成本优化', '技术决策、治理与影响力'],
  },
]

export const stageGuideMap = new Map(stageGuide.map((item) => [item.stage, item]))