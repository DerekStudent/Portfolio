import { useState, useEffect, Suspense, Component } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from './useInView'

const base = import.meta.env.BASE_URL

const models = [
  {
    name: 'Model 1',
    description: 'Add your first Blender model here.',
    file: `${base}models/model1.glb`,
  },
  {
    name: 'Model 2',
    description: 'Add your second Blender model here.',
    file: `${base}models/model2.glb`,
  },
  {
    name: 'Model 3',
    description: 'Add your third Blender model here.',
    file: `${base}models/model3.glb`,
  },
]

function Model({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} dispose={null} />
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
        <span className="text-text-dim text-xs tracking-wider">Loading model...</span>
      </div>
    </Html>
  )
}

function Placeholder() {
  return (
    <group>
      <mesh rotation={[0.4, 0.8, 0]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#2a2a30" wireframe />
      </mesh>
      <Html center position={[0, -1.8, 0]}>
        <span className="text-text-dim text-[11px] whitespace-nowrap tracking-wider">
          Drop a .glb file in /public/models/
        </span>
      </Html>
    </group>
  )
}

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return <Placeholder />
    }
    return this.props.children
  }
}

function ModelViewer({ model, fileExists }) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 3.5], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />

      <Suspense fallback={<Loader />}>
        {fileExists ? (
          <ModelErrorBoundary url={model.file}>
            <Model url={model.file} />
          </ModelErrorBoundary>
        ) : (
          <Placeholder />
        )}
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.3}
          scale={8}
          blur={2}
          far={4}
        />
        <Environment preset="city" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={1.5}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={1.2}
      />
    </Canvas>
  )
}

export default function Models() {
  const [ref, inView] = useInView(0.08)
  const [active, setActive] = useState(0)
  const [existsMap, setExistsMap] = useState({})

  const currentModel = models[active]

  useEffect(() => {
    const url = currentModel.file
    if (url in existsMap) return
    let cancelled = false
    fetch(url, { method: 'HEAD' })
      .then((res) => { if (!cancelled) setExistsMap((prev) => ({ ...prev, [url]: res.ok })) })
      .catch(() => { if (!cancelled) setExistsMap((prev) => ({ ...prev, [url]: false })) })
    return () => { cancelled = true }
  }, [currentModel.file])

  const fileExists = existsMap[currentModel.file] === true

  return (
    <section id="models" className="py-24 px-6 md:px-10 max-w-[1100px] mx-auto" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-off-white tracking-tight mb-2"
      >
        3D Models
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="text-text-muted text-sm mb-10 max-w-md"
      >
        Interactive 3D models created in Blender. Drag to rotate, scroll to zoom.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid md:grid-cols-[1fr_280px] gap-5"
      >
        {/* 3D Viewer */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden relative">
          <div className="aspect-[4/3] md:aspect-auto md:h-[480px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <ModelViewer model={models[active]} fileExists={fileExists} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] uppercase tracking-[0.14em] text-text-dim font-medium">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 0v10m0 0l3-3m-3 3l-3-3" />
              </svg>
              Drag to rotate
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50">
                <rect x="6" y="2" width="12" height="20" rx="6" />
                <line x1="12" y1="6" x2="12" y2="10" />
              </svg>
              Scroll to zoom
            </span>
          </div>
        </div>

        {/* Model Selector */}
        <div className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {models.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 text-left p-4 rounded-xl border transition-all duration-300 ${
                active === i
                  ? 'bg-bg-card border-border-hover'
                  : 'bg-bg-elevated border-border hover:border-border-hover'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                  active === i ? 'bg-surface text-off-white' : 'bg-bg text-text-dim'
                }`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <span className={`block text-sm font-semibold transition-colors duration-300 ${
                    active === i ? 'text-off-white' : 'text-text-main'
                  }`}>
                    {m.name}
                  </span>
                  <span className="block text-[11px] text-text-dim leading-snug mt-0.5">
                    {m.description}
                  </span>
                </div>
              </div>
            </button>
          ))}

          <div className="p-4 border border-dashed border-border rounded-xl flex-shrink-0">
            <p className="text-[11px] text-text-dim leading-relaxed">
              Add <code className="text-text-muted">.glb</code> files to the <code className="text-text-muted">/public/models/</code> folder and update the models array in the component.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
