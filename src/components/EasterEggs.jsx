import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ═══════════════════════════════════════════
// 1. KONAMI CODE → Silver Matrix Rain
// ═══════════════════════════════════════════
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA']

function MatrixRain({ onComplete }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const chars = 'DEREK01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]<>/\\|=+-*&^%$#@!~'
    const colW = 16
    const cols = Math.ceil(w / colW)
    const drops = new Float32Array(cols)
    const speeds = new Float32Array(cols)
    for (let i = 0; i < cols; i++) {
      drops[i] = Math.random() * -50
      speeds[i] = 0.3 + Math.random() * 0.7
    }

    let frame = 0
    let fadeOut = false
    let fadeAlpha = 1
    let id

    function draw() {
      frame++

      ctx.fillStyle = 'rgba(14,14,17,0.08)'
      ctx.fillRect(0, 0, w, h)

      ctx.font = '13px monospace'
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * colW
        if (y > 0 && y < h) {
          const char = chars[Math.floor(Math.random() * chars.length)]
          // Head of the column — bright white
          const headAlpha = fadeOut ? fadeAlpha : 1
          ctx.fillStyle = `rgba(232,232,236,${0.9 * headAlpha})`
          ctx.fillText(char, i * colW, y)
          // Previous chars — silver trail
          const trailChar = chars[Math.floor(Math.random() * chars.length)]
          ctx.fillStyle = `rgba(176,176,184,${0.3 * headAlpha})`
          ctx.fillText(trailChar, i * colW, y - colW)
        }
        drops[i] += speeds[i]
        if (drops[i] * colW > h + 50) {
          drops[i] = Math.random() * -20
        }
      }

      // After 3 seconds, start fading
      if (frame > 180 && !fadeOut) fadeOut = true
      if (fadeOut) {
        fadeAlpha -= 0.015
        ctx.fillStyle = `rgba(14,14,17,${0.05})`
        ctx.fillRect(0, 0, w, h)
      }
      if (fadeAlpha <= 0) {
        onComplete()
        return
      }

      id = requestAnimationFrame(draw)
    }

    // Initial black fill
    ctx.fillStyle = '#0e0e11'
    ctx.fillRect(0, 0, w, h)
    id = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(id)
  }, [onComplete])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}

// ═══════════════════════════════════════════
// 2. SECRET TERMINAL (backtick key)
// ═══════════════════════════════════════════
const TERMINAL_COMMANDS = {
  help: () => [
    '  help          — show this list',
    '  about         — who is Derek?',
    '  skills        — list skills',
    '  contact       — contact info',
    '  projects      — list projects',
    '  sudo          — ???',
    '  clear         — clear terminal',
    '  exit          — close terminal',
    '  matrix        — just try it',
    '  coffee        — essential command',
  ],
  about: () => [
    '  Name:     Derek',
    '  Role:     Software Developer & Student',
    '  Location: The Netherlands',
    '  Hobby:    Blender 3D Modeling (2+ years)',
    '  Focus:    Full-Stack Development, HMI/PLC',
  ],
  skills: () => [
    '  ┌─────────────────────────────────────┐',
    '  │ HTML · CSS · JavaScript · PHP       │',
    '  │ MySQL · Python · Node.js · Git      │',
    '  │ Blender · Three.js · REST APIs      │',
    '  │ HMI Design · PLC · Siemens TIA      │',
    '  └─────────────────────────────────────┘',
  ],
  contact: () => [
    '  📧  Check the contact section below',
    '  🐙  github.com/DerekStudent',
  ],
  projects: () => [
    '  [1] Beer Dashboard — Full-stack internal tool',
    '      PHP · MySQL · JavaScript · REST API',
    '      Solar monitoring, weather, AI analysis',
    '',
    '  [2] Portfolio — This website',
    '      React · Tailwind · Framer Motion · Three.js',
    '      ...with easter eggs 👀',
  ],
  sudo: () => [
    '  ⚠️  Permission denied.',
    '  Derek is not in the sudoers file.',
    '  This incident will be reported. 🚨',
    '',
    '  (just kidding)',
  ],
  whoami: () => ['  derek'],
  date: () => [`  ${new Date().toLocaleString()}`],
  echo: (args) => [`  ${args || ''}`],
  coffee: () => [
    '        ( (',
    '         ) )',
    '      ........',
    '      |      |]',
    '      \\      /',
    '       `----\'',
    '  ☕ Coffee is brewing...',
    '  Error: cup.isEmpty === true',
  ],
  matrix: () => ['  Initiating matrix rain...', '  (hint: ↑↑↓↓←→←→BA)'],
  pwd: () => ['  /home/derek/portfolio'],
  ls: () => [
    '  drwxr-xr-x  src/',
    '  drwxr-xr-x  public/',
    '  -rw-r--r--  package.json',
    '  -rw-r--r--  README.md',
    '  -rw-r--r--  tailwind.config.js',
    '  -rw-r--r--  vite.config.js',
  ],
  neofetch: () => [
    '        ████████          derek@portfolio',
    '      ██        ██        ──────────────────',
    '    ██    ████    ██      OS: React 18 + Vite',
    '    ██  ██    ██  ██      Theme: Charcoal & Silver',
    '    ██    ████    ██      Shell: /bin/easter-egg',
    '      ██        ██        Terminal: Portfolio v1.0',
    '        ████████          Uptime: since 2023',
  ],
}

