import './Experience.css'

const experiences = [
  {
    date: '2026.06 — Present',
    title: 'Agent Development Intern',
    company: 'Huawei',
    description: 'Quality & Process IT department. Developing intelligent agents for lights-out factory automation within legacy systems.',
  },
  {
    date: '2025.09 — Present',
    title: 'M.S. in Electronic Information',
    company: 'Tsinghua University',
    description: 'Researching six-dimensional force sensors. GPA: 3.93/4.0. Member of the Graduate Student Union Sports Department (研会体育部).',
    logo: '/images/tsinghua.webp',
  },
  {
    date: '2024.09 — 2024.11',
    title: 'Hardware Engineer Intern',
    company: 'Xiamen Kebi Detection Technology',
    description: 'Designed eddy current NDT hardware modules: excitation signal generation, sensing signal acquisition, and signal conditioning circuits.',
  },
  {
    date: '2023.01',
    title: 'Electrical Engineering Intern',
    company: 'Beijing Lingkong Tianxing',
    description: "Participated in a rocket R&D program. Honestly didn't do much — mainly observed and learned about connector standards and cable layout.",
  },
  {
    date: '2021.09 — 2025.06',
    title: 'B.S. in Measurement & Control Technology',
    company: 'Xiamen University',
    description: 'School of Aeronautics & Astronautics. Ranked 1/35. Also served as an Academic Peer Tutor, providing advanced mathematics tutoring for underclassmen.',
    logo: '/images/xiamen.webp',
  },
]

export default function Experience() {
  return (
    <div className="timeline">
      {experiences.map((j, i) => (
        <div className="timeline-item" key={i}>
          <div className="date">{j.date}</div>
          <h3>
            <span className="title-line">{j.title}</span>
            <span className="company">
              {j.logo && <img src={j.logo} alt="" className="school-logo" />}
              @ {j.company}
            </span>
          </h3>
          <p>{j.description}</p>
        </div>
      ))}
    </div>
  )
}
