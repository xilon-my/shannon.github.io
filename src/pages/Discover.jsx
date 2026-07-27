import { Link } from 'react-router-dom'
import Terminal from '../components/Terminal.jsx'
import projects from '../data/discover-projects.js'
import './Discover.css'

export default function Discover() {
  return (
    <div className="discover-page">
      <div className="container">
        <Terminal title="shannon@shannon.zone ~/discover %">
          <div className="discover-header">
            <p className="discover-prompt">
              <span className="prompt-cv">❯</span> <span className="typewriter">cat projects-i-like.md</span>
            </p>
            <p className="discover-sub">
              Cool open-source projects I&rsquo;ve come across &mdash; tools, frameworks, and ideas worth sharing.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="discover-empty">
              <p>No projects yet. Come back later!</p>
            </div>
          ) : (
            <div className="discover-grid">
              {projects.map((p, i) => (
                <Link key={p.slug} to={`/discover/${p.slug}`} className="discover-card-link">
                  <article className={`discover-card fade-in fade-in-${Math.min(i + 1, 5)}`}>
                    <div className="discover-card-header">
                      <span className="discover-card-name">
                        {p.name}
                        <span className="discover-card-arrow">↗</span>
                      </span>
                    </div>
                    <div className="discover-card-tags">
                      {p.tags.map(t => <span key={t}>{t}</span>)}
                    </div>
                    <p className="discover-card-desc">{p.description}</p>
                    <p className="discover-card-note">{p.note}</p>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </Terminal>
      </div>
    </div>
  )
}
