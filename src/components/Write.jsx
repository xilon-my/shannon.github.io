import { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Turndown from 'turndown'
import Terminal from './Terminal.jsx'
import './Write.css'

const GITHUB_TOKEN_KEY = 'blog_github_token'
const OWNER = 'xilon-my'
const REPO = 'xilon-my.github.io'
const POSTS_PATH = 'src/posts'

const turndown = new Turndown({ headingStyle: 'atx' })

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
  const [status, setStatus] = useState(null)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (token) localStorage.setItem(GITHUB_TOKEN_KEY, token)
  }, [token])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing...' }),
    ],
    editorProps: {
      attributes: {
        class: 'write-editor',
      },
    },
  })

  const getMarkdown = useCallback(() => {
    if (!editor) return ''
    const html = editor.getHTML()
    return turndown.turndown(html)
  }, [editor])

  async function publishPost() {
    if (!title.trim()) {
      setStatus({ type: 'error', message: 'Title is required.' })
      return
    }

    const body = getMarkdown()
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
        message: 'Published! Site will update after next deploy (1–2 min).',
      })
      setTitle('')
      setTagsInput('')
      editor?.commands.setContent('')
    } catch (e) {
      setStatus({ type: 'error', message: e.message })
    } finally {
      setPublishing(false)
    }
  }

  if (!editor) return null

  return (
    <div className="write-page">
      <Terminal title="shannon@shannon.zone ~/write %">
      <div className="write-meta">
        <div className="write-field">
          <input
            type="password"
            className="write-input write-input-sm"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="GitHub token"
          />
        </div>
        <div className="write-row">
          <div className="write-field write-field-half">
            <input
              type="text"
              className="write-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Post title..."
            />
          </div>
          <div className="write-field write-field-half">
            <input
              type="text"
              className="write-input"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="Tags (comma separated)"
            />
          </div>
        </div>
      </div>

      {/* Floating format menu on text selection */}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }}>
          <div className="bubble-menu">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
              <strong>B</strong>
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
              <em>I</em>
            </button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
              <s>S</s>
            </button>
            <span className="bubble-sep">|</span>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
              H1
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
              H2
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
              H3
            </button>
            <span className="bubble-sep">|</span>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
              • list
            </button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>
              1. list
            </button>
            <span className="bubble-sep">|</span>
            <button onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''}>
              {'<>'}
            </button>
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>
              code block
            </button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>
              ❝ quote
            </button>
          </div>
        </BubbleMenu>
      )}

      <div className="write-editor-wrapper">
        <EditorContent editor={editor} />
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
      </Terminal>
    </div>
  )
}
