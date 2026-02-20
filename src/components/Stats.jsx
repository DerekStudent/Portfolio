import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from './useInView'

const stats = [
  { label: 'Projects Built', value: 8, suffix: '+' },
  { label: 'Technologies', value: 16, suffix: '' },
  { label: 'Cups of Coffee', value: 842, suffix: '' },
  { label: 'GitHub Commits', value: 200, suffix: '+' },
]

function Counter({ target, duration = 2000, active }) {
  const [count, setCount] = useState(0)
  const startTime = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!active) return
    startTime.current = performance.now()

    function animate(now) {
      const elapsed = now - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, target, duration])

  return <>{count}</>
}

export default function Stats() {
  const [ref, inView] = useInView(0.3)

  return (
    <section className="py-16 px-6 md:px-10 max-w-[1100px] mx-auto" ref={ref}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center p-6 bg-bg-elevated/50 border border-border rounded-xl hover:border-border-hover transition-colors duration-300"
          >
            <span className="block text-3xl md:text-4xl font-bold text-off-white tracking-tight mb-1 tabular-nums">
              <Counter target={stat.value} active={inView} />
              {stat.suffix}
            </span>
            <span className="block text-[11px] uppercase tracking-[0.14em] text-text-dim font-medium">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
