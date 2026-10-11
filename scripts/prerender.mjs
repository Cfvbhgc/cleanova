// Renders the app into dist/index.html so the page is readable before any JS loads.
import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const { render } = await import(path.join(root, 'dist-ssr/entry-server.js'))

const file = path.join(root, 'dist/index.html')
let html = await readFile(file, 'utf8')
const marker = '<div id="root"></div>'
if (!html.includes(marker)) throw new Error('no empty #root in dist/index.html')
html = html.replace(marker, `<div id="root">${render()}</div>`)

// inline the stylesheet, it is small and otherwise blocks first paint
for (const link of html.match(/<link rel="stylesheet"[^>]*href="[^"]+\.css"[^>]*>/g) ?? []) {
  const href = link.match(/href="([^"]+)"/)[1]
  const css = await readFile(path.join(root, 'dist', href.replace(/^\/cleanova\//, '')), 'utf8')
  html = html.replace(link, `<style>${css}</style>`)
}

html = html.replace(/\s*<link rel="modulepreload"[^>]*>/g, '')

// load the bundle on first interaction or 4s after load; the hero already animates with CSS
const script = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)
if (!script) throw new Error('module script not found')
const loader = `<script>(function(){var done=false,ev=['scroll','pointerdown','touchstart','keydown','mousemove'];function go(){if(done)return;done=true;ev.forEach(function(e){removeEventListener(e,go)});var s=document.createElement('script');s.type='module';s.crossOrigin='';s.src='${script[1]}';document.head.appendChild(s)}ev.forEach(function(e){addEventListener(e,go,{passive:true,once:true})});addEventListener('click',function(e){if(window.__hydrated)return;var b=e.target.closest&&e.target.closest('button');if(b){e.preventDefault();window.__replayClick=b;go()}},true);function later(){setTimeout(go,4000)}if(document.readyState==='complete')later();else addEventListener('load',later)})()</script>`
html = html.replace(script[0], '').replace('</body>', `${loader}\n</body>`)

await writeFile(file, html)
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log('prerender: ok')
