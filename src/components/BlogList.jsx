import './BlogList.css'

const posts = []

export default function BlogList() {
  if (posts.length === 0) {
    return (
      <div className="blog-list">
        <div className="blog-empty">
          <div className="icon">📝</div>
          <h3>Coming soon</h3>
          <p>I&apos;m working on my first posts — check back soon!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-list">
      {posts.map((post, i) => (
        <article className="blog-item" key={i}>
          <div className="date">{post.date}</div>
          <div className="content">
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            {post.tags && (
              <div className="tags">
                {post.tags.map(t => <span key={t}>{t}</span>)}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
