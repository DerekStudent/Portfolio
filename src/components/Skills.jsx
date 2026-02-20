import { motion } from 'framer-motion'
import { useInView } from './useInView'

const skills = [
  { name: 'JavaScript', level: 85 },
  { name: 'PHP & MySQL', level: 75 },
  { name: 'React', level: 70 },
  { name: 'Python', level: 65 },
  { name: 'Blender / 3D', level: 80 },
  { name: 'Git & DevOps', level: 70 },
]

function SkillBar({ name, level, delay, animate }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-medium text-text-main">{name}</span>
        <span className="text-xs text-text-dim tabular-nums">{level}%</span>
      </div>
      <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, var(--color-border-hover), var(--color-accent))',
          }}
          initial={{ width: 0 }}
          animate={animate ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const [ref, inView] = useInView(0.2)

  return (
    <section className="py-24 px-6 md:px-10 max-w-[1100px] mx-auto" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-off-white tracking-tight mb-12"
      >
        Skills
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-1">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
          >
            <SkillBar
              name={skill.name}
              level={skill.level}
              delay={0.2 + i * 0.1}
              animate={inView}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
