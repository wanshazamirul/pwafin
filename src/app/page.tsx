'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { isGuestMode } from '@/lib/guest-mode'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return

    // Check if user is authenticated or in guest mode
    if (session || isGuestMode()) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [session, status, router])

  // Show loading while checking
  return (
    <div className="min-h-screen flex items-center justify-center liquid-bg">
      <Card className="glass-card p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-teal-400" />
        <p className="text-foreground/60">Loading WalletLog...</p>
      </Card>
    </div>
  )
}
