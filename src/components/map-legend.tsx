export function MapLegend() {
  const items = [
    { emoji: '🌳', label: 'Park' },
    { emoji: '🍺', label: 'Pub / pub garden' },
    { emoji: '☕', label: 'Cafe' },
    { emoji: '🎠', label: 'Soft play' },
    { emoji: '🐐', label: 'Farm' },
    { emoji: '🛍️', label: 'Farm shop' },
    { emoji: '🌿', label: 'Garden centre' },
    { emoji: '🏛️', label: 'Museum' },
    { emoji: '📍', label: 'Other' },
  ]

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Map legend
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-50 px-3 py-2 text-sm text-neutral-800 ring-1 ring-neutral-200"
          >
            <span className="text-base leading-none">{item.emoji}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}