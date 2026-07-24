import { useState } from 'react'
import BlogList, { BlogFilter } from '../components/BlogList.jsx'
import './../components/Blog.css'

export default function BlogPage() {
  const [category, setCategory] = useState('all')

  return (
    <div className="blog-page">
      <div className="container">
        <div className="blog-header">
          <p className="blog-prompt"><span className="prompt-cv">❯</span> ls posts/</p>
          <p className="blog-sub">Projects, notes, and things I've learned.</p>
        </div>
        <BlogFilter current={category} onChange={setCategory} />
        <BlogList category={category} />
      </div>
    </div>
  )
}
