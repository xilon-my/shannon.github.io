const skills = [
  'Go', 'TypeScript', 'Python', 'React', 'Node.js',
  'PostgreSQL', 'Kubernetes', 'Docker', 'Rust',
  'Linux', 'GCP', 'Git',
]

export default function Skills() {
  return (
    <div className="skills">
      <h3>Things I work with</h3>
      <div className="skill-tags">
        {skills.map(s => <span key={s}>{s}</span>)}
      </div>
    </div>
  )
}
