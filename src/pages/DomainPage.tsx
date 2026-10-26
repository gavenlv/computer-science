import { useMemo, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import {
  domainStats,
  entryModule,
  formatMinutes,
  getDomain,
  stageGroups,
  stageGuideMap,
  stageStats,
} from '../data'
import { useProgress } from '../store/ProgressContext'
import { STAGES } from '../types'

export default function DomainPage() {
  const { domainId } = useParams()
  const domain = getDomain(domainId)
  const { isDone, toggle, ratioOf } = useProgress()
  const groups = useMemo(() => (domain ? stageGroups(domain) : []), [domain])

  if (!domain) {
    return (
      <div className="placeholder">
        没有找到该学习板块。
        <Link to="/"> 返回首页</Link>
      </div>
    )
  }

  const stats = domainStats(domain)
  const entry = entryModule(domain)

  const scrollToStage = (index: number) => {
    document.getElementById(`stage-block-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ '--accent': domain.accent } as CSSProperties}>
      <header className="page-head" style={{ borderTopColor: domain.accent }}>
        <div className="page-head__top">
          <span className="page-head__abbr" style={{ background: domain.accent }}>
            {domain.abbr}
          </span>
          <div>
            <h1>{domain.title}</h1>
            <p className="page-head__tagline">{domain.tagline}</p>
          </div>
        </div>
        <p className="page-head__desc">{domain.description}</p>
        <p className="page-head__outcome">
          <strong>学完本板块可以达到：</strong>
          {domain.outcome}
        </p>
        <div className="page-head__stats">
          <span className="stat-chip">
            <strong>{STAGES.length}</strong> 个成长阶段
          </span>
          <span className="stat-chip">
            <strong>{stats.moduleCount}</strong> 个模块
          </span>
          <span className="stat-chip">
            <strong>{stats.lessonCount}</strong> 个课时
          </span>
          <span className="stat-chip">
            预计时长 <strong>{formatMinutes(stats.minutes)}</strong>
          </span>
          <span className="stat-chip" style={{ minWidth: 180 }}>
            <ProgressBar ratio={ratioOf(domain.id)} accent={domain.accent} />
          </span>
        </div>
        <div className="page-head__actions">
          {entry && (
            <Link className="btn" to={`/domain/${domain.id}/${entry.id}`}>
              从零基础开始：{entry.title}
            </Link>
          )}
          <Link className="btn btn--ghost" to="/roadmap">
            查看六阶成长模型
          </Link>
        </div>
      </header>

      <nav className="stage-nav" aria-label="成长阶段导航">
        {groups.map((group, index) => {
          const s = stageStats(domain, group.stage)
          return (
            <button key={group.stage} type="button" className="stage-nav__item" onClick={() => scrollToStage(index)}>
              <span className="stage-nav__index">{String(index + 1).padStart(2, '0')}</span>
              <span className="stage-nav__label">{group.stage}</span>
              <span className="stage-nav__meta">
                {group.modules.length} 模块 · {s.lessonCount} 课时
              </span>
            </button>
          )
        })}
      </nav>

      {groups.map((group, index) => {
        const guide = stageGuideMap.get(group.stage)
        const s = stageStats(domain, group.stage)
        const lessonIds = group.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))
        const done = lessonIds.filter((id) => isDone(id)).length
        return (
          <section key={group.stage} id={`stage-block-${index}`} className="stage-block">
            <header className="stage-block__head">
              <div>
                <span className="stage-block__index">阶段 {String(index + 1).padStart(2, '0')}</span>
                <h2>
                  {group.stage}
                  {guide && <em>{guide.title}</em>}
                </h2>
                {guide && <p className="stage-block__desc">{guide.outcome}</p>}
                <div className="stage-block__stats">
                  <span className="badge">{group.modules.length} 个模块</span>
                  <span className="badge">{s.lessonCount} 个课时</span>
                  <span className="badge">{formatMinutes(s.minutes)}</span>
                  <span className="badge badge--done">
                    {done}/{lessonIds.length} 已完成
                  </span>
                </div>
              </div>
              <div className="stage-block__progress">
                <ProgressBar
                  ratio={lessonIds.length ? done / lessonIds.length : 0}
                  accent={domain.accent}
                />
              </div>
            </header>

            {group.modules.map((module) => {
              const moduleDone = module.lessons.filter((lesson) => isDone(lesson.id)).length
              const moduleIndex = domain.modules.findIndex((m) => m.id === module.id)
              return (
                <article key={module.id} className="card module-card">
                  <div className="module-card__head">
                    <div>
                      <span className="module-card__index">
                        模块 {String(moduleIndex + 1).padStart(2, '0')}
                      </span>
                      <h3>
                        <Link to={`/domain/${domain.id}/${module.id}`}>{module.title}</Link>
                      </h3>
                      <p className="module-card__summary">{module.summary}</p>
                    </div>
                    <span className="badge badge--accent">
                      {moduleDone}/{module.lessons.length}
                    </span>
                  </div>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="lesson-row">
                      <button
                        type="button"
                        className={`dot-state${isDone(lesson.id) ? ' is-done' : ''}`}
                        aria-label={isDone(lesson.id) ? '标记为未完成' : '标记为已完成'}
                        onClick={() => toggle(lesson.id)}
                      />
                      <span className="lesson-row__index">{lessonIndex + 1}</span>
                      <Link className="lesson-row__title" to={`/domain/${domain.id}/${module.id}/${lesson.id}`}>
                        {lesson.title}
                      </Link>
                      <div className="lesson-row__meta">
                        <span className="badge">{lesson.level}</span>
                        <span className="badge">{lesson.minutes} 分钟</span>
                        {isDone(lesson.id) && <span className="badge badge--done">已完成</span>}
                      </div>
                    </div>
                  ))}

                  <div className="module-card__foot">
                    <Link className="btn btn--ghost btn--sm" to={`/domain/${domain.id}/${module.id}`}>
                      查看模块详情
                    </Link>
                    <span className="muted" style={{ fontSize: 12 }}>
                      共 {module.lessons.length} 课时 ·{' '}
                      {formatMinutes(module.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0))}
                    </span>
                  </div>
                </article>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}