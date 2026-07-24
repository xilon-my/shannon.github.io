import Experience from '../components/Experience.jsx'
import Projects from '../components/Projects.jsx'
import Skills from '../components/Skills.jsx'
import './CV.css'

export default function CV() {
  return (
    <div className="cv-page">
      <div className="container">

        {/* ─── Header ─── */}
        <div className="cv-header">
          <div className="term-dots">
            <span className="t-dot" style={{ background: '#F38BA8' }} />
            <span className="t-dot" style={{ background: '#F9E2AF' }} />
            <span className="t-dot" style={{ background: '#A6E3A1' }} />
            <span className="t-title">cv — xinlong zhang</span>
          </div>
          <h1 className="cv-name">Xinlong Zhang</h1>
          <p className="cv-sub">
            <span className="prompt-cv">❯</span> xinlong@tsinghua.edu.cn · github.com/xilon-my
          </p>
        </div>

        {/* ─── Education ─── */}
        <section className="cv-section">
          <p className="cv-prompt"><span className="prompt-cv">❯</span> cat education.md</p>
          <div className="cv-block">
            <div className="cv-edu-row">
              <img src="/images/tsinghua.webp" alt="" className="cv-logo" />
              <div>
                <h3>M.S. in Electronic Information</h3>
                <p className="cv-meta">Tsinghua University — 2025.09 – Present</p>
                <p className="cv-desc">Researching six-dimensional force sensors. GPA: 3.93/4.0 (top 5%).</p>
              </div>
            </div>
            <div className="cv-edu-row">
              <img src="/images/xiamen.webp" alt="" className="cv-logo" />
              <div>
                <h3>B.S. in Measurement & Control Technology and Instruments</h3>
                <p className="cv-meta">Xiamen University, School of Aeronautics & Astronautics — 2021.09 – 2025.06</p>
                <p className="cv-desc">Ranked 1/35. CET-6 (532).</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Experience ─── */}
        <section className="cv-section">
          <p className="cv-prompt"><span className="prompt-cv">❯</span> cat experience.md</p>
          <Experience />
        </section>

        {/* ─── Awards ─── */}
        <section className="cv-section">
          <p className="cv-prompt"><span className="prompt-cv">❯</span> cat awards.md</p>
          <div className="cv-block">
            <div className="cv-awards-grid">
              <div>
                <h4 className="cv-award-cat">Scholarships</h4>
                <ul className="cv-award-list">
                  <li>National Scholarship (top 3%)</li>
                  <li>Luyan Scholarship (top 3%)</li>
                  <li>BYD Scholarship (top 1%)</li>
                  <li>Academic Excellence Scholarship</li>
                  <li>Academic Innovation Scholarship</li>
                </ul>
              </div>
              <div>
                <h4 className="cv-award-cat">Honors</h4>
                <ul className="cv-award-list">
                  <li>Outstanding Merit Student (top 3%)</li>
                  <li>Outstanding Graduate</li>
                  <li>Outstanding Graduation Design</li>
                  <li>Excellent League Member</li>
                  <li>Military Training Outstanding Trainee</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Projects ─── */}
        <section className="cv-section">
          <p className="cv-prompt"><span className="prompt-cv">❯</span> cat projects.md</p>
          <Projects />
        </section>

        {/* ─── Skills ─── */}
        <section className="cv-section">
          <p className="cv-prompt"><span className="prompt-cv">❯</span> cat skills.md</p>
          <Skills />
        </section>

        {/* ─── Footer prompt ─── */}
        <div className="cv-footer">
          <span className="prompt-cv">❯</span> <span className="blink-cv">_</span>
        </div>
      </div>
    </div>
  )
}
