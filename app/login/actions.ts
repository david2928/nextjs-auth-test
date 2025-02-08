'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  console.log('🔐 Login attempt initiated')

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  console.log('📧 Login attempt for email:', data.email)

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('❌ Login failed:', error.message)
    redirect('/error')
  }

  console.log('✅ Login successful for user:', data.email)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  console.log('📝 Signup attempt initiated')

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  console.log('📧 Signup attempt for email:', data.email)

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('❌ Signup failed:', error.message)
    redirect('/error')
  }

  console.log('✅ Signup successful for user:', data.email)
  revalidatePath('/', 'layout')
  redirect('/')
} 