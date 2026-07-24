import './Experience.css'

const experiences = [
  {
    date: '2025.09 — Present',
    title: 'M.S. in Electronic Information',
    company: 'Tsinghua University',
    description: 'Research focus on six-dimensional force sensors. GPA: 3.93/4.0 (top 5%).',
    logo: '/images/tsinghua.webp',
  },
  {
    date: '2021.09 — 2025.06',
    title: 'B.S. in Measurement & Control Technology and Instruments',
    company: 'Xiamen University',
    description: 'School of Aeronautics & Astronautics. Ranked 1/35. Awards: National Scholarship, Luyan Scholarship, BYD Scholarship, Academic Excellence Scholarship, Academic Innovation Scholarship. Honors: Outstanding Merit Student, Outstanding Graduate, Outstanding Graduation Design',
    logo: '/images/xiamen.webp',
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
          <h3>
            {j.logo && <img src={j.logo} alt="" className="school-logo" />}
            {j.title} <span className="company">@ {j.company}</span>
          </h3>
          <p>{j.description}</p>
        </div>
      ))}
    </div>
  )
}
