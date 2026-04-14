'use server'

import { redirect } from 'next/navigation'
import { clearAdminSession, isValidAdminPassword, setAdminSession } from '@/lib/admin-auth'

export async function loginAdmin(formData: FormData) {
  const password = formData.get('password')?.toString() ?? ''

  if (!isValidAdminPassword(password)) {
    redirect('/admin/login?error=invalid')
  }

  await setAdminSession()
  redirect('/admin')
}

export async function logoutAdmin() {
  await clearAdminSession()
  redirect('/admin/login')
}