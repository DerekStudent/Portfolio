import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInView } from './useInView'

const techs = ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'Git', 'Python', 'Node.js', 'Blender', 'Three.js', 'REST APIs', 'VS Code', 'GitHub', 'HMI Design', 'PLC Programming', 'Siemens TIA Portal']

export default function TechStrip() {
  const [sectionRef, inView] = useInView(0.1)
  const stripRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const scrollX = useRef(0)
  const speed = useRef(0.5)
  const targetSpeed = useRef(0.5)
  const hovering = useRef(false)
  const dragging = useRef(false)
  const dragStart = useRef(0)
  const dragScrollStart = useRef(0)
  const lastDragX = useRef(0)
  const velocity = useRef(0)
  const rafId = useRef(null)

  const getHalf = useCallback(() => {
    if (!stripRef.current) return 0
    return stripRef.current.scrollWidth / 2
  }, [])

  useEffect(() => {
    const el = stripRef.current
    if (!el) return

    function tick() {
      if (!paused && !dragging.current) {
        targetSpeed.current = hovering.current ? 0.15 : 0.5
        speed.current += (targetSpeed.current - speed.current) * 0.04
        scrollX.current -= speed.current
      }

      if (!dragging.current && Math.abs(velocity.current) > 0.08) {
        scrollX.current -= velocity.current
        velocity.current *= 0.94
      } else if (!dragging.current) {
        velocity.current = 0
      }

      const half = getHalf()
      if (half > 0) {
        if (scrollX.current <= -half) scrollX.current += half
        if (scrollX.current > 0) scrollX.current -= half
      }

      el.style.transform = `translateX(${scrollX.current}px)`
      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [paused, getHalf])

  const onMouseDown = (e) => {
    dragging.current = true
    dragStart.current = e.clientX
    dragScrollStart.current = scrollX.current
    lastDragX.current = e.clientX
    velocity.current = 0
  }

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging.current) return
      scrollX.current = dragScrollStart.current + (e.clientX - dragStart.current)
      velocity.current = (e.clientX - lastDragX.current) * 0.25
      lastDragX.current = e.clientX
    }
    const onMouseUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const onTouchStart = (e) => {
    dragging.current = true
    dragStart.current = e.touches[0].clientX
    dragScrollStart.current = scrollX.current
    lastDragX.current = e.touches[0].clientX
    velocity.current = 0
  }

  const onTouchMove = (e) => {
    if (!dragging.current) return
    scrollX.current = dragScrollStart.current + (e.touches[0].clientX - dragStart.current)
    velocity.current = (e.touches[0].clientX - lastDragX.current) * 0.25
    lastDragX.current = e.touches[0].clientX
  }

  const onTouchEnd = () => { dragging.current = false }

  const pills = [...techs, ...techs]

  return (
    <section id="tech" className="py-24" ref={sectionRef}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-off-white tracking-tight mb-8"
        >
          Technologies I Work With
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-end mb-4"
        >
          <button
            onClick={() => setPaused(!paused)}
            className={`text-[11px] uppercase tracking-widest font-medium px-4 py-1.5 rounded-md border transition-colors duration-300 ${
              paused
                ? 'border-accent text-accent'
                : 'border-border text-text-muted hover:border-text-muted hover:text-off-white'
            }`}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="overflow-hidden w-full select-none py-3"
        style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
        onMouseEnter={() => { hovering.current = true }}
        onMouseLeave={() => { hovering.current = false }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div ref={stripRef} className="flex gap-3 w-max will-change-transform">
          {pills.map((t, i) => (
            <span
              key={i}
              className="inline-flex items-center px-5 py-2 border border-border rounded-full text-sm text-text-muted font-medium whitespace-nowrap hover:border-border-hover hover:text-text-main hover:bg-bg-elevated transition-all duration-300 shrink-0"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
