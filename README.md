# Next.js 15 Supabase Auth Test Project

## Objective
This project serves as a minimal test environment for implementing Supabase authentication in a Next.js 15 application using the latest App Router and Server Components.

### Key Features
- Modern Next.js 15 App Router
- Server Components and Server Actions
- Supabase Auth with @supabase/ssr
- Email/Password and OAuth authentication
- TypeScript and Tailwind CSS
- Secure session management
- Protected routes

## Technologies Used
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase Auth (@supabase/ssr)
- Server Actions
- Server Components

## Project Structure
```
auth-test/
├── app/
│   ├── auth/
│   │   ├── confirm/     # Email confirmation handler
│   │   └── signout/     # Sign out handler
│   ├── login/
│   │   ├── page.tsx     # Login form
│   │   └── actions.ts   # Auth actions
│   ├── error/           # Error page
│   ├── private/         # Example protected page
│   └── page.tsx         # Home page
├── utils/
│   └── supabase/
│       ├── client.ts    # Browser client
│       ├── server.ts    # Server client
│       └── middleware.ts # Auth middleware
├── middleware.ts        # Route protection
└── .env.local          # Environment variables
```

## Key Features
1. **Modern Authentication Setup**
   - Uses the new `@supabase/ssr` package
   - Server Components and Actions
   - Secure cookie handling
   - Session persistence
   - Type-safe implementation

2. **Security Features**
   - Protected routes
   - Server-side session validation
   - Secure cookie management
   - CSRF protection
   - Type safety

3. **User Experience**
   - Clean, modern UI
   - Responsive design
   - Error handling
   - Loading states
   - Form validation

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Supabase Configuration**
   - Set up a Supabase project
   - Configure OAuth providers (if needed)
   - Set up email templates
   - Configure redirect URLs

4. **Development**
   ```bash
   npm run dev
   ```

## Implementation Details

### 1. Authentication Flow
- Server-side authentication using Server Actions
- Protected routes with middleware
- Session management with cookies
- OAuth support with callback handling

### 2. Security Measures
- Server-side session validation
- Secure cookie handling
- CSRF protection
- Type-safe implementations

### 3. User Experience
- Modern UI with Tailwind CSS
- Responsive design
- Form validation
- Error handling

## Contributing
Feel free to use this project as a reference or starting point for your own Supabase authentication implementation. Issues and pull requests are welcome.

## License
MIT
