import { useState, useEffect } from 'react'
import Terminal from '../components/Terminal.jsx'
import Typewriter from '../components/Typewriter.jsx'
import LiveTerminal from '../components/LiveTerminal.jsx'
import './Home.css'

const taglines = [
  'six-dimensional force sensors',
  'CLI agents & LLMs',
  'half marathon runner (1:56:08)',
  'open source & building things',
]

export default function Home() {
  const [tagIndex, setTagIndex] = useState(0)
  const [showQuickLinks, setShowQuickLinks] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTagIndex(i => (i + 1) % taglines.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="home">
      <div className="container">
        <Terminal title="shannon@shannon.zone ~ %" glow>
          {/* ─── Intro ─── */}
          <div className="intro">
            <p className="prompt">
              <span className="prompt-sign">❯</span> whoami
            </p>
            <h1 className="name">
              <Typewriter text="Shannon Zhang" speed={50} delay={200} onDone={() => setShowQuickLinks(true)} />
            </h1>
            <p className="desc">
              M.S. in Electronic Information @ Tsinghua University · B.S. @ Xiamen University
            </p>
            <div className="rotating-tags">
              <span className="prompt-sign">❯</span> Currently into{' '}
              <span className="tag-rotator">{taglines[tagIndex]}</span>
            </div>
          </div>

          {/* ─── Quick Links ─── */}
          <div className={`quick-links ${showQuickLinks ? 'fade-in' : ''}`} style={showQuickLinks ? {} : { display: 'none' }}>
            <a href="https://github.com/xilon-my" target="_blank" rel="noopener noreferrer" className="ql-link">
              <span className="ql-icon">❯</span>
              <span className="ql-label">github</span>
              <span className="ql-arrow">→</span>
            </a>
            <a href="mailto:3422647204@qq.com" className="ql-link">
              <span className="ql-icon">❯</span>
              <span className="ql-label">email</span>
              <span className="ql-arrow">→</span>
            </a>
          </div>

          {/* ─── About ─── */}
          <div className="about-section">
            <p className="prompt">
              <span className="prompt-sign">❯</span> <Typewriter text="cat about.md" speed={40} delay={600} onDone={() => setShowAbout(true)} />
            </p>
            {showAbout && (
              <div className="about-content fade-in">
                <p>Born 2003.08.24 in China · ISTP · fitness enthusiast</p>
                <p>My wish is to do interesting things.</p>
              </div>
            )}
          </div>

          {/* ─── Interactive Terminal ─── */}
          <LiveTerminal compact />
        </Terminal>
      </div>
    </div>
  )
}
