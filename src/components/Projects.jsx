import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from './useInView'

const base = import.meta.env.BASE_URL

const dashboardImages = [
  { src: `${base}img/image.png`, alt: 'Dashboard overview' },
  { src: `${base}img/image copy.png`, alt: 'Solar panel monitoring' },
  { src: `${base}img/image copy 2.png`, alt: 'Weather data view' },
  { src: `${base}img/image copy 3.png`, alt: 'AI analysis panel' },
  { src: `${base}img/image copy 4.png`, alt: 'Internal news feed' },
  { src: `${base}img/image copy 5.png`, alt: 'Dashboard details' },
  { src: `${base}img/image copy 6.png`, alt: 'Dashboard statistics' },
]

const adminImages = [
  { src: `${base}img/image copy 7.png`, alt: 'Admin overview' },
  { src: `${base}img/image copy 8.png`, alt: 'Admin user management' },
  { src: `${base}img/image copy 9.png`, alt: 'Admin content panel' },
  { src: `${base}img/image copy 10.png`, alt: 'Admin settings' },
  { src: `${base}img/image copy 11.png`, alt: 'Admin data view' },
  { src: `${base}img/image copy 12.png`, alt: 'Admin analytics' },
  { src: `${base}img/image copy 13.png`, alt: 'Admin reports' },
  { src: `${base}img/image copy 14.png`, alt: 'Admin configuration' },
  { src: `${base}img/image copy 15.png`, alt: 'Admin dashboard' },
]

const features = [
  { icon: '☀️', title: 'Solar Panels', desc: 'Real-time monitoring of solar panel performance and energy output' },
  { icon: '🌤', title: 'Weather', desc: 'Live weather data integration with forecasts and historical trends' },
  { icon: '📊', title: 'AI Analysis', desc: 'Intelligent data analysis with automated insights and predictions' },
  { icon: '📰', title: 'Internal News', desc: 'Company news feed with publishing and content management' },
  { icon: '⚙️', title: 'Admin Panel', desc: 'Full admin dashboard for user management and system configuration' },
]

export default function Projects() {
  const [ref, inView] = useInView(0.08)
  const [lightbox, setLightbox] = useState(null)
  const [tab, setTab] = useState('dashboard')

  const currentImages = tab === 'dashboard' ? dashboardImages : adminImages

  const openLightbox = (index) => setLightbox(index)
  const closeLightbox = () => setLightbox(null)

  const navigate = (dir) => {
    if (lightbox === null) return
    const len = currentImages.length
    setLightbox((lightbox + dir + len) % len)
  }

  return (
    <section id="projects" className="py-24 px-6 md:px-10 max-w-[1100px] mx-auto" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-off-white tracking-tight mb-4"
      >
        Projects
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="text-text-muted text-sm mb-14 max-w-lg"
      >
        Here's what I've been working on. My main project is a full-stack dashboard built for real use.
      </motion.p>

      {/* Featured Project */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-20"
      >
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-off-white mb-1">Beer Dashboard</h3>
                <p className="text-text-dim text-xs uppercase tracking-widest font-medium">Full-Stack Web Application</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['PHP', 'MySQL', 'JavaScript', 'CSS', 'REST API'].map((t) => (
                  <span key={t} className="text-[10px] px-2.5 py-1 bg-surface text-text-dim rounded-full uppercase tracking-wider font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-text-muted text-sm leading-relaxed max-w-2xl">
              An internal company dashboard for monitoring solar panel performance, weather conditions, and AI-powered data analysis. Includes a live news feed and a complete admin panel for user and content management.
            </p>
          </div>

          {/* Project Breakdown */}
          <div className="grid sm:grid-cols-2 gap-px bg-border border-b border-border">
            <div className="bg-bg-card p-5 md:p-6">
              <h4 className="text-[11px] uppercase tracking-widest font-semibold text-accent mb-2.5">The Problem</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                The company needed a centralized way to monitor solar panel output, cross-reference it with weather data, and give internal teams a news feed — all in one place. Existing tools were fragmented and hard to maintain.
              </p>
            </div>
            <div className="bg-bg-card p-5 md:p-6">
              <h4 className="text-[11px] uppercase tracking-widest font-semibold text-accent mb-2.5">My Role</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Sole developer — designed and built the full stack from scratch. Created the database schema, built the REST API, developed the front-end dashboard, and implemented the complete admin panel with auth.
              </p>
            </div>
            <div className="bg-bg-card p-5 md:p-6">
              <h4 className="text-[11px] uppercase tracking-widest font-semibold text-accent mb-2.5">Tech Decisions</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                PHP + MySQL for a reliable, easy-to-deploy back-end. Vanilla JavaScript for a lightweight, fast front-end without framework overhead. REST API architecture for clean separation between data and UI.
              </p>
            </div>
            <div className="bg-bg-card p-5 md:p-6">
              <h4 className="text-[11px] uppercase tracking-widest font-semibold text-accent mb-2.5">Challenges</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Handling real-time solar data with inconsistent API responses. Building a role-based admin system from scratch. Designing an intuitive UI that non-technical staff could navigate without training.
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border-b border-border">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`p-4 md:p-5 text-center ${i < features.length - 1 ? 'border-r border-border' : ''} hover:bg-bg-elevated/50 transition-colors duration-300`}
              >
                <span className="text-lg mb-1.5 block">{f.icon}</span>
                <span className="block text-xs font-semibold text-text-main mb-0.5">{f.title}</span>
                <span className="block text-[10px] text-text-dim leading-snug hidden md:block">{f.desc}</span>
              </div>
            ))}
          </div>

          {/* Image Tabs */}
          <div className="p-6 md:p-8">
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setTab('dashboard')}
                className={`text-xs uppercase tracking-widest font-medium px-4 py-1.5 rounded-md border transition-all duration-300 ${
                  tab === 'dashboard'
                    ? 'border-accent/50 text-off-white bg-surface'
                    : 'border-border text-text-dim hover:text-text-muted'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setTab('admin')}
                className={`text-xs uppercase tracking-widest font-medium px-4 py-1.5 rounded-md border transition-all duration-300 ${
                  tab === 'admin'
                    ? 'border-accent/50 text-off-white bg-surface'
                    : 'border-border text-text-dim hover:text-text-muted'
                }`}
              >
                Admin Panel
              </button>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {currentImages.map((img, i) => (
                <motion.button
                  key={`${tab}-${i}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  onClick={() => openLightbox(i)}
                  className="group relative aspect-video rounded-lg overflow-hidden border border-border hover:border-border-hover transition-all duration-300 cursor-pointer bg-bg"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white/80 text-xs font-medium tracking-wider">
                      View
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Explanation Images */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h3 className="text-lg font-semibold text-off-white mb-2">Project Documentation</h3>
        <p className="text-text-dim text-sm mb-6">Technical documentation and architecture overview.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { src: `${base}img/image copy 17.png`, alt: 'Project documentation 2' },
            { src: `${base}img/image copy 18.png`, alt: 'Project documentation 3' },
          ].map((img, i) => (
            <div
              key={i}
              className="aspect-video rounded-lg overflow-hidden border border-border hover:border-border-hover transition-colors duration-300 bg-bg"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl transition-colors z-10"
            >
              ✕
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1) }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all z-10"
            >
              ‹
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigate(1) }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all z-10"
            >
              ›
            </button>

            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              src={currentImages[lightbox]?.src}
              alt={currentImages[lightbox]?.alt}
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-wider">
              {lightbox + 1} / {currentImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
