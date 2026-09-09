'use client'

const MAX_VISIBLE = 5

export function ThumbnailStrip({
  thumbnails,
  total,
  alt,
}: {
  thumbnails: string[]
  total: number
  alt: string
}) {
  const visible = thumbnails.slice(0, MAX_VISIBLE)
  const overflow = total - visible.length

  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label={alt}>
      {visible.map((src, i) => (
        <li key={src + i}>
          <img
            src={src || '/placeholder.svg'}
            alt=""
            className="size-14 rounded-md border border-border object-cover"
            loading="lazy"
          />
        </li>
      ))}
      {overflow > 0 && (
        <li>
          <div className="tnum flex size-14 items-center justify-center rounded-md border border-dashed border-border bg-muted text-sm font-medium text-muted-foreground">
            +{overflow}
          </div>
        </li>
      )}
    </ul>
  )
}
