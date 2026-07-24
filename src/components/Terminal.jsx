import './Terminal.css'

export default function Terminal({ title, children, glow }) {
  return (
    <div className={`terminal ${glow ? 'term-glow' : ''}`}>
      <div className="term-bar">
        <span className="term-dot" style={{ background: '#F38BA8' }} />
        <span className="term-dot" style={{ background: '#F9E2AF' }} />
        <span className="term-dot" style={{ background: '#A6E3A1' }} />
        {title && <span className="term-title">{title}</span>}
      </div>
      <div className="term-body">
        {children}
      </div>
    </div>
  )
}
