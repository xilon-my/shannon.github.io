const skills = [
  'Python', 'PyTorch', 'Transformer', 'LLM', 'RAG',
  'Node.js', 'TypeScript', 'React', 'Altium Designer',
  'Origin', 'Visio', 'Adobe Illustrator',
  'Linux', 'Git',
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
