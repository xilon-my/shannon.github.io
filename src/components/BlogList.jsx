import { Link } from 'react-router-dom'
import './Blog.css'

// Import all markdown posts at build time
const postModules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true })

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { frontmatter: {}, content: raw }

  const frontmatter = {}
  match[1].split('\n').forEach(line => {
    const sep = line.indexOf(': ')
    if (sep > 0) {
      const key = line.slice(0, sep).trim()
      let val = line.slice(sep + 2).trim()
      if (val.startsWith('[') && val.endsWith(']')) {
        try {
          val = JSON.parse(val.replace(/'/g, '"'))
        } catch {
          val = val.slice(1, -1).split(',').map(v => v.trim()).filter(Boolean)
        }
      }
      frontmatter[key] = val
    }
  })
  return { frontmatter, content: match[2] }
}

export const posts = Object.entries(postModules)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace('.md', '')
    const { frontmatter, content } = parseFrontmatter(raw)
    const excerpt = content.trim().split('\n\n').find(p => p.trim().length > 0)?.replace(/[#*`\[\]]/g, '').slice(0, 200) || ''
    return { slug, ...frontmatter, excerpt, content }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

const categories = ['all', ...new Set(posts.map(p => p.category).filter(Boolean))]

export default function BlogList({ limit, category: activeCategory }) {
  const filtered = activeCategory && activeCategory !== 'all'
    ? posts.filter(p => p.category === activeCategory)
    : posts
  const shown = limit ? filtered.slice(0, limit) : filtered

  if (shown.length === 0) {
    return (
      <div className="blog-empty">
        <div className="icon">&#128221;</div>
        <h3>Coming soon</h3>
        <p>No posts yet in this category.</p>
      </div>
    )
  }

  return (
    <div className="blog-grid">
      {shown.map(post => (
        <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
          <div className="blog-card-meta">
            <time>{post.date}</time>
            {post.category && <span className="blog-category">{post.category}</span>}
            {post.tags?.length > 0 && (
              <div className="blog-card-tags">
                {post.tags.map(t => <span key={t}>{t}</span>)}
              </div>
            )}
          </div>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </Link>
      ))}
    </div>
  )
}

export function BlogFilter({ current, onChange }) {
  return (
    <div className="blog-filter">
      {categories.map(cat => (
        <button
          key={cat}
          className={`blog-filter-btn ${cat === current ? 'active' : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat === 'all' ? 'All' : cat}
        </button>
      ))}
    </div>
  )
}
