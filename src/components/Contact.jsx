import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from './useInView'

export default function Contact() {
  const [ref, inView] = useInView(0.15)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    const form = e.target
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/xpwzgkdl', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })

      if (res.ok) {
        setStatus('sent')
        form.reset()
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section id="contact" className="py-24 px-6 md:px-10 max-w-[1100px] mx-auto text-center" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-off-white tracking-tight mb-4"
      >
        Let's Build Something.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="text-text-muted text-sm mb-10"
      >
        Have a project in mind or just want to connect? Reach out.
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto text-left mb-8"
      >
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-sm text-text-main placeholder:text-text-dim focus:border-border-hover focus:bg-bg-card outline-none transition-all duration-300 font-sans"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-sm text-text-main placeholder:text-text-dim focus:border-border-hover focus:bg-bg-card outline-none transition-all duration-300 font-sans"
          />
        </div>
        <textarea
          name="message"
          rows={5}
          placeholder="Message"
          required
          className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-sm text-text-main placeholder:text-text-dim focus:border-border-hover focus:bg-bg-card outline-none transition-all duration-300 resize-y min-h-[120px] font-sans mb-4"
        />
        <button
          type="submit"
          disabled={status !== 'idle'}
          className={`w-full py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
            status !== 'idle'
              ? 'bg-surface text-text-muted cursor-default'
              : 'bg-off-white text-bg hover:bg-accent hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30'
          }`}
        >
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : status === 'error' ? 'Failed — try again' : 'Send Message'}
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-center gap-3 text-sm"
      >
        <a
          href="https://github.com/DerekStudent"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted hover:text-off-white transition-colors duration-300"
        >
          GitHub
        </a>
        <span className="text-text-dim">/</span>
        <a
          href="mailto:hello@derek.dev"
          className="text-text-muted hover:text-off-white transition-colors duration-300"
        >
          Email
        </a>
      </motion.div>
    </section>
  )
}
