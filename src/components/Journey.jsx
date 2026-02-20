import { motion } from 'framer-motion'
import { useInView } from './useInView'

const timeline = [
  {
    year: '2023',
    title: 'Started Learning to Code',
    desc: 'Picked up HTML, CSS, and JavaScript. Built my first websites and got hooked on making things work.',
  },
  {
    year: '2024',
    title: 'Back-End & Databases',
    desc: 'Started working with PHP and MySQL. Built full-stack apps with real data and user authentication.',
  },
  {
    year: '2024',
    title: 'Version Control & Collaboration',
    desc: 'Adopted Git and GitHub. Started managing projects properly and working with collaborative workflows.',
  },
  {
    year: '2025',
    title: 'Building Real Projects',
    desc: 'Built the Beer Dashboard — a full production app with solar monitoring, weather data, AI analysis, and an admin panel.',
  },
]

export default function Journey() {
  const [ref, inView] = useInView(0.1)

  return (
    <section id="journey" className="py-24 px-6 md:px-10 max-w-[1100px] mx-auto" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-off-white tracking-tight mb-12"
      >
        Journey
      </motion.h2>

      <div className="relative pl-8 md:pl-10">
        <div className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-border via-border-hover to-border" />

        {timeline.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
            className="relative mb-10 last:mb-0 group"
          >
            <div className="absolute -left-8 md:-left-10 top-2 w-[15px] h-[15px] rounded-full bg-bg border-2 border-border group-hover:border-accent transition-colors duration-300 z-[1]" />

            <span className="inline-block text-[10px] uppercase tracking-[0.12em] text-text-dim font-semibold px-2.5 py-0.5 bg-surface rounded mb-2">
              {item.year}
            </span>
            <h3 className="text-sm font-semibold text-off-white mb-1.5">{item.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed max-w-md">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
