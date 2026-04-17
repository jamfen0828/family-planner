'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type FavoritesContextValue = {
  favorites: string[]
  isSaved: (slug: string) => boolean
  toggleFavorite: (slug: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

const STORAGE_KEY = 'family-planner-favorites'

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    if (stored) {
      try {
        const parsed = JSON.parse(stored)

        if (Array.isArray(parsed)) {
          setFavorites(parsed)
        }
      } catch {
        // ignore broken local storage
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  function isSaved(slug: string) {
    return favorites.includes(slug)
  }

  function toggleFavorite(slug: string) {
    setFavorites((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug)
      }

      return [...current, slug]
    })
  }

  const value = useMemo(
    () => ({
      favorites,
      isSaved,
      toggleFavorite,
    }),
    [favorites]
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }

  return context
}