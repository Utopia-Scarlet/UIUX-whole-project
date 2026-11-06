import React, { useEffect, useRef } from 'react'
import { type LoveStoryVisualAssetSlot } from '../../data/portfolioData'

export interface EnlargedMediaItem {
  slot: LoveStoryVisualAssetSlot
  title: string
  caption: string
  badge?: string
}

interface LoveStoryEvidencePictureProps {
  slot: LoveStoryVisualAssetSlot
  alt: string
  caption?: string
  badge?: string
  enlargeLabel: string
  onEnlarge: () => void
  className?: string
  priority?: boolean
}

export const LoveStoryEvidencePicture: React.FC<LoveStoryEvidencePictureProps> = ({
  slot,
  alt,
  caption,
  badge,
  enlargeLabel,
  onEnlarge,
  className = '',
  priority = false,
}) => {
  const isPortrait = slot.orientation === 'portrait'

  return (
    <figure
      className={`ls-evidence-figure ${
        isPortrait ? 'is-portrait-media' : 'is-landscape-media'
      } ${className}`}
    >
      <button
        type="button"
        className="ls-evidence-enlarge-trigger"
        onClick={onEnlarge}
        aria-label={`${enlargeLabel}: ${alt}`}
      >
        <div
          className="ls-evidence-media-frame"
          style={{ aspectRatio: slot.aspectRatio }}
        >
          {badge ? <span className="ls-evidence-frame-badge">{badge}</span> : null}
          <picture className="ls-evidence-picture">
            <source srcSet={slot.webp} type="image/webp" />
            <img
              src={slot.png}
              alt={alt}
              className="ls-evidence-img"
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
            />
          </picture>
          <span className="ls-evidence-zoom-pill" aria-hidden="true">
            {enlargeLabel} ↗
          </span>
        </div>
      </button>
      {caption ? (
        <figcaption className="ls-evidence-figcaption">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

interface LoveStoryLightboxModalProps {
  item: EnlargedMediaItem | null
  closeLabel: string
  onClose: () => void
}

export const LoveStoryLightboxModal: React.FC<LoveStoryLightboxModalProps> = ({
  item,
  closeLabel,
  onClose,
}) => {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!item) return
    const prevFocus = document.activeElement as HTMLElement | null
    const timer = window.setTimeout(() => {
      closeBtnRef.current?.focus({ preventScroll: true })
    }, 30)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
      prevFocus?.focus?.({ preventScroll: true })
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div
      className="ls-lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ls-lightbox-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`ls-lightbox-dialog ${
          item.slot.orientation === 'portrait' ? 'is-portrait' : 'is-landscape'
        }`}
      >
        <header className="ls-lightbox-header">
          <div className="ls-lightbox-title-group">
            {item.badge ? (
              <span className="ls-lightbox-badge">{item.badge}</span>
            ) : null}
            <h3 id="ls-lightbox-title" className="ls-lightbox-title">
              {item.title}
            </h3>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="ls-lightbox-close-btn"
            onClick={onClose}
          >
            {closeLabel} ×
          </button>
        </header>

        <div className="ls-lightbox-body">
          <picture className="ls-lightbox-picture">
            <source srcSet={item.slot.webp} type="image/webp" />
            <img
              src={item.slot.png}
              alt={item.title}
              className="ls-lightbox-img"
            />
          </picture>
        </div>

        <footer className="ls-lightbox-footer">
          <p className="ls-lightbox-caption">{item.caption}</p>
        </footer>
      </div>
    </div>
  )
}
