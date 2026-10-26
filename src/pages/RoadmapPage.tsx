import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import { domains, formatMinutes, stageGroups, stageGuide, stageStats, totalStats } from '../data'
import { useProgress } from '../store/ProgressContext'
import { STAGES } from '../types'

export default function RoadmapPage() {
  const { isDone, ratioOf } = useProgress()
  const totals = totalStats()

  return (
    <>
      <header className="page-head" style={{ borderTopColor: '#334155' }}>
        <div className="page-head__top">
          <span className="page-head__abbr" style={{ background: '#334155' }}>
            路线
          </span>
          <div>
            <h1>六阶成长模型</h1>
            <p className="page-head__tagline">每个板块都从零基础一路走到专家级，不做蜻蜓点水的介绍</p>
          </div>
        </div>
        <p className="page-head__desc">
          每个学习板块都由相同的六个阶段构成：零基础 → 基础 → 进阶 → 高级 → 项目实战 → 专家级。
          阶段内模块按依赖顺序排列，学完一个阶段再进入下一个阶段，避免「学了很多但都停在皮毛」。
        </p>
        <div className="page-head__stats">
          <span className="stat-chip">
            <strong>{STAGES.length}</strong> 个成长阶段
          </span>
          <span className="stat-chip">
            <strong>{domains.length}</strong> 个学习板块
          </span>
          <span className="stat-chip">
            <strong>{totals.moduleCount}</strong> 个模块
          </span>
          <span className="stat-chip">
            <strong>{totals.lessonCount}</strong> 个课时
          </span>
          <span className="stat-chip">
            预计总时长 <strong>{formatMinutes(totals.minutes)}</strong>
          </span>
        </div>
      </header>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">六个阶段分别学什么</h2>
            <p className="section__desc">每个阶段都有明确的准入前提与产出要求，用来自我检查是否真的学到位。</p>
          </div>
        </div>
        <div className="grid grid--3">
          {stageGuide.map((guide, index) => (
            <article key={guide.stage} className="card stage-card">
              <div className="stage-card__top">
                <span className="stage-card__index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{guide.stage}</h3>
                  <p className="stage-card__title">{guide.title}</p>
                </div>
              </div>
              <p className="stage-card__row">
                <span>前提</span>
                {guide.prerequisite}
              </p>
              <p className="stage-card__row">
                <span>产出</span>
                {guide.outcome}
              </p>
              <ul className="stage-card__focus">
                {guide.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">各板块的成长路径</h2>
            <p className="section__desc">同一个阶段模型套在每个板块上，模块按学习顺序排列，点击即可进入。</p>
          </div>
        </div>

        {domains.map((domain) => (
          <article key={domain.id} className="card track-card">
            <header className="track-card__head">
              <span className="domain-card__abbr" style={{ background: domain.accent }}>
                {domain.abbr}
              </span>
              <div className="track-card__title">
                <h3>
                  <Link to={`/domain/${domain.id}`}>{domain.title}</Link>
                </h3>
                <p className="muted">{domain.outcome}</p>
              </div>
              <div className="track-card__progress">
                <ProgressBar ratio={ratioOf(domain.id)} accent={domain.accent} />
              </div>
            </header>

            <div className="track-card__stages">
              {stageGroups(domain).map((group, index) => {
                const s = stageStats(domain, group.stage)
                const lessonIds = group.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))
                const done = lessonIds.filter((id) => isDone(id)).length
                return (
                  <div key={group.stage} className="track-stage">
                    <div className="track-stage__label">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{group.stage}</strong>
                      <small>
                        {done}/{s.lessonCount} 课时
                      </small>
                    </div>
                    <div className="track-stage__modules">
                      {group.modules.map((module) => (
                        <Link
                          key={module.id}
                          to={`/domain/${domain.id}/${module.id}`}
                          className="track-stage__module"
                        >
                          {module.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </article>
        ))}
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">板块之间的推荐顺序</h2>
            <p className="section__desc">板块之间也有依赖：先有编程能力，再谈算法与系统，最后进入工程与 AI。</p>
          </div>
        </div>
        <ol className="order-list">
          {domains.map((domain, index) => {
            const entry = domain.modules[0]
            return (
              <li key={domain.id} className="card order-list__item">
                <span className="order-list__index">{String(index + 1).padStart(2, '0')}</span>
                <div className="order-list__body">
                  <h3>{domain.title}</h3>
                  <p className="muted">{domain.tagline}</p>
                  <div className="order-list__meta">
                    <span className="badge">{domain.modules.length} 个模块</span>
                    <span className="badge">
                      {domain.modules.reduce((sum, module) => sum + module.lessons.length, 0)} 课时
                    </span>
                    <span className="badge">{STAGES.length} 个阶段</span>
                  </div>
                </div>
                {entry && (
                  <Link className="btn btn--ghost btn--sm" to={`/domain/${domain.id}/${entry.id}`}>
                    从「{entry.title}」开始
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </section>
    </>
  )
}