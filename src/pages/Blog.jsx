import BlogList from '../components/BlogList.jsx'
import './../components/Blog.css'

export default function BlogPage() {
  return (
    <div className="blog-page">
      <div className="container">
        <div className="blog-header">
          <h1>Blog</h1>
          <p>Thoughts on AI, engineering, and building things.</p>
        </div>
        <BlogList />
      </div>
    </div>
  )
}
