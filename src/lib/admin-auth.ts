import 'server-only'
import { cookies } from 'next/headers'

const ADMIN_SESSION_COOKIE = 'fp_admin_session'

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    throw new Error('Missing ADMIN_PASSWORD in .env.local')
  }

  return password
}

export function isValidAdminPassword(password: string) {
  return password === getAdminPassword()
}

export async function setAdminSession() {
  const cookieStore = await cookies()

  cookieStore.set(ADMIN_SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()

  cookieStore.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export async function hasAdminSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)

  return session?.value === 'authenticated'
}