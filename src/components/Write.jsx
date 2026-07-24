import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import './Write.css'

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
  const [status, setStatus] = useState(null)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (token) localStorage.setItem(GITHUB_TOKEN_KEY, token)
  }, [token])

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', 'light')
  }, [])

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
      body: body.trim(),
    })

    const slug = slugify(title)
    const path = `${POSTS_PATH}/${slug}.md`
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`

    try {
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

      const reqBody = {
        message: sha ? `Update blog post: ${title.trim()}` : `Add blog post: ${title.trim()}`,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: 'main',
      }
      if (sha) reqBody.sha = sha

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to publish')
      }

      setStatus({
        type: 'success',
        message: 'Published! The site will update after the next deploy (usually 1–2 min).',
      })
      setTitle('')
      setTagsInput('')
      setBody('')
    } catch (e) {
      setStatus({ type: 'error', message: e.message })
    } finally {
      setPublishing(false)
    }
  }

  const handleEditorChange = (value) => {
    setBody(value || '')
  }

  return (
    <div className="write-page">
      <h1 className="write-page-title">Write a Post</h1>

      <div className="write-form">
        <div className="write-field">
          <label className="write-label">GitHub Token</label>
          <input
            type="password"
            className="write-input"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="github_px_xxxxxxxxxxxxxxxxxxxx"
          />
        </div>

        <div className="write-row">
          <div className="write-field" style={{ flex: 1 }}>
            <label className="write-label">Title</label>
            <input
              type="text"
              className="write-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Post title..."
            />
          </div>
          <div className="write-field" style={{ flex: 1 }}>
            <label className="write-label">Tags (comma separated)</label>
            <input
              type="text"
              className="write-input"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="AI, LLM, Python"
            />
          </div>
        </div>

        <div className="write-field">
          <label className="write-label">Content</label>
          <div className="write-editor-wrapper">
            <MDEditor
              value={body}
              onChange={handleEditorChange}
              preview="live"
              height={500}
              visibleDragbar={false}
            />
          </div>
        </div>

        <div className="write-actions">
          <button
            className="write-btn write-btn-primary"
            onClick={publishPost}
            disabled={publishing}
          >
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>

        {status && (
          <div className={`write-status ${status.type}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  )
}
