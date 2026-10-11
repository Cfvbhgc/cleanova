import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/unbounded/wght.css'
import '@fontsource-variable/onest/wght.css'
import './index.css'
import App from './App.tsx'

declare global {
  interface Window {
    __hydrated?: boolean
    __replayClick?: HTMLElement
  }
}

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

// a button pressed before hydration gets its click replayed once handlers are attached
requestAnimationFrame(() =>
  setTimeout(() => {
    window.__hydrated = true
    const pending = window.__replayClick
    window.__replayClick = undefined
    if (pending?.isConnected) pending.click()
  }),
)
