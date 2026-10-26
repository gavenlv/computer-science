interface ProgressBarProps {
  /** 0~1 */
  ratio: number
  accent?: string
}

export default function ProgressBar({ ratio, accent }: ProgressBarProps) {
  const percent = Math.round(Math.max(0, Math.min(1, ratio)) * 100)
  return (
    <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress__track">
        <div
          className="progress__fill"
          style={{ width: `${percent}%`, background: accent ?? 'var(--accent)' }}
        />
      </div>
      <span className="progress__value">{percent}%</span>
    </div>
  )
}