import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="pill fixed top-3 left-3 z-[60] -translate-y-24 bg-bark text-cream focus:translate-y-0"
        >
          К содержанию
        </a>
        <Header />
        <main id="main">
          <Hero />
        </main>
      </MotionConfig>
    </LazyMotion>
  )
}
