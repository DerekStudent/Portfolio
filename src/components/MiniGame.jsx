import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CELL = 18
const COLS = 20
const ROWS = 20
const TICK_MS = 110

const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }

function randomFood(snake) {
  let pos
  do {
    pos = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)]
  } while (snake.some(([x, y]) => x === pos[0] && y === pos[1]))
  return pos
}

function SnakeGame({ onClose }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    snake: [[10, 10], [9, 10], [8, 10]],
    dir: DIR.right,
    nextDir: DIR.right,
    food: [15, 10],
    score: 0,
    gameOver: false,
    started: false,
  })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const tickRef = useRef(null)

  const width = COLS * CELL
  const height = ROWS * CELL

  const reset = useCallback(() => {
    const s = stateRef.current
    s.snake = [[10, 10], [9, 10], [8, 10]]
    s.dir = DIR.right
    s.nextDir = DIR.right
    s.food = randomFood(s.snake)
    s.score = 0
    s.gameOver = false
    s.started = true
    setScore(0)
    setGameOver(false)
    setStarted(true)
  }, [])

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    function draw() {
      const { snake, food, gameOver: go } = stateRef.current

      // Background
      ctx.fillStyle = '#0e0e11'
      ctx.fillRect(0, 0, width, height)

      // Grid dots
      ctx.fillStyle = 'rgba(42,42,48,0.5)'
      for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
          ctx.fillRect(x * CELL + CELL / 2, y * CELL + CELL / 2, 1, 1)
        }
      }

      // Food
      ctx.fillStyle = '#b0b0b8'
      ctx.shadowColor = 'rgba(176,176,184,0.4)'
      ctx.shadowBlur = 8
      const fx = food[0] * CELL + 2
      const fy = food[1] * CELL + 2
      ctx.beginPath()
      ctx.roundRect(fx, fy, CELL - 4, CELL - 4, 3)
      ctx.fill()
      ctx.shadowBlur = 0

      // Snake
      snake.forEach(([sx, sy], i) => {
        const alpha = 1 - (i / snake.length) * 0.5
        if (i === 0) {
          ctx.fillStyle = '#e8e8ec'
          ctx.shadowColor = 'rgba(232,232,236,0.3)'
          ctx.shadowBlur = 6
        } else {
          ctx.fillStyle = `rgba(176,176,184,${alpha})`
          ctx.shadowBlur = 0
        }
        ctx.beginPath()
        ctx.roundRect(sx * CELL + 1, sy * CELL + 1, CELL - 2, CELL - 2, i === 0 ? 4 : 3)
        ctx.fill()
      })
      ctx.shadowBlur = 0

      // Game over overlay
      if (go) {
        ctx.fillStyle = 'rgba(14,14,17,0.75)'
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = '#e8e8ec'
        ctx.font = '600 16px Inter, system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Game Over', width / 2, height / 2 - 12)
        ctx.fillStyle = '#8a8a92'
        ctx.font = '400 11px Inter, system-ui, sans-serif'
        ctx.fillText('Press Space or tap to restart', width / 2, height / 2 + 14)
      }

      if (!stateRef.current.started) {
        ctx.fillStyle = 'rgba(14,14,17,0.6)'
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = '#e8e8ec'
        ctx.font = '600 14px Inter, system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Press Space or tap to start', width / 2, height / 2)
      }
    }

    let rafId
    function loop() {
      draw()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [width, height])

  // Game tick
  useEffect(() => {
    if (!started || gameOver) {
      if (tickRef.current) clearInterval(tickRef.current)
      return
    }

    tickRef.current = setInterval(() => {
      const s = stateRef.current
      if (s.gameOver || !s.started) return

      s.dir = s.nextDir
      const head = [s.snake[0][0] + s.dir[0], s.snake[0][1] + s.dir[1]]

      // Wall collision
      if (head[0] < 0 || head[0] >= COLS || head[1] < 0 || head[1] >= ROWS) {
        s.gameOver = true
        setGameOver(true)
        return
      }

      // Self collision
      if (s.snake.some(([x, y]) => x === head[0] && y === head[1])) {
        s.gameOver = true
        setGameOver(true)
        return
      }

      s.snake.unshift(head)

      if (head[0] === s.food[0] && head[1] === s.food[1]) {
        s.score++
        setScore(s.score)
        s.food = randomFood(s.snake)
      } else {
        s.snake.pop()
      }
    }, TICK_MS)

    return () => clearInterval(tickRef.current)
  }, [started, gameOver])

  // Keyboard controls
  useEffect(() => {
    function onKey(e) {
      const s = stateRef.current

      if (e.code === 'Space') {
        e.preventDefault()
        if (s.gameOver || !s.started) {
          reset()
        }
        return
      }

      if (e.code === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      const keyMap = {
        ArrowUp: 'up', KeyW: 'up',
        ArrowDown: 'down', KeyS: 'down',
        ArrowLeft: 'left', KeyA: 'left',
        ArrowRight: 'right', KeyD: 'right',
      }

      const dirName = keyMap[e.code]
      if (!dirName) return
      e.preventDefault()

      const newDir = DIR[dirName]
      // Prevent reversing
      if (newDir[0] + s.dir[0] === 0 && newDir[1] + s.dir[1] === 0) return
      s.nextDir = newDir
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, reset])

  // Touch / swipe controls
  const touchStart = useRef(null)

  const onTouchStart = (e) => {
    const s = stateRef.current
    if (s.gameOver || !s.started) {
      reset()
      return
    }
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const onTouchEnd = (e) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null

    if (Math.abs(dx) < 15 && Math.abs(dy) < 15) return

    const s = stateRef.current
    let newDir
    if (Math.abs(dx) > Math.abs(dy)) {
      newDir = dx > 0 ? DIR.right : DIR.left
    } else {
      newDir = dy > 0 ? DIR.down : DIR.up
    }
    if (newDir[0] + s.dir[0] === 0 && newDir[1] + s.dir[1] === 0) return
    s.nextDir = newDir
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Header */}
      <div className="flex items-center justify-between w-full" style={{ maxWidth: width }}>
        <div className="flex items-center gap-3">
          <h3 className="text-off-white text-sm font-semibold tracking-wide">Snake</h3>
          <span className="text-text-dim text-[11px] tracking-wider uppercase">Score: {score}</span>
        </div>
        <button
          onClick={onClose}
          className="text-text-dim hover:text-text-main transition-colors duration-200 text-xs tracking-wider uppercase flex items-center gap-1.5"
        >
          <span>Esc</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Canvas */}
      <div
        className="rounded-xl border border-border overflow-hidden"
        style={{ width, height }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <canvas
          ref={canvasRef}
          style={{ width, height, display: 'block' }}
        />
      </div>

      {/* Controls hint */}
      <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.14em] text-text-dim font-medium">
        <span>WASD / Arrows to move</span>
        <span className="w-px h-3 bg-border" />
        <span>Space to start / restart</span>
      </div>
    </div>
  )
}

