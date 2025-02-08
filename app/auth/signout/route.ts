import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function POST() {
  console.log('🚪 Sign-out process initiated')
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('❌ Sign-out failed:', error.message)
    throw error
  }
  
  console.log('✅ Sign-out successful')
  redirect('/login')
} 