import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Home.css'

const taglines = [
  'six-dimensional force sensors',
  'measurement & control technology',
  'National Scholarship, BYD Scholarship...',
  'CLI agents & LLMs',
  'half marathon runner (1:56:08)',
  'Tsinghua · Xiamen U',
]

export default function Home() {
  const [tagIndex, setTagIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTagIndex(i => (i + 1) % taglines.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="home">
      <div className="container">
        {/* ─── Terminal Header ─── */}
        <div className="term-bar fade-in fade-in-1">
          <span className="term-dot" style={{ background: '#F38BA8' }} />
          <span className="term-dot" style={{ background: '#F9E2AF' }} />
          <span className="term-dot" style={{ background: '#A6E3A1' }} />
          <span className="term-title">xinlong@personal-site ~ %</span>
        </div>

        {/* ─── Intro ─── */}
        <div className="intro fade-in fade-in-2">
          <p className="prompt">
            <span className="prompt-sign">❯</span> whoami
          </p>
          <h1 className="name">
            Xinlong <span className="highlight">Zhang</span>
          </h1>
          <p className="desc">
            M.S. student @ Tsinghua University · previously @ Xiamen University
          </p>
          <div className="rotating-tags">
            <span className="prompt-sign">❯</span> Currently into{' '}
            <span className="tag-rotator">{taglines[tagIndex]}</span>
          </div>
        </div>

        {/* ─── Quick Links ─── */}
        <div className="quick-links fade-in fade-in-3">
          <Link to="/blog" className="ql-link">
            <span className="ql-icon"></span>
            <span className="ql-label">blog</span>
            <span className="ql-arrow">→</span>
          </Link>
          <a href="https://github.com/xilon-my" target="_blank" rel="noopener noreferrer" className="ql-link">
            <span className="ql-icon"></span>
            <span className="ql-label">github</span>
            <span className="ql-arrow">→</span>
          </a>
          <a href="mailto:3422647204@qq.com" className="ql-link">
            <span className="ql-icon"></span>
            <span className="ql-label">email</span>
            <span className="ql-arrow">→</span>
          </a>
        </div>

        {/* ─── About — compact ─── */}
        <div className="about-block fade-in fade-in-4">
          <p className="prompt">
            <span className="prompt-sign">❯</span> echo $BACKGROUND
          </p>
          <div className="about-body">
            <p>
              B.S. in <strong>Measurement &amp; Control Technology and Instruments</strong> @ Xiamen University (top 1/35).
              Now M.S. in <strong>Electronic Information</strong> @ Tsinghua University, researching <strong>six-dimensional force sensors</strong>.
            </p>
            <p className="awards-line">
              🏆 National Scholarship · Luyan Scholarship · BYD Scholarship (top 1%) · Academic Excellence ·
              Academic Innovation · Outstanding Merit Student · Outstanding Graduate
            </p>
          </div>
        </div>

        {/* ─── Footer prompt ─── */}
        <div className="home-footer fade-in fade-in-4">
          <span className="prompt-sign">❯</span> <span className="blinking-cursor">_</span>
        </div>
      </div>
    </div>
  )
}
