'use client'

import { useFavorites } from '@/components/favorites-provider'

export function SaveButton({
  slug,
  variant = 'card',
}: {
  slug: string
  variant?: 'card' | 'detail'
}) {
  const { isSaved, toggleFavorite } = useFavorites()
  const saved = isSaved(slug)

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(slug)
      }}
      className={
        variant === 'detail'
          ? `inline-flex rounded-full px-4 py-2 text-sm font-medium ${
              saved
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-700 ring-1 ring-neutral-200'
            }`
          : `inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
              saved
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-800'
            }`
      }
    >
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}