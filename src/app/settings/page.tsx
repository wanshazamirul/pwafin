'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Download, Palette, FolderOpen, Shield, Loader2, Bell, Lock } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { isGuestMode } from '@/lib/guest-mode'

export default function SettingsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated or in guest mode
    if (status === 'loading') return

    const isGuest = isGuestMode()
    if (!session && !isGuest) {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [session, status, router])

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
    <AppLayout>
      <div className="max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-foreground/60">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette size={20} className="text-foreground/60" />
              <h2 className="text-lg font-semibold">Appearance</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-foreground/60">Customize the app appearance</p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={20} className="text-foreground/60" />
              <h2 className="text-lg font-semibold">Preferences</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-foreground/60">Manage alert preferences</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Currency</p>
                  <p className="text-sm text-foreground/60">Display currency format</p>
                </div>
                <div className="px-4 py-2 rounded-md bg-background/50 font-medium">
                  RM (Malaysian Ringgit)
                </div>
              </div>
            </div>
          </Card>

          {/* Categories */}
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen size={20} className="text-foreground/60" />
              <h2 className="text-lg font-semibold">Expense Categories</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
            <p className="text-sm text-foreground/60">
              Default categories for organizing your expenses
            </p>
          </Card>

          {/* Data Management */}
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Download size={20} className="text-foreground/60" />
              <h2 className="text-lg font-semibold">Data & Privacy</h2>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start touch-target">
                <Download size={18} className="mr-3" />
                Export Data as CSV
              </Button>
              <Button variant="outline" className="w-full justify-start touch-target">
                <Download size={18} className="mr-3" />
                Export PDF Report
              </Button>
              <Separator />
              <Button variant="outline" className="w-full justify-start touch-target">
                <Lock size={18} className="mr-3" />
                Change Password
              </Button>
            </div>
          </Card>

          {/* About */}
          <Card className="glass-card p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold gradient-text mb-2">WalletLog</h2>
              <p className="text-sm text-foreground/60 mb-4">Version 1.0.0</p>
              <p className="text-xs text-foreground/40 mb-4">
                Made with ❤️ in Malaysia
              </p>
              <Separator className="my-4" />
              <div className="flex justify-center gap-6 text-sm">
                <a href="#" className="text-teal-400 hover:text-teal-300">Privacy Policy</a>
                <a href="#" className="text-teal-400 hover:text-teal-300">Terms of Service</a>
                <a href="#" className="text-teal-400 hover:text-teal-300">Rate App</a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
