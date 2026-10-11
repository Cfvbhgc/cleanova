const BASE = import.meta.env.BASE_URL

export const imgUrl = (name: string, w: number, ext = 'webp') => `${BASE}img/${name}-${w}.${ext}`

type Props = {
  name: string
  widths: number[]
  sizes: string
  alt: string
  width: number
  height: number
  eager?: boolean
  className?: string
  imgClassName?: string
}

export function Picture({ name, widths, sizes, alt, width, height, eager, className, imgClassName }: Props) {
  const srcSet = (ext: string) => widths.map((w) => `${imgUrl(name, w, ext)} ${w}w`).join(', ')
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <img
        src={imgUrl(name, widths[widths.length - 1])}
        srcSet={srcSet('webp')}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : undefined}
        className={imgClassName}
      />
    </picture>
  )
}
