import { useState } from 'react'
import { Link } from 'react-router-dom'
import Terminal from '../components/Terminal.jsx'
import projects from '../data/discover-projects.js'
import './Discover.css'

export default function Discover() {
  const [activeTag, setActiveTag] = useState(null)
  const allTags = [...new Set(projects.flatMap(p => p.tags))].sort()
  const filtered = activeTag ? projects.filter(p => p.tags.includes(activeTag)) : projects

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
            <div className="discover-tag-filter">
              <p className="discover-prompt">
                <span className="prompt-cv">❯</span>
                <span className="filter-cmd">cat projects-i-like.md</span>
                {activeTag && <span className="filter-pipe">|</span>}
                {activeTag && <span className="filter-grep">grep</span>}
                <span className={`filter-tag ${activeTag === null ? 'active' : ''}`} onClick={() => setActiveTag(null)}>
                  --all
                </span>
                {allTags.map(t => (
                  <span
                    key={t}
                    className={`filter-tag ${activeTag === t ? 'active' : ''}`}
                    onClick={() => setActiveTag(t)}
                  >
                    --{t.toLowerCase()}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="discover-empty">
              <p>No projects with tag &lsquo;{activeTag}&rsquo;.</p>
            </div>
          ) : (
            <div className="discover-grid" key={activeTag || 'all'}>
              {filtered.map((p, i) => (
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
