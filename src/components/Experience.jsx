import './Experience.css'

const jobs = [
  {
    date: '2025 — Present',
    title: 'Software Engineer',
    company: 'Company',
    description: 'Building distributed systems and developer tooling at scale.',
  },
  {
    date: '2023 — 2025',
    title: 'Backend Engineer',
    company: 'Startup',
    description: 'Designed and shipped core API services, reduced p99 latency by 40%, and mentored junior engineers.',
  },
  {
    date: '2022 — 2023',
    title: 'Junior Developer',
    company: 'Agency',
    description: 'Full-stack development across multiple client projects. Delivered 10+ production applications.',
  },
]

export default function Experience() {
  return (
    <div className="timeline">
      {jobs.map((j, i) => (
        <div className="timeline-item" key={i}>
          <div className="date">{j.date}</div>
          <h3>{j.title} <span className="company">@ {j.company}</span></h3>
          <p>{j.description}</p>
        </div>
      ))}
    </div>
  )
}
