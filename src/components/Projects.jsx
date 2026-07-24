import './Projects.css'

const projects = [
  {
    title: 'MiniMind LLM',
    desc: 'Reproduced a Decoder-Only Transformer (26M params) with RoPE, GQA, RMSNorm from scratch. Implemented full pipeline: BPE tokenizer training, pre-training, SFT instruction tuning, and RLHF alignment. Extended to multimodal (MiniMind-V).',
    tags: ['PyTorch', 'Transformer', 'LLM', 'SFT', 'RLHF'],
  },
  {
    title: 'CLI Agent',
    desc: 'Built a ReAct-pattern CLI agent with Node.js + TypeScript, supporting tool call, session memory, context compression, todo/plan task management, and permission control. Integrated with Feishu long-connection for unified agent invocation across terminal and IM.',
    tags: ['Node.js', 'TypeScript', 'ReAct', 'Agent', 'Feishu'],
  },
  {
    title: 'Multimodal Document RAG',
    desc: 'Built a multimodal RAG system with RAGAnything + LightRAG + MinerU for parsing text, images, tables from PDFs. Used BGE-Reranker for result re-ranking. Improved context precision from 0.542 to 0.993 and factual correctness from 0.453 to 0.564.',
    tags: ['RAG', 'LLM', 'Embedding', 'Reranker', 'Python'],
  },
  {
    title: 'CFRP Bolt Sensing System',
    desc: 'Designed an intelligent CFRP bolt with embedded CNT eddy current sensors for damage self-diagnosis of bolted composite joints. Published in Polymer Composites (IF 4.7). Granted national invention patent.',
    tags: ['Sensor', 'NDT', 'CFRP', 'Patent', 'Research'],
  },
  {
    title: 'RoboCup Basketball Champion',
    desc: 'Led development of basketball simulation robot. Used radar for real-time field data, camera for landmark tracking, PID control for motion optimization, and filtering for sensor noise reduction. National First Prize.',
    tags: ['Robotics', 'PID', 'Computer Vision', 'Sensor Fusion'],
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
