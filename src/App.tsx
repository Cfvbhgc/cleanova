import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { Advantages } from './components/Advantages'
import { BeforeAfter } from './components/BeforeAfter'
import { Contacts } from './components/Contacts'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { LeadForm } from './components/LeadForm'
import { MobileCta } from './components/MobileCta'
import { Rest } from './components/Rest'
import { Reviews } from './components/Reviews'
import { Services } from './components/Services'
import { Steps } from './components/Steps'

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="pill sr-only fixed top-3 left-3 z-[60] bg-bark text-cream focus:not-sr-only"
        >
          К содержанию
        </a>
        <Header />
        <main id="main">
          <Hero />
          <Services />
          <BeforeAfter />
          <Rest />
          <Advantages />
          <Steps />
          <Reviews />
          <Faq />
          <LeadForm />
          <Contacts />
        </main>
        <Footer />
        <MobileCta />
      </MotionConfig>
    </LazyMotion>
  )
}
