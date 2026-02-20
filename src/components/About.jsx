import { motion } from 'framer-motion'
import { useInView } from './useInView'

const info = [
  { label: 'Location', value: 'The Netherlands' },
  { label: 'Status', value: 'Student' },
  { label: 'Interests', value: 'Web Dev, 3D Modeling, Industrial Automation' },
  { label: 'Focus', value: 'Full-Stack Development' },
  { label: '3D', value: 'Blender — 2 Years' },
  { label: 'Industrial', value: 'HMI Design & PLC (Siemens TIA Portal)' },
]

export default function About() {
  const [ref, inView] = useInView(0.15)

  return (
    <section id="about" className="py-24 px-6 md:px-10 max-w-[1100px] mx-auto" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-off-white tracking-tight mb-12"
      >
        About Me
      </motion.h2>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-text-muted text-sm leading-[1.85] mb-4">
            I'm a driven junior developer from the Netherlands with a focus on building software that actually works well. I like writing clean code that's easy to maintain, whether that's a web app, an internal tool, or a game system.
          </p>
          <p className="text-text-muted text-sm leading-[1.85]">
            Outside of code I've been modeling in Blender for over 2 years — creating 3D assets, environments, and props. I've built dashboards, admin panels, and scripting systems, and I'm always looking for the next challenge.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {info.map((item, i) => (
            <div
              key={item.label}
              className="bg-bg-elevated border border-border rounded-lg p-4 hover:border-border-hover transition-colors duration-300"
            >
              <span className="block text-[10px] uppercase tracking-[0.12em] text-text-dim font-medium mb-1">
                {item.label}
              </span>
              <span className="block text-sm text-text-main font-medium">
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
