'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Moon, Sun, LogOut, Download, User, Palette, FolderOpen, Shield, Loader2 } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { isGuestMode, clearGuestMode } from '@/lib/guest-mode'

export default function SettingsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('User')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    // Check if user is authenticated or in guest mode
    if (status === 'loading') return

    const isGuest = isGuestMode()
    if (!session && !isGuest) {
      router.push('/login')
    } else {
      setUserName(session?.user?.name || (isGuest ? 'Guest' : 'User'))
      setUserEmail(session?.user?.email || (isGuest ? 'Local mode (no account)' : ''))
      setIsLoading(false)
    }
  }, [session, status, router])

  const handleLogout = async () => {
    const isGuest = isGuestMode()
    if (isGuest) {
      clearGuestMode()
      router.push('/login')
    } else {
      await signOut({ callbackUrl: '/login' })
    }
  }

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center liquid-bg">
        <Card className="glass-card p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-teal-400" />
          <p className="text-foreground/60">Loading...</p>
        </Card>
      </div>
    )
  }

  const categories = [
    'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Others'
  ]

  return (
    <MobileLayout showFAB={false}>
      {/* Header */}
      <header className="p-4 pt-safe">
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <div className="px-4 space-y-4">
        {/* Profile */}
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{userName}</p>
              <p className="text-sm text-foreground/60">{userEmail}</p>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Palette size={18} className="text-foreground/60" />
            <h2 className="font-semibold">Appearance</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon size={18} />
                <span>Dark Mode</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </Card>

        {/* Categories */}
        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen size={18} className="text-foreground/60" />
              <h2 className="font-semibold">Categories</h2>
            </div>
            <Button variant="ghost" size="sm">
              Manage
            </Button>
          </div>
          <p className="text-sm text-foreground/60 mt-3 mb-2">
            {categories.join(', ')}
          </p>
          <p className="text-xs text-foreground/40">
            Default categories for organizing expenses
          </p>
        </Card>

        {/* Data Export */}
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Download size={18} className="text-foreground/60" />
            <h2 className="font-semibold">Data</h2>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start touch-target">
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" className="w-full justify-start touch-target">
              <Download size={16} className="mr-2" />
              Export PDF Report
            </Button>
          </div>
        </Card>

        {/* Security */}
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-foreground/60" />
            <h2 className="font-semibold">Security</h2>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start touch-target">
              Change Password
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start touch-target text-red-400 hover:text-red-500 hover:bg-red-500/10"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </Card>

        {/* About */}
        <Card className="glass-card p-4">
          <div className="text-center">
            <p className="font-semibold">WalletLog</p>
            <p className="text-sm text-foreground/60 mb-1">Version 1.0.0</p>
            <p className="text-xs text-foreground/40">
              Made with ❤️ in Malaysia
            </p>
            <Separator className="my-3" />
            <div className="flex justify-center gap-4 text-sm">
              <a href="#" className="text-teal-400">Privacy</a>
              <a href="#" className="text-teal-400">Terms</a>
              <a href="#" className="text-teal-400">Rate App</a>
            </div>
          </div>
        </Card>
      </div>
    </MobileLayout>
  )
}
