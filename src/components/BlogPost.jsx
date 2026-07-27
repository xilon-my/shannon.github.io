import { Link, useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import hljs from 'highlight.js'
import './Blog.css'

function CodeBlock({ className, children }) {
  const lang = className?.replace('language-', '') || ''
  const code = String(children).replace(/\n$/, '')

  if (lang === 'markdown') {
    const fm = code.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (fm) {
      const yamlHtml = hljs.highlight(fm[1], { language: 'yaml' }).value
      const mdHtml = hljs.highlight(fm[2], { language: 'markdown' }).value
      return <code className={className} dangerouslySetInnerHTML={{
        __html: `---\n${yamlHtml}\n---\n\n${mdHtml}`
      }} />
    }
  }

  if (lang && hljs.getLanguage(lang)) {
    return <code className={className} dangerouslySetInnerHTML={{
      __html: hljs.highlight(code, { language: lang }).value
    }} />
  }

  return <code className={className}>{children}</code>
}

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
          // unquoted tags like [LLM, PyTorch, AI]
          val = val.slice(1, -1).split(',').map(v => v.trim()).filter(Boolean)
        }
      }
      frontmatter[key] = val
    }
  })
  return { frontmatter, content: match[2] }
}

const posts = Object.fromEntries(
  Object.entries(postModules).map(([path, raw]) => {
    const slug = path.split('/').pop().replace('.md', '')
    const { frontmatter, content } = parseFrontmatter(raw)
    return [slug, { slug, ...frontmatter, content }]
  })
)

export default function BlogPost() {
  const { slug } = useParams()
  const post = posts[slug]

  if (!post) {
    return (
      <div className="blog-post-page">
        <Link to="/blog" className="blog-post-back">&larr; Back to blog</Link>
        <div className="blog-empty">
          <div className="icon">&#128533;</div>
          <h3>Post not found</h3>
          <p>The article you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  return (
    <article className="blog-post-page">
      <Link to="/blog" className="blog-post-back">&larr; Back to blog</Link>
      <header className="blog-post-header">
        <h1>{post.title}</h1>
        <div className="blog-post-meta">
          <time>{post.date}</time>
          {post.tags?.map(t => <span key={t} className="blog-card-tags" style={{ display: 'inline' }}>
            <span style={{
              background: 'var(--accent-light)',
              color: 'var(--accent-dark)',
              fontSize: '0.7rem',
              fontWeight: 500,
              padding: '2px 10px',
              borderRadius: 999,
            }}>{t}</span>
          </span>)}
        </div>
      </header>
      <div className="blog-post-content">
        <Markdown components={{ code: CodeBlock }}>{post.content}</Markdown>
      </div>
    </article>
  )
}
