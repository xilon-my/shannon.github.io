import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import './Blog.css'

const GITHUB_TOKEN_KEY = 'blog_github_token'
const OWNER = 'xilon-my'
const REPO = 'xilon-my.github.io'
const POSTS_PATH = 'src/posts'

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function makeFrontmatter({ title, date, tags }) {
  const tagStr = tags.length ? `\ntags: [${tags.map(t => `"${t.trim()}"`).join(', ')}]` : ''
  return `---
title: "${title}"
date: ${date}${tagStr}
slug: ${slugify(title)}
---
`
}

function buildMarkdown({ title, date, tags, body }) {
  return makeFrontmatter({ title, date, tags }) + body.trim() + '\n'
}

export default function Write() {
  const [token, setToken] = useState(() => localStorage.getItem(GITHUB_TOKEN_KEY) || '')
  const [title, setTitle] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [body, setBody] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'success'|'error'|'info', message }
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (token) localStorage.setItem(GITHUB_TOKEN_KEY, token)
  }, [token])

  async function publishPost() {
    if (!title.trim()) {
      setStatus({ type: 'error', message: 'Title is required.' })
      return
    }
    if (!body.trim()) {
      setStatus({ type: 'error', message: 'Post body is required.' })
      return
    }
    if (!token.trim()) {
      setStatus({ type: 'error', message: 'GitHub token is required.' })
      return
    }

    setPublishing(true)
    setStatus({ type: 'info', message: 'Publishing...' })

    const today = new Date().toISOString().split('T')[0]
    const content = buildMarkdown({
      title: title.trim(),
      date: today,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      body,
    })

    const slug = slugify(title)
    const path = `${POSTS_PATH}/${slug}.md`
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`

    try {
      // Try to get existing file (for the SHA, if updating)
      let sha = null
      try {
        const getRes = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (getRes.ok) {
          const existing = await getRes.json()
          sha = existing.sha
        }
      } catch {}

      // Commit the new file
      const body = {
        message: sha ? `Update blog post: ${title.trim()}` : `Add blog post: ${title.trim()}`,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: 'main',
      }
      if (sha) body.sha = sha

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to publish')
      }

      setStatus({
        type: 'success',
        message: `Published! The site will update after the next deploy (usually 1–2 min).`,
      })

      // Clear form
      setTitle('')
      setTagsInput('')
      setBody('')
    } catch (e) {
      setStatus({ type: 'error', message: e.message })
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="write-page">
      <h1>Write a Post</h1>

      <div className="write-form">
        <div>
          <div className="write-label">GitHub Token</div>
          <input
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxx"
          />
        </div>

        <div>
          <div className="write-label">Title</div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Post title..."
          />
        </div>

        <div>
          <div className="write-label">Tags (comma separated)</div>
          <input
            type="text"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            placeholder="AI, LLM, Python"
          />
        </div>

        <div>
          <div className="write-label">Body (Markdown)</div>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write your post in markdown..."
          />
        </div>

        <div className="write-actions">
          <button
            className="write-btn write-btn-primary"
            onClick={publishPost}
            disabled={publishing}
          >
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
          <button
            className="write-btn write-btn-secondary"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>

        {status && (
          <div className={`write-status ${status.type}`}>
            {status.message}
          </div>
        )}

        {showPreview && (body || title) && (
          <div className="write-preview">
            <h3>Preview</h3>
            {title && <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 8 }}>{title}</h1>}
            <div className="blog-post-content">
              <Markdown>{body}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
