import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import { useLogoEasterEgg } from './EasterEggs'
import { HackerOverlay } from './EasterEggs'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Tech', href: '#tech' },
  { label: 'Projects', href: '#projects' },
  { label: '3D', href: '#models' },
  { label: 'GitHub', href: '#github' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
]

function useActiveSection() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const ids = links.map(l => l.href.slice(1))

    const onScroll = () => {
      const offset = window.scrollY + 120
      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= offset) current = '#' + id
      }
      setActive(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return active
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { handleClick, hacking } = useLogoEasterEgg()
  const activeSection = useActiveSection()

  return (
    <>
    <HackerOverlay active={hacking} />
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-10 py-4 flex items-center justify-between bg-bg/70 backdrop-blur-xl border-b border-border/40">
      <a href="#hero" onClick={(e) => { e.preventDefault(); handleClick() }} className="text-xl font-bold text-off-white tracking-tight hover:text-accent transition-colors cursor-pointer select-none">
        D.
      </a>

      <ul className="hidden md:flex items-center gap-8">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className={`text-xs uppercase tracking-widest font-medium transition-colors relative group ${
                activeSection === l.href ? 'text-off-white' : 'text-text-muted hover:text-off-white'
              }`}
            >
              {l.label}
              <span className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${
                activeSection === l.href ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </a>
          </li>
        ))}
        <li>
          <ThemeToggle />
        </li>
      </ul>

      <div className="md:hidden flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-[5px] p-1"
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-text-muted transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-0.5 bg-text-muted transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-text-muted transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-bg/95 backdrop-blur-xl border-b border-border md:hidden"
          >
            <ul className="flex flex-col p-6 gap-4">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-widest text-text-muted hover:text-off-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  )
}
