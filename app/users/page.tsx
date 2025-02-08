import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface Booking {
  id: number
  created_at: string
  user_id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
}

export default async function BookingsPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    console.log('🚫 Unauthorized access to bookings page')
    redirect('/login')
  }

  // Fetch bookings from Supabase
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (bookingsError) {
    console.error('❌ Error fetching bookings:', bookingsError.message)
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Bookings</h1>
            <p className="text-gray-600">{bookingsError.message}</p>
            <Link 
              href="/"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Total bookings: {bookings?.length || 0}
              </p>
            </div>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </Link>
          </div>
          
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {bookings?.map((booking: Booking) => (
                <li key={booking.id} className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{booking.title}</h3>
                      {booking.description && (
                        <p className="mt-1 text-sm text-gray-500">{booking.description}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Booked by: {booking.user_id}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Start: {new Date(booking.start_time).toLocaleString()}</p>
                      <p>End: {new Date(booking.end_time).toLocaleString()}</p>
                      <p className="text-xs mt-1">Created: {new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 