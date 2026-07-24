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

        {/* ─── About ─── */}
        <div className="about-block fade-in fade-in-4">
          <p className="prompt">
            <span className="prompt-sign">❯</span> cat about.md
          </p>
          <div className="about-body">
            <p>
              Born 2003.08.24 in China · ISTP · fitness enthusiast 🏋️
            </p>
            <p>
              Currently switching to CS (转码中). Recreational coder &amp; open source enthusiast.
              Tsinghua M.S. · Xiamen B.S. · Huawei intern.
            </p>
            <p>
              I like to spend time on interesting things. Grateful to live in an open-source world.
              Love VS Code. Happy to contribute for free to fun projects &amp; ideas — feel free to email me!
            </p>
            <p className="quote-line">
              "The mission of learning is to gain an understanding of various designs."
            </p>
            <p className="quote-line">
              "Attempt to achieve any sustainable behavior through automated means."
            </p>
            <p className="awards-line">
              🏆 National Scholarship · BYD Scholarship · Luyan Scholarship · Academic Excellence ·
              Outstanding Merit Student · Outstanding Graduate · RoboCup Champion
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
