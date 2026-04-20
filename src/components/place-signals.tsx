'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type SignalType =
  | 'parking_easy'
  | 'good_coffee'
  | 'good_for_toddlers'
  | 'buggy_friendly'

const SIGNALS: { label: string; value: SignalType; shortLabel: string }[] = [
  { label: 'Parking easy', value: 'parking_easy', shortLabel: 'Parking' },
  { label: 'Good coffee', value: 'good_coffee', shortLabel: 'Coffee' },
  {
    label: 'Good for toddlers',
    value: 'good_for_toddlers',
    shortLabel: 'Toddlers',
  },
  {
    label: 'Buggy friendly',
    value: 'buggy_friendly',
    shortLabel: 'Buggy',
  },
]

export function PlaceSignals({ placeId }: { placeId: number }) {
  const [submitted, setSubmitted] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>(
    'idle'
  )

  async function submitSignal(signalType: SignalType) {
    if (submitted.includes(signalType)) return

    setStatus('saving')

    const { error } = await supabase.from('place_signals').insert({
      place_id: placeId,
      signal_type: signalType,
      signal_value: true,
    })

    if (error) {
      setStatus('error')
      return
    }

    setSubmitted((current) => [...current, signalType])
    setStatus('success')
  }

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Quick feedback
          </p>
          <h2 className="mt-1 text-lg font-semibold text-neutral-900">
            Help other parents
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Tap anything you’d personally confirm.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {SIGNALS.map((signal) => {
          const isDone = submitted.includes(signal.value)

          return (
            <button
              key={signal.value}
              type="button"
              onClick={() => submitSignal(signal.value)}
              disabled={isDone || status === 'saving'}
              className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                isDone
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span>{signal.label}</span>
                <span className="text-xs opacity-70">
                  {isDone ? '✓' : '+'}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {status === 'error' ? (
        <p className="mt-3 text-sm text-red-600">
          Something went wrong. Try again.
        </p>
      ) : null}

      {status === 'success' ? (
        <p className="mt-3 text-sm text-green-600">
          Thanks — your input was saved.
        </p>
      ) : null}
    </section>
  )
}