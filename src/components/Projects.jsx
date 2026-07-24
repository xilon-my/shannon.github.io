import './Projects.css'

const projects = [
  {
    title: 'Project Alpha',
    desc: 'A distributed task queue with fault-tolerant scheduling and real-time monitoring built in Go.',
    tags: ['Go', 'Redis', 'gRPC'],
  },
  {
    title: 'Project Beta',
    desc: 'Developer tool that generates type-safe API clients from OpenAPI specs in multiple languages.',
    tags: ['TypeScript', 'Node.js', 'Codegen'],
  },
  {
    title: 'Project Gamma',
    desc: 'A lightweight monitoring dashboard for containerized workloads with real-time metrics streaming.',
    tags: ['React', 'D3', 'WebSocket'],
  },
]

export default function Projects() {
  return (
    <div className="project-grid">
      {projects.map((p, i) => (
        <div className="project-card" key={i}>
          <h3>{p.title}</h3>
          <p>{p.desc}</p>
          <div className="tags">
            {p.tags.map(t => <span key={t}>{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  )
}
