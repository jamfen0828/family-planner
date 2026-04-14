import Link from 'next/link'
import { loginAdmin } from '../auth-actions'

type LoginPageProps = {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const hasError = params.error === 'invalid'

  return (
    <main className="min-h-screen bg-neutral-50 p-4">
      <div className="mx-auto max-w-md pt-12">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Internal admin</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
            Sign in
          </h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            This area is private and only for managing your place data.
          </p>

          {hasError ? (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              Incorrect password. Try again.
            </div>
          ) : null}

          <form action={loginAdmin} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-neutral-700">
                Admin password
              </span>
              <input
                type="password"
                name="password"
                required
                className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white"
            >
              Sign in
            </button>
          </form>

          <div className="mt-4">
            <Link
              href="/"
              className="text-sm font-medium text-neutral-600 underline-offset-4 hover:underline"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}