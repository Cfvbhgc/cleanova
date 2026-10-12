// Builds responsive webp/avif files in public/img.
// Sources live in .cache: photos/<pexels id or file>.jpg and cutouts/<pexels id>.png (transparent background).
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'public/img')

const photos = [
  { id: 18470969, name: 'mini-flat', ratio: 1, widths: [200, 400] },
  { id: 31435403, name: 'mini-windows', ratio: 1, widths: [200, 400], position: 'right' },
  { id: 10567271, name: 'mini-office', ratio: 1, widths: [200, 400] },
  { id: 10568359, name: 'strip', ratio: 4.2, widths: [640, 1100], position: 'attention' },
  { id: 19827227, name: 'svc-flat', ratio: 0.8, widths: [420, 760] },
  { id: 9462314, name: 'svc-general', ratio: 0.8, widths: [420, 760] },
  { id: 5691510, name: 'svc-renovation', ratio: 0.8, widths: [420, 760], position: 'right' },
  { id: 10567271, name: 'svc-office', ratio: 1.25, widths: [480, 860] },
  { id: 4239147, name: 'svc-windows', ratio: 1.25, widths: [480, 860] },
  { id: 7193356, name: 'rest', ratio: 0.82, widths: [480, 860], position: 'bottom' },
]

// before and after must share ratio and position so the halves line up
const pairs = [
  { name: 'ba-kitchen', before: 'ba-kitchen-before', after: 39338456 },
  { name: 'ba-bathroom', before: 'ba-bathroom-before', after: 6890406, position: 'left' },
  { name: 'ba-renovation', before: 'ba-renovation-before', after: 7031621 },
]
for (const p of pairs) {
  for (const side of ['before', 'after']) {
    photos.push({ id: p[side], name: `${p.name}-${side}`, ratio: 4 / 3, widths: [640, 1000, 1400], position: p.position })
  }
}

const cutouts = [
  { id: 6312055, name: 'hero-chair', widths: [560, 900, 1300] },
  { id: 10574058, name: 'tool-bottle', widths: [240, 440] },
  { id: 45059, name: 'tool-brush', widths: [240, 440] },
  { id: 15336632, name: 'tool-bucket', widths: [240, 440] },
]

async function write(pipeline, name, w) {
  await Promise.all([
    pipeline.clone().webp({ quality: 76, effort: 6 }).toFile(path.join(out, `${name}-${w}.webp`)),
    pipeline.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(out, `${name}-${w}.avif`)),
  ])
}

await mkdir(out, { recursive: true })

for (const p of photos) {
  const src = path.join(root, '.cache/photos', `${p.id}.jpg`)
  for (const w of p.widths) {
    const h = Math.round(w / p.ratio)
    const img = sharp(src).resize(w, h, { fit: 'cover', position: p.position ?? 'centre' })
    await write(img, p.name, w)
  }
  console.log(p.name)
}

for (const c of cutouts) {
  const src = path.join(root, '.cache/cutouts', `${c.id}.png`)
  for (const w of c.widths) await write(sharp(src).resize({ width: w }), c.name, w)
  console.log(c.name)
}