export default function MiniGame() {
  const [open, setOpen] = useState(false)
  const [showGame, setShowGame] = useState(false)

  const handleOpen = () => {
    setOpen(true)
    // Wait for the wipe animation to complete before showing game
    setTimeout(() => setShowGame(true), 700)
  }

  const handleClose = () => {
    setShowGame(false)
    setTimeout(() => setOpen(false), 400)
  }

  return (
    <>
      {/* Floating button — bottom-right corner */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-[9000] w-11 h-11 rounded-xl bg-bg-card/80 backdrop-blur-md border border-border hover:border-border-hover hover:bg-surface transition-all duration-300 flex items-center justify-center group shadow-lg shadow-black/30"
            aria-label="Open mini-game"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-dim group-hover:text-accent transition-colors duration-300"
            >
              <path d="M6 12h4m-2-2v4" />
              <circle cx="17" cy="10" r="1" fill="currentColor" stroke="none" />
              <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
              <rect x="2" y="4" width="20" height="16" rx="4" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Wipe overlay + Game */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9500] flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {/* Wipe panel — slides from right */}
            <motion.div
              className="absolute inset-0 bg-[#0e0e11]"
              initial={{ clipPath: 'circle(0% at calc(100% - 30px) calc(100% - 30px))' }}
              animate={{ clipPath: 'circle(150% at calc(100% - 30px) calc(100% - 30px))' }}
              exit={{ clipPath: 'circle(0% at calc(100% - 30px) calc(100% - 30px))' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Subtle backdrop blur underlay */}
            <motion.div
              className="absolute inset-0 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />

            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(42,42,48,0.15) 0%, transparent 70%)',
              }}
            />

            {/* Game content */}
            <AnimatePresence>
              {showGame && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10"
                >
                  <SnakeGame onClose={handleClose} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
