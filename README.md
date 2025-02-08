# Next.js 15 Supabase Authentication Example

This project demonstrates a complete authentication implementation using Next.js 15 and Supabase, featuring both traditional email/password and OAuth authentication methods.

## Features

- 🔐 Multiple Authentication Methods
  - Email/Password authentication
  - Google OAuth integration
  - Session management with cookies
- 🛡️ Protected Routes
- 📱 Responsive Design
- 🎨 Modern UI with Tailwind CSS
- 📝 TypeScript Support
- 🔄 Server-Side Rendering
- 🚀 Next.js App Router

## Prerequisites

- Node.js 18+ and npm
- A Supabase account
- A Google Cloud Platform account (for OAuth)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

### 2. Supabase Configuration

1. Create a new project in [Supabase](https://supabase.com)
2. Get your project URL and anon key from Project Settings > API
3. Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Go to Credentials → Create Credentials → OAuth Client ID
   - Application type: Web application
   - Add authorized redirect URI: `https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback`
5. Add credentials to your `.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

6. Configure Google provider in Supabase:
   - Go to Authentication → Providers
   - Enable Google
   - Add your Google Client ID and Client Secret

## Implementation Details

### 1. Supabase Client Setup

We have two Supabase client implementations:

#### Server-Side Client (`utils/supabase/server.ts`):
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set(name, value, options)
        },
        remove(name, options) {
          cookieStore.delete(name, options)
        },
      },
    }
  )
}
```

#### Client-Side Client (`utils/supabase/client.ts`):
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 2. Authentication Middleware

The middleware (`middleware.ts`) handles session management and protected routes:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set(name, value, options)
          response.cookies.set(name, value, options)
        },
        remove(name, options) {
          request.cookies.delete(name, options)
          response.cookies.delete(name, options)
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### 3. Authentication Actions

Server actions for login/signup (`app/login/actions.ts`):

```typescript
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) redirect('/error')
  
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)
  if (error) redirect('/error')
  
  redirect('/')
}
```

### 4. OAuth Implementation

#### Google OAuth Handler (`app/auth/google/route.ts`):
```typescript
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function POST() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: new URL('/auth/callback', process.env.NEXT_PUBLIC_APP_URL).toString(),
    },
  })

  if (error) return redirect('/error')
  return redirect(data.url)
}
```

#### OAuth Callback Handler (`app/auth/callback/route.ts`):
```typescript
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
    return NextResponse.redirect(requestUrl.origin)
  }

  return NextResponse.redirect(`${requestUrl.origin}/error`)
}
```

## Protected Routes

To protect a route, check for user authentication at the page level:

```typescript
export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return <div>Protected Content</div>
}
```

## Best Practices

1. **Session Management**
   - Always use server-side authentication checks
   - Implement proper middleware for protected routes
   - Handle session refresh properly

2. **Security**
   - Store sensitive keys in environment variables
   - Implement proper CSRF protection
   - Use HTTPS in production
   - Never expose authentication tokens

3. **Error Handling**
   - Implement proper error boundaries
   - Show user-friendly error messages
   - Log authentication failures appropriately

4. **UI/UX**
   - Show loading states during authentication
   - Provide clear feedback for authentication errors
   - Implement proper form validation
   - Make authentication flows intuitive

## Common Issues and Solutions

1. **Session Not Persisting**
   - Ensure cookies are being set properly
   - Check middleware implementation
   - Verify SSL settings in production

2. **OAuth Redirect Issues**
   - Verify redirect URLs in Google Console
   - Check Supabase OAuth configuration
   - Ensure environment variables are set correctly

3. **CORS Issues**
   - Configure proper CORS settings in Supabase
   - Use correct client initialization
   - Check domain settings

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
