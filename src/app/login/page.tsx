'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { setGuestMode } from '@/lib/guest-mode'
import { User, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGuestMode = async () => {
    try {
      setIsLoading(true)
      setGuestMode()
      // Use setTimeout to ensure localStorage is set before navigation
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 100)
    } catch (err) {
      console.error('Guest mode error:', err)
      setError('Failed to start guest mode')
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
      // If signIn doesn't throw, it will redirect
    } catch (err) {
      setError('Google sign in not configured. Use email or guest mode.')
      setIsLoading(false)
    }
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Failed to sign in. Try guest mode instead.')
        setIsLoading(false)
      } else if (result?.ok) {
        window.location.href = '/dashboard'
      } else {
        // Fallback: try guest mode if auth fails
        setError('Sign in temporarily unavailable. Try guest mode below.')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError('Sign in failed. Try guest mode instead.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="fixed inset-0 liquid-bg -z-10" />
      <div className="w-full max-w-md">
        <Card className="glass-card p-8 relative z-10">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">WalletLog</h1>
            <p className="text-sm text-foreground/60">Track expenses effortlessly</p>
          </div>

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            variant="outline"
            className="w-full mb-4 touch-target-lg relative z-20"
            type="button"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-foreground/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-foreground/60">Or sign in / create account</span>
            </div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail size={16} />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="touch-target-lg"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock size={16} />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="touch-target-lg"
                autoComplete="new-password"
              />
              <p className="text-xs text-foreground/40">
                New accounts are created automatically
              </p>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-accent text-white font-semibold touch-target-lg relative z-20"
            >
              {isLoading ? 'Processing...' : 'Sign In / Create Account'}
            </Button>
          </form>

          {/* Guest Mode Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-foreground/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-foreground/60">Or try without account</span>
            </div>
          </div>

          {/* Guest Mode Button */}
          <Button
            onClick={handleGuestMode}
            disabled={isLoading}
            variant="outline"
            className="w-full mb-4 touch-target-lg border-dashed relative z-20"
            type="button"
          >
            <User size={18} className="mr-2" />
            Continue as Guest
          </Button>
          <p className="text-xs text-foreground/60 text-center mb-4">
            Your data will be stored locally on this device only
          </p>

          {/* Demo Note */}
          <p className="text-xs text-foreground/40 text-center">
            Recommended: Use Guest Mode for now
          </p>
        </Card>
      </div>
    </div>
  )
}
