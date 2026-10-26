import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import { formatMinutes, getDomain, getModule } from '../data'
import { useProgress } from '../store/ProgressContext'

export default function ModulePage() {
  const { domainId, moduleId } = useParams()
  const domain = getDomain(domainId)
  const module = getModule(domain, moduleId)
  const { isDone, toggle } = useProgress()

  if (!domain || !module) {
    return (
      <div className="placeholder">
        没有找到该模块。
        <Link to="/"> 返回首页</Link>
      </div>
    )
  }

  const moduleIndex = domain.modules.findIndex((m) => m.id === module.id)
  const prevModule = domain.modules[moduleIndex - 1]
  const nextModule = domain.modules[moduleIndex + 1]
  const doneCount = module.lessons.filter((lesson) => isDone(lesson.id)).length
  const minutes = module.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0)

  return (
    <div style={{ '--accent': domain.accent } as CSSProperties}>
      <header className="page-head" style={{ borderTopColor: domain.accent }}>
        <div className="page-head__top">
          <span className="page-head__abbr" style={{ background: domain.accent }}>
            {String(moduleIndex + 1).padStart(2, '0')}
          </span>
          <div>
            <h1>{module.title}</h1>
            <p className="page-head__tagline">{domain.title}</p>
          </div>
        </div>
        <p className="page-head__desc">{module.summary}</p>
        <div className="page-head__stats">
          <span className="stat-chip">
            成长阶段 <strong>{module.stage}</strong>
          </span>
          <span className="stat-chip">
            <strong>{module.lessons.length}</strong> 个课时
          </span>
          <span className="stat-chip">
            预计时长 <strong>{formatMinutes(minutes)}</strong>
          </span>
          <span className="stat-chip">
            已完成 <strong>{doneCount}</strong>
          </span>
          <span className="stat-chip" style={{ minWidth: 180 }}>
            <ProgressBar ratio={module.lessons.length ? doneCount / module.lessons.length : 0} accent={domain.accent} />
          </span>
        </div>
      </header>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">课时列表</h2>
            <p className="section__desc">建议按顺序学习，每节课都列出了要掌握的知识点。</p>
          </div>
        </div>

        <article className="card module-card">
          {module.lessons.map((lesson, index) => (
            <div key={lesson.id} className="lesson-row">
              <button
                type="button"
                className={`dot-state${isDone(lesson.id) ? ' is-done' : ''}`}
                aria-label={isDone(lesson.id) ? '标记为未完成' : '标记为已完成'}
                onClick={() => toggle(lesson.id)}
              />
              <span className="lesson-row__index">{String(index + 1).padStart(2, '0')}</span>
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
        </article>

        <div className="pager">
          {prevModule ? (
            <Link className="pager__link" to={`/domain/${domain.id}/${prevModule.id}`}>
              <small>上一个模块</small>
              <strong>{prevModule.title}</strong>
            </Link>
          ) : (
            <span className="pager__link pager__link--disabled" />
          )}
          {nextModule ? (
            <Link className="pager__link pager__link--next" to={`/domain/${domain.id}/${nextModule.id}`}>
              <small>下一个模块</small>
              <strong>{nextModule.title}</strong>
            </Link>
          ) : (
            <span className="pager__link pager__link--disabled" />
          )}
        </div>
      </section>
    </div>
  )
}