function SecretTerminal({ open, onClose }) {
  const [history, setHistory] = useState([
    { type: 'output', lines: [
      '  ╔═══════════════════════════════════════╗',
      '  ║   Derek\'s Secret Terminal v1.0        ║',
      '  ║   Type "help" for available commands  ║',
      '  ╚═══════════════════════════════════════╝',
      '',
    ]},
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const [triggerMatrix, setTriggerMatrix] = useState(false)

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  const handleSubmit = (e) => {
    e.preventDefault()
    const cmd = input.trim().toLowerCase()
    const parts = cmd.split(' ')
    const base = parts[0]
    const args = parts.slice(1).join(' ')

    const newHistory = [...history, { type: 'input', text: input }]

    if (base === 'clear') {
      setHistory([])
      setInput('')
      return
    }
    if (base === 'exit') {
      onClose()
      setInput('')
      return
    }
    if (base === 'matrix') {
      newHistory.push({ type: 'output', lines: TERMINAL_COMMANDS.matrix() })
      setHistory(newHistory)
      setInput('')
      setTimeout(() => setTriggerMatrix(true), 800)
      return
    }

    const handler = TERMINAL_COMMANDS[base]
    if (handler) {
      newHistory.push({ type: 'output', lines: handler(args) })
    } else if (base) {
      newHistory.push({ type: 'output', lines: [`  command not found: ${base}`, '  Type "help" for available commands'] })
    }

    setHistory(newHistory)
    setInput('')
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-16 right-6 z-[9990] w-[min(480px,calc(100vw-3rem))] rounded-xl border border-border overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-[10px] text-text-dim ml-2 tracking-wider">derek@portfolio:~</span>
              </div>
              <button onClick={onClose} className="text-text-dim hover:text-text-main transition-colors text-xs">✕</button>
            </div>

            {/* Terminal body */}
            <div
              ref={scrollRef}
              className="bg-[#0a0a0d] p-4 h-[320px] overflow-y-auto font-mono text-[12px] leading-relaxed"
            >
              {history.map((entry, i) => (
                <div key={i}>
                  {entry.type === 'input' ? (
                    <div className="flex gap-2">
                      <span className="text-accent shrink-0">❯</span>
                      <span className="text-off-white">{entry.text}</span>
                    </div>
                  ) : (
                    entry.lines.map((line, j) => (
                      <div key={j} className="text-text-muted whitespace-pre">{line}</div>
                    ))
                  )}
                </div>
              ))}

              {/* Input line */}
              <form onSubmit={handleSubmit} className="flex gap-2 mt-1">
                <span className="text-accent shrink-0">❯</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-off-white outline-none caret-accent"
                  spellCheck={false}
                  autoComplete="off"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {triggerMatrix && (
        <MatrixRain onComplete={() => setTriggerMatrix(false)} />
      )}
    </>
  )
}

// ═══════════════════════════════════════════
// 3. LOGO RAPID CLICK → Hacker mode flash
// ═══════════════════════════════════════════
function useLogoClickTracker() {
  const clicks = useRef([])
  const [hacking, setHacking] = useState(false)

  const handleClick = useCallback(() => {
    const now = Date.now()
    clicks.current.push(now)
    // Keep only clicks in the last 2 seconds
    clicks.current = clicks.current.filter(t => now - t < 2000)

    if (clicks.current.length >= 5 && !hacking) {
      setHacking(true)
      clicks.current = []
      setTimeout(() => setHacking(false), 2500)
    }
  }, [hacking])

  return { handleClick, hacking }
}

export function HackerOverlay({ active }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const lines = [
      'ACCESSING MAINFRAME...',
      '> ssh derek@portfolio.dev',
      '> Password: ********',
      '> Connection established.',
      '> Downloading secrets...',
      '> [████████████████████] 100%',
      '> ACCESS GRANTED',
      '',
      '> Just kidding. Nice find! 🎉',
    ]

    let frame = 0
    let lineIdx = 0
    let charIdx = 0
    let id

    function draw() {
      frame++

      // Scanline effect
      ctx.fillStyle = 'rgba(14,14,17,0.15)'
      ctx.fillRect(0, 0, w, h)

      // Scanlines
      ctx.fillStyle = 'rgba(176,176,184,0.02)'
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1)
      }

      // Draw typed text
      ctx.font = '14px monospace'
      const startY = h / 2 - lines.length * 10
      for (let i = 0; i <= lineIdx && i < lines.length; i++) {
        const text = i < lineIdx ? lines[i] : lines[i].substring(0, charIdx)
        ctx.fillStyle = i === lineIdx ? 'rgba(232,232,236,0.9)' : 'rgba(176,176,184,0.6)'
        ctx.fillText(text, 40, startY + i * 22)
      }

      // Blinking cursor
      if (Math.floor(frame / 15) % 2 === 0 && lineIdx < lines.length) {
        const cursorX = 40 + ctx.measureText(lines[lineIdx]?.substring(0, charIdx) || '').width
        ctx.fillStyle = 'rgba(232,232,236,0.8)'
        ctx.fillRect(cursorX + 2, startY + lineIdx * 22 - 12, 8, 16)
      }

      // Advance text
      if (frame % 2 === 0 && lineIdx < lines.length) {
        charIdx++
        if (charIdx > (lines[lineIdx]?.length || 0)) {
          lineIdx++
          charIdx = 0
        }
      }

      id = requestAnimationFrame(draw)
    }

    ctx.fillStyle = '#0e0e11'
    ctx.fillRect(0, 0, w, h)
    id = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(id)
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9997]"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════
// 4. CONSOLE EASTER EGG (runs once on mount)
// ═══════════════════════════════════════════
let consoleEasterEggFired = false

