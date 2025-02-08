import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('🔄 Processing OAuth callback with code:', code)

  if (code) {
    const supabase = await createClient()
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('❌ Error exchanging code for session:', error.message)
      return NextResponse.redirect(`${requestUrl.origin}/error`)
    }

    console.log('✅ Successfully authenticated with Google')
    return NextResponse.redirect(`${requestUrl.origin}`)
  }

  console.error('❌ No code provided in callback')
  return NextResponse.redirect(`${requestUrl.origin}/error`)
} 