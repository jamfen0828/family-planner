import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-50 p-4">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-950">Place not found</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          We couldn’t find that page. It may not exist yet, or the link is wrong.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  )
}