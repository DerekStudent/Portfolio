import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [visible, setVisible] = useState(true)
  const canvasRef = useRef(null)

  const finish = useCallback(() => {
    setVisible(false)
    setTimeout(onComplete, 700)
  }, [onComplete])

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

    const fontSize = Math.min(w * 0.14, 150)

    // --- Sample edge pixels from rendered text ---
    const offscreen = document.createElement('canvas')
    offscreen.width = w * dpr
    offscreen.height = h * dpr
    const oc = offscreen.getContext('2d')
    oc.setTransform(dpr, 0, 0, dpr, 0, 0)
    oc.font = `800 ${fontSize}px Inter, system-ui, sans-serif`
    oc.textAlign = 'center'
    oc.textBaseline = 'middle'
    oc.fillStyle = '#fff'
    oc.fillText('DEREK', w / 2, h / 2)

    const imgData = oc.getImageData(0, 0, w * dpr, h * dpr).data
    const step = Math.round(2 * dpr)
    const edgePoints = []

    for (let y = 0; y < h * dpr; y += step) {
      for (let x = 0; x < w * dpr; x += step) {
        const i = (y * w * dpr + x) * 4
        if (imgData[i + 3] > 128) {
          const check = [
            [x - step, y], [x + step, y], [x, y - step], [x, y + step]
          ]
          const isEdge = check.some(([cx, cy]) => {
            if (cx < 0 || cy < 0 || cx >= w * dpr || cy >= h * dpr) return true
            return imgData[(cy * w * dpr + cx) * 4 + 3] <= 128
          })
          if (isEdge) edgePoints.push({ x: x / dpr, y: y / dpr })
        }
      }
    }

    // --- Sort edge points per-letter for clean tracing (no cross-letter jumps) ---
    const letterStr = 'DEREK'
    const letterWidths = []
    let totalTextW = 0
    for (const ch of letterStr) {
      const m = oc.measureText(ch)
      letterWidths.push(m.width)
      totalTextW += m.width
    }
    const textStartX = w / 2 - totalTextW / 2
    let runningX = textStartX
    const letterRanges = letterWidths.map((lw) => {
      const range = { left: runningX - 6, right: runningX + lw + 6 }
      runningX += lw
      return range
    })

    // Bucket points by letter
    const letterBuckets = letterRanges.map(() => [])
    for (const pt of edgePoints) {
      for (let li = 0; li < letterRanges.length; li++) {
        if (pt.x >= letterRanges[li].left && pt.x < letterRanges[li].right) {
          letterBuckets[li].push(pt)
          break
        }
      }
    }

    // Nearest-neighbor path per letter, starting from top-left of each letter
    const path = []
    for (const pts of letterBuckets) {
      if (pts.length === 0) continue
      let startIdx = 0
      let minVal = Infinity
      for (let i = 0; i < pts.length; i++) {
        const v = pts[i].y * 10000 + pts[i].x
        if (v < minVal) { minVal = v; startIdx = i }
      }
      const used = new Uint8Array(pts.length)
      let ci = startIdx
      path.push(pts[ci])
      used[ci] = 1
      const maxPts = Math.min(pts.length, 300)

      for (let s = 1; s < maxPts; s++) {
        let bestIdx = -1
        let bestDist = Infinity
        const cx = pts[ci].x
        const cy = pts[ci].y
        for (let j = 0; j < pts.length; j++) {
          if (used[j]) continue
          const d = (pts[j].x - cx) ** 2 + (pts[j].y - cy) ** 2
          if (d < bestDist) { bestDist = d; bestIdx = j }
        }
        if (bestIdx === -1) break
        if (bestDist > 500) break // don't jump far
        ci = bestIdx
        path.push(pts[bestIdx])
        used[bestIdx] = 1
      }
    }

    // --- Animation state ---
    const total = path.length
    let progress = 0
    const speed = 3
    let holdFrames = 0
    let traceComplete = false
    let done = false
    let id

    // Record which segments have been traced
    const tracedCount = { value: 0 }

    // Mouse position for hover reveal after trace completes
    const mouse = { x: -1000, y: -1000 }
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    canvas.addEventListener('mousemove', onMouseMove)

    // Spark particles
    const sparks = []

    function draw() {
      // Clear to background
      ctx.fillStyle = '#0e0e11'
      ctx.fillRect(0, 0, w, h)

      if (!traceComplete) {
        progress = Math.min(progress + speed, total)
      }
      const idx = Math.floor(progress)
      tracedCount.value = Math.max(tracedCount.value, idx)

      ctx.lineCap = 'round'

      if (traceComplete) {
        // === POST-TRACE: dim outline that lights up on hover ===
        for (let i = 0; i < tracedCount.value && i < path.length - 1; i++) {
          const a = path[i]
          const b = path[i + 1]
          const mx = (a.x + b.x) / 2
          const my = (a.y + b.y) / 2
          const dist = Math.sqrt((mouse.x - mx) ** 2 + (mouse.y - my) ** 2)
          const radius = 120
          const brightness = Math.max(0.06, 1 - dist / radius)
          const alpha = Math.min(brightness, 0.95)

          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(232,232,236,${alpha})`
          ctx.lineWidth = brightness > 0.3 ? 2 : 1
          ctx.stroke()

          if (brightness > 0.5) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(255,255,255,${(brightness - 0.5) * 0.25})`
            ctx.lineWidth = 5
            ctx.stroke()
          }
        }

        // Subtle radial glow at cursor
        if (mouse.x > 0 && mouse.y > 0) {
          const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120)
          grd.addColorStop(0, 'rgba(176,176,184,0.05)')
          grd.addColorStop(1, 'rgba(176,176,184,0)')
          ctx.beginPath()
          ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()
        }

        holdFrames++

        // "hover to reveal" hint
        const hintAlpha = Math.min(Math.max((holdFrames - 40) / 30, 0), 0.45)
        if (hintAlpha > 0) {
          ctx.save()
          ctx.globalAlpha = hintAlpha
          ctx.font = '400 12px Inter, system-ui, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillStyle = '#5c5c64'
          ctx.fillText('hover to reveal', w / 2, h / 2 + fontSize * 0.55 + 35)
          ctx.restore()
        }

        // Auto-dismiss after ~3.5 seconds
        if (holdFrames > 210) {
          done = true
          finish()
        }
      } else {
        // === DURING TRACE ===

        // Draw the faint permanent trail of already-traced segments
        for (let i = 0; i < tracedCount.value && i < path.length - 1; i++) {
          const a = path[i]
          const b = path[i + 1]
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = 'rgba(176,176,184,0.12)'
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // Active bolt with glowing tail
        if (idx < total && path.length > 1) {
          const tailLen = 50
          const start = Math.max(0, idx - tailLen)

          for (let i = start; i < idx && i < path.length - 1; i++) {
            const a = path[i]
            const b = path[i + 1]
            const age = (idx - i) / tailLen
            const alpha = Math.max(0, 1 - age)
            const jx = (Math.random() - 0.5) * 1.5
            const jy = (Math.random() - 0.5) * 1.5

            // Core bolt line
            ctx.beginPath()
            ctx.moveTo(a.x + jx, a.y + jy)
            ctx.lineTo(b.x + jx, b.y + jy)
            ctx.strokeStyle = `rgba(232,232,236,${alpha * 0.9})`
            ctx.lineWidth = 2
            ctx.stroke()

            // Outer glow
            if (alpha > 0.4) {
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.18})`
              ctx.lineWidth = 5
              ctx.stroke()
            }
          }

          // Bolt tip glow
          const tip = path[Math.min(idx, path.length - 1)]
          const grd = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 18)
          grd.addColorStop(0, 'rgba(255,255,255,0.5)')
          grd.addColorStop(0.4, 'rgba(200,200,210,0.1)')
          grd.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.beginPath()
          ctx.arc(tip.x, tip.y, 18, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()

          // Bright core dot
          ctx.beginPath()
          ctx.arc(tip.x, tip.y, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = '#fff'
          ctx.fill()

          // Sparks
          if (Math.random() < 0.45) {
            const angle = Math.random() * Math.PI * 2
            const spd = 0.4 + Math.random() * 1.5
            sparks.push({
              x: tip.x, y: tip.y,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              life: 1,
              decay: 0.025 + Math.random() * 0.03,
            })
          }
        }

        // Check if trace just completed
        if (progress >= total) {
          traceComplete = true
        }
      }

      // Update & draw sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.life -= s.decay
        if (s.life <= 0) { sparks.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(s.x, s.y, 1.2 * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(210,210,216,${s.life * 0.6})`
        ctx.fill()
      }

      if (!done) {
        id = requestAnimationFrame(draw)
      }
    }

    ctx.fillStyle = '#0e0e11'
    ctx.fillRect(0, 0, w, h)
    id = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(id)
      canvas.removeEventListener('mousemove', onMouseMove)
    }
  }, [finish])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[10000] bg-bg"
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
