import { useState, useCallback, lazy, Suspense } from 'react'
import { ThemeProvider } from './components/ThemeToggle'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import Hero from './components/Hero'
import About from './components/About'
import Stats from './components/Stats'
import Skills from './components/Skills'
import TechStrip from './components/TechStrip'
import Projects from './components/Projects'
import GitHubFeed from './components/GitHubFeed'
import Journey from './components/Journey'
import Contact from './components/Contact'
import Footer from './components/Footer'
import MiniGame from './components/MiniGame'
import EasterEggs from './components/EasterEggs'
import BackToTop from './components/BackToTop'

// Lazy-load heavy Three.js section — only fetched when scrolled into view
const Models = lazy(() => import('./components/Models'))

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const handleLoaded = useCallback(() => setLoaded(true), [])

  return (
    <ThemeProvider>
      {!loaded && <LoadingScreen onComplete={handleLoaded} />}
      <div className="grain" />
      <ScrollProgress />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Divider />
        <About />
        <Stats />
        <Divider />
        <Skills />
        <Divider />
        <TechStrip />
        <Divider />
        <Projects />
        <Divider />
        <Suspense fallback={
          <div className="py-24 flex justify-center">
            <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
          </div>
        }>
          <Models />
        </Suspense>
        <Divider />
        <GitHubFeed />
        <Divider />
        <Journey />
        <Divider />
        <Contact />
      </main>
      <Footer />
      <MiniGame />
      <EasterEggs />
      <BackToTop />
    </ThemeProvider>
  )
}

function Divider() {
  return (
    <div className="flex justify-center py-4">
      <span className="block w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
