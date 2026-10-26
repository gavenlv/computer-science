import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import {
  domainSequence,
  domainStats,
  domains,
  formatMinutes,
  stageGuide,
  totalStats,
} from '../data'
import { useProgress } from '../store/ProgressContext'
import { STAGES } from '../types'

export default function Home() {
  const { isDone, doneCount, ratioOf } = useProgress()
  const totals = useMemo(() => totalStats(), [])
  const sequence = useMemo(() => domains.flatMap((domain) => domainSequence(domain)), [])

  const continueRef = useMemo(
    () => sequence.find((ref) => !isDone(ref.lesson.id)) ?? sequence[0],
    // 进度变化时需要重新计算「继续学习」目标
    [sequence, isDone],
  )

  return (
    <>
      <section className="hero">
        <span className="hero__tag">零基础 → 项目实战 → 高级工程师 → 专家级</span>
        <h1>每个板块都从零基础讲起，一路做到原理级与专家水平</h1>
        <p>
          五大板块各自走完「零基础 / 基础 / 进阶 / 高级 / 项目实战 / 专家级」六个阶段，
          每个模块按依赖顺序排列，每个课时都给出可落地的具体知识点。不是科普式介绍，而是完整的进阶路径。
        </p>
        <div className="hero__actions">
          <Link className="btn" to="/roadmap">
            查看六阶成长模型
          </Link>
          {continueRef && (
            <Link
              className="btn btn--ghost"
              to={`/domain/${continueRef.domain.id}/${continueRef.module.id}/${continueRef.lesson.id}`}
            >
              继续学习：{continueRef.lesson.title}
            </Link>
          )}
        </div>
        <div className="hero__stats">
          <div className="hero__stat">
            <strong>{domains.length}</strong>
            <span>学习板块</span>
          </div>
          <div className="hero__stat">
            <strong>{STAGES.length}</strong>
            <span>成长阶段</span>
          </div>
          <div className="hero__stat">
            <strong>{totals.moduleCount}</strong>
            <span>知识模块</span>
          </div>
          <div className="hero__stat">
            <strong>{totals.lessonCount}</strong>
            <span>课时大纲</span>
          </div>
          <div className="hero__stat">
            <strong>{formatMinutes(totals.minutes)}</strong>
            <span>预计总时长</span>
          </div>
          <div className="hero__stat">
            <strong>{doneCount}</strong>
            <span>已完成课时</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">六阶成长模型</h2>
            <p className="section__desc">所有板块共用同一套阶段划分，每一阶都有准入前提与产出要求。</p>
          </div>
          <Link className="btn btn--ghost btn--sm" to="/roadmap">
            展开完整路线
          </Link>
        </div>
        <div className="grid grid--3">
          {stageGuide.map((guide, index) => (
            <Link key={guide.stage} to="/roadmap" className="card domain-card">
              <div className="domain-card__top">
                <span className="domain-card__abbr" style={{ background: '#334155' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{guide.stage}</h3>
              </div>
              <p className="domain-card__tagline">{guide.outcome}</p>
              <div className="domain-card__meta">
                <span className="badge">{guide.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">五大学习板块</h2>
            <p className="section__desc">每个板块按「阶段 → 模块 → 课时」组织，可单独走完全程，也可按推荐顺序串联。</p>
          </div>
        </div>
        <div className="grid grid--domains">
          {domains.map((domain) => {
            const stats = domainStats(domain)
            return (
              <Link key={domain.id} to={`/domain/${domain.id}`} className="card domain-card">
                <div className="domain-card__top">
                  <span className="domain-card__abbr" style={{ background: domain.accent }}>
                    {domain.abbr}
                  </span>
                  <h3>{domain.title}</h3>
                </div>
                <p className="domain-card__tagline">{domain.tagline}</p>
                <ProgressBar ratio={ratioOf(domain.id)} accent={domain.accent} />
                <div className="domain-card__meta">
                  <span className="badge">{stats.moduleCount} 个模块</span>
                  <span className="badge">{stats.lessonCount} 课时</span>
                  <span className="badge">{formatMinutes(stats.minutes)}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">推荐起步</h2>
            <p className="section__desc">完全零基础时，从这三个板块的零基础阶段开始，先建立编程能力再向后推进。</p>
          </div>
        </div>
        <div className="grid grid--3">
          {domains.slice(0, 3).map((domain) => {
            const first = domain.modules[0]
            const lessons = domain.modules
              .filter((module) => module.stage === '零基础')
              .flatMap((module) => module.lessons)
            return (
              <Link key={domain.id} to={`/domain/${domain.id}/${first.id}`} className="card domain-card">
                <div className="domain-card__top">
                  <span className="domain-card__abbr" style={{ background: domain.accent }}>
                    {domain.abbr}
                  </span>
                  <h3>{first.title}</h3>
                </div>
                <p className="domain-card__tagline">{first.summary}</p>
                <div className="domain-card__meta">
                  <span className="badge">{domain.title}</span>
                  <span className="badge">零基础阶段 {lessons.length} 课时</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}