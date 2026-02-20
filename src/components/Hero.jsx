import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const roles = [
  'Software Developer',
  'Full-Stack Builder',
  '3D Modeler',
  'Problem Solver',
  'HMI Designer',
]

function useTypewriter(words) {
  const [display, setDisplay] = useState('')
  const [cursor, setCursor] = useState(true)
  const phase = useRef('typing')   // typing | pausing | deleting | waiting
  const wordIdx = useRef(0)
  const charIdx = useRef(0)

  useEffect(() => {
    let timeout

    function step() {
      const word = words[wordIdx.current]

      switch (phase.current) {
        case 'typing':
          charIdx.current++
          setDisplay(word.slice(0, charIdx.current))
          if (charIdx.current >= word.length) {
            phase.current = 'pausing'
            timeout = setTimeout(step, 2200)
          } else {
            timeout = setTimeout(step, 70 + Math.random() * 50)
          }
          break

        case 'pausing':
          phase.current = 'deleting'
          timeout = setTimeout(step, 40)
          break

        case 'deleting':
          charIdx.current--
          setDisplay(word.slice(0, charIdx.current))
          if (charIdx.current <= 0) {
            phase.current = 'waiting'
            timeout = setTimeout(step, 400)
          } else {
            timeout = setTimeout(step, 35)
          }
          break

        case 'waiting':
          wordIdx.current = (wordIdx.current + 1) % words.length
          phase.current = 'typing'
          timeout = setTimeout(step, 100)
          break
      }
    }

    // Start after a small initial delay
    timeout = setTimeout(step, 600)
    return () => clearTimeout(timeout)
  }, [words])

  // Blink cursor
  useEffect(() => {
    const id = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(id)
  }, [])

  return { display, cursor }
}

export default function Hero() {
  const { display, cursor } = useTypewriter(roles)

  return (
    <section id="hero" className="relative min-h-screen flex items-center max-w-[1200px] mx-auto px-6 md:px-10 pt-28 pb-16 gap-8">
      <div className="relative z-10 flex-1 max-w-xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-text-muted text-sm tracking-wider mb-2"
        >
          Hi, I'm
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-off-white leading-none tracking-tighter mb-3"
        >
          Derek
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-text-muted font-normal tracking-wide mb-5 h-7"
        >
          <span>{display}</span>
          <span
            className="inline-block w-[2px] h-[1.1em] ml-0.5 align-middle transition-opacity duration-100"
            style={{ backgroundColor: 'var(--color-accent)', opacity: cursor ? 1 : 0 }}
          />
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-text-dim text-sm leading-relaxed mb-8 max-w-md"
        >
          I build clean, functional software — from dashboards and web apps to 3D models. Always learning, always shipping.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex gap-3 flex-wrap"
        >
          <a
            href="#projects"
            className="inline-block px-6 py-3 text-sm font-medium bg-off-white text-bg rounded-lg hover:bg-accent hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 transition-all duration-300"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-block px-6 py-3 text-sm font-medium text-text-main border border-border rounded-lg hover:border-text-muted hover:text-off-white hover:-translate-y-0.5 transition-all duration-300"
          >
            Contact
          </a>
        </motion.div>
      </div>
    </section>
  )
}
