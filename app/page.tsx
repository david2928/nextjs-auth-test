import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    console.log('🔄 No user found on homepage, redirecting to login')
    redirect('/login')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">
          Welcome to Your Dashboard
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-xl mb-4">
            You are logged in as: <strong>{user.email}</strong>
          </p>
          
          <div className="flex flex-col space-y-4">
            <Link
              href="/users"
              className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View Bookings
            </Link>
            
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 