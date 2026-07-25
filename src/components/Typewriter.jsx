import { useState, useEffect } from 'react'

export default function Typewriter({ text, speed = 40, delay = 0, onDone }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1))
      }, speed)
      return () => clearTimeout(timer)
    } else if (!done) {
      setDone(true)
      onDone?.()
    }
  }, [started, displayed, text, speed, done, onDone])

  return <span>{displayed}<span className={done ? '' : 'type-cursor'}>_</span></span>
}
