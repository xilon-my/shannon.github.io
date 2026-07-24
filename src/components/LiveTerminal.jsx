import { useState, useRef, useEffect } from 'react'
import './LiveTerminal.css'

const neofetch = `
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡠⣤⣤⣦⣶⣶⣶⣠⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⢀⣄⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⠀⠀⠀⠀⠀   shannon@shannon.zone
  ⠀⠀⠀⢀⣐⣿⣿⢿⣟⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣭⣿⣻⣷⡄⠀⠀⠀
  ⠀⠀⣠⣿⣿⣿⡿⣫⣷⣶⣯⣻⣿⣿⣿⣿⣿⣿⣿⣻⣾⣿⣷⡽⣿⣿⣆⢀⠀   ─────────────────────
  ⠀⡶⣽⣿⣿⣿⡿⣿⣿⣽⣿⡷⣿⣿⣿⣿⡿⣿⣿⣿⣿⣾⣿⣏⣿⣿⣿⠵⠀   OS         human
  ⠀⠉⠹⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⣿⢿⣿⣯⢿⣿⣿⣿⣭⣷⣿⣿⣿⠃⠀⠀   Host       Tsinghua University
  ⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀   Uptime     22 years
  ⠀⠀⠀⠀⠀⠈⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠁⠀⠀⠀⠀⠀   CPU        brain (2 cores)
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣭⣽⡟⠛⣿⣿⡉⢹⣅⠀⠀⠀⠀⠀⠀⠀⠀⠀   Memory     16 bits
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣽⣗⣭⣿⡶⣻⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀   Status     doing interesting things
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠯⠻⣿⣿⡿⠟⠿⠿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀   Location   Shenzhen, China    
`

const responses = {
  help: `available commands:
  help      show this message
  whoami    about me
  neofetch  system info
  projects  what i've built
  skills    things i work with
  awards    achievements
  github    github profile
  email     email address
  clear     clear terminal
  banner    show the banner`,

  whoami: `Shannon Zhang
M.S. @ Tsinghua University
B.S. @ Xiamen University
Intern @ Huawei
Born 2003.08.24 · ISTP · fitness enthusiast
My wish is to do interesting things.`,

  neofetch: neofetch,

  projects: `- MiniMind LLM: 26M param Transformer from scratch
- CLI Agent: ReAct-pattern agent with tool calling
- Multimodal RAG: PDF parsing + reranking pipeline
- CFRP Bolt Sensor: smart sensing for aerospace composites`,

  skills: `Languages:  Python, TypeScript, C/C++, Node.js
AI/ML:      PyTorch, LLM, RAG, Embedding, Transformer
Hardware:   Altium Designer, NDT, Sensor Design
Tools:      Git, Linux, Docker, React, Figma`,

  awards: `National Scholarship  ·  Luyan Scholarship
BYD Scholarship  ·  Academic Excellence
Outstanding Graduate  ·  Outstanding Merit Student
RoboCup China Open — Basketball Champion`,

  banner: `╔══════════════════════════════╗
║    shannon@shannon.zone      ║
║  ❯ type help for commands    ║
╚══════════════════════════════╝`,
}

export default function LiveTerminal({ compact }) {
  const [history, setHistory] = useState([
    { type: 'output', text: responses.banner },
    { type: 'output', text: 'Type "help" to see available commands.' },
  ])
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [histIndex, setHistIndex] = useState(-1)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [history])

  const runCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    setCommandHistory(h => [...h, trimmed])
    setHistIndex(-1)

    let output
    if (trimmed === 'clear') {
      setHistory([])
      setInput('')
      return
    } else if (responses[trimmed]) {
      output = responses[trimmed]
    } else {
      output = `command not found: ${trimmed}`
    }

    setHistory(h => [...h, { type: 'command', text: cmd }, { type: 'output', text: output }])
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      const newIdx = histIndex === -1 ? commandHistory.length - 1 : Math.max(0, histIndex - 1)
      setHistIndex(newIdx)
      setInput(commandHistory[newIdx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIndex === -1) return
      const newIdx = histIndex + 1
      if (newIdx >= commandHistory.length) {
        setHistIndex(-1)
        setInput('')
      } else {
        setHistIndex(newIdx)
        setInput(commandHistory[newIdx])
      }
    }
  }

  return (
    <div className={"live-terminal" + (compact ? " compact" : "")} onClick={() => inputRef.current?.focus()}>
      <div className="term-output" ref={scrollRef}>
        {history.map((entry, i) => (
          <div key={i} className={entry.type === 'command' ? 'line-cmd' : 'line-out'}>
            {entry.type === 'command' && <span className="prompt-sign">❯ </span>}
            <pre style={{ margin: 0, fontFamily: 'inherit', fontSize: 'inherit', whiteSpace: 'pre-wrap' }}>{entry.text}</pre>
          </div>
        ))}
      </div>
      <div className="term-input-line">
        <span className="prompt-sign">❯ </span>
        <input
          ref={inputRef}
          type="text"
          className="term-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type help..."
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}
