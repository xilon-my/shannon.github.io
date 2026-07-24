import './Experience.css'

const experiences = [
  {
    date: '2025.09 — Present',
    title: 'M.S. in Electronic Information',
    company: 'Tsinghua University',
    description: 'Shenzhen International Graduate School. GPA: 3.93/4.0 (top 5%). Research focus on AI, large language models, and intelligent instrumentation.',
  },
  {
    date: '2021.09 — 2025.06',
    title: 'B.S. in Measurement & Control Technology',
    company: 'Xiamen University',
    description: 'School of Aeronautics & Astronautics. GPA: 3.78/4.0 (ranked 1/35). National Scholarship winner. CET-6 (532). Outstanding Graduate & Outstanding Graduation Design.',
  },
  {
    date: '2024.09 — 2024.11',
    title: 'Hardware Engineer Intern',
    company: 'Xiamen Kebi Detection Technology',
    description: 'Designed eddy current NDT hardware modules including excitation signal generation, sensing signal acquisition, and signal conditioning circuits. Completed schematic design and PCB layout with Altium Designer.',
  },
  {
    date: '2023.01',
    title: 'Electrical Team Member',
    company: 'Beijing Lingkong Tianxing',
    description: 'Participated in rocket R&D program. Mastered connector types and interface standards for reliable signal transmission. Used Capital software for cable layout drawing and testing.',
  },
  {
    date: '2024.09 — 2025.01',
    title: 'Academic Peer Tutor',
    company: 'Xiamen University',
    description: 'Provided advanced mathematics tutoring for underclassmen, helping improve learning efficiency and exam performance.',
  },
]

export default function Experience() {
  return (
    <div className="timeline">
      {experiences.map((j, i) => (
        <div className="timeline-item" key={i}>
          <div className="date">{j.date}</div>
          <h3>{j.title} <span className="company">@ {j.company}</span></h3>
          <p>{j.description}</p>
        </div>
      ))}
    </div>
  )
}
