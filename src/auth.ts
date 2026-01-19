import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { users } from '@/lib/db/schema'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'

// Use a default secret in development only
const authSecret = process.env.AUTH_SECRET || 'development-secret-change-in-production'

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: authSecret,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string)
        })

        // For demo purposes, create user if not exists
        // In production, you would verify password properly
        if (user) {
          return user
        }

        // Create new user for credentials auth
        const newUser = await db.insert(users).values({
          email: credentials.email as string,
          name: (credentials.email as string).split('@')[0],
          provider: 'credentials'
        }).returning()

        return newUser[0]
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})