function useConsoleEasterEgg() {
  useEffect(() => {
    if (consoleEasterEggFired) return
    consoleEasterEggFired = true

    const styles = {
      big: 'font-size:20px;font-weight:800;color:#e8e8ec;text-shadow:0 0 10px rgba(176,176,184,0.3)',
      sub: 'font-size:12px;color:#8a8a92;font-style:italic',
      info: 'font-size:11px;color:#b0b0b8',
      warn: 'font-size:11px;color:#e8e8ec;background:#222228;padding:4px 8px;border-radius:4px',
    }

    console.log('%c🔍 You found the console!', styles.big)
    console.log('%cNice — you clearly know what you\'re doing.', styles.sub)
    console.log('')
    console.log('%c┌──────────────────────────────────────────┐', styles.info)
    console.log('%c│  Built with React, Tailwind, Three.js    │', styles.info)
    console.log('%c│  + Framer Motion, Vite, and ☕ coffee    │', styles.info)
    console.log('%c│                                          │', styles.info)
    console.log('%c│  Try pressing the backtick key (`)       │', styles.info)
    console.log('%c│  Or the Konami Code ↑↑↓↓←→←→BA          │', styles.info)
    console.log('%c│  Or click the logo 5 times fast...       │', styles.info)
    console.log('%c└──────────────────────────────────────────┘', styles.info)
    console.log('')
    console.log('%c💼 Interested? Let\'s connect!', styles.warn)
  }, [])
}

// ═══════════════════════════════════════════
// MAIN EASTER EGGS COMPONENT
// ═══════════════════════════════════════════
export function useLogoEasterEgg() {
  return useLogoClickTracker()
}

export default function EasterEggs() {
  const [matrixActive, setMatrixActive] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)

  // Console art
  useConsoleEasterEgg()

  // Konami Code detection
  useEffect(() => {
    let seq = 0
    function onKey(e) {
      if (e.code === KONAMI[seq]) {
        seq++
        if (seq === KONAMI.length) {
          seq = 0
          setMatrixActive(true)
        }
      } else {
        seq = 0
      }

      // Backtick opens terminal
      if (e.code === 'Backquote' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault()
        setTerminalOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {matrixActive && (
        <MatrixRain onComplete={() => setMatrixActive(false)} />
      )}
      <SecretTerminal
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />
    </>
  )
}
