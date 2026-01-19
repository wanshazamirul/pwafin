'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { isGuestMode } from '@/lib/guest-mode'

export default function DashboardPage() {
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

  const isGuest = isGuestMode()
  const userName = session?.user?.name || (isGuest ? 'Guest' : 'User')
  const userEmail = session?.user?.email || (isGuest ? 'Local mode (no account)' : '')

  // Mock data for now - replace with real database queries
  const totalThisMonth = 1234.56
  const quickStats = [
    { category: 'Food', amount: 450, color: 'text-teal-400' },
    { category: 'Transport', amount: 200, color: 'text-blue-400' },
    { category: 'Shopping', amount: 150, color: 'text-purple-400' },
  ]

  const recentTransactions = [
    {
      id: '1',
      merchant: 'Lunch Mamak',
      category: 'Food',
      amount: 12,
      date: new Date(),
      emoji: '🍔'
    },
    {
      id: '2',
      merchant: 'Grab to Work',
      category: 'Transport',
      amount: 20,
      date: new Date(Date.now() - 3600000),
      emoji: '🚗'
    },
    {
      id: '3',
      merchant: 'Petrol Shell',
      category: 'Transport',
      amount: 50,
      date: new Date(Date.now() - 7200000),
      emoji: '⛽'
    },
    {
      id: '4',
      merchant: 'Grocery Tesco',
      category: 'Shopping',
      amount: 150.80,
      date: new Date(Date.now() - 86400000),
      emoji: '🛒'
    },
    {
      id: '5',
      merchant: 'Starbucks',
      category: 'Food',
      amount: 18,
      date: new Date(Date.now() - 172800000),
      emoji: '☕'
    },
  ]

  return (
    <MobileLayout>
      {/* Header */}
      <header className="p-4 pt-safe">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground/60">
              Welcome back{userName ? `, ${userName}` : ''}!
            </p>
            <h1 className="text-2xl font-bold gradient-text">WalletLog</h1>
          </div>
        </div>
      </header>

      {/* Total Spending Card */}
      <section className="px-4 mb-6">
        <Card className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 gradient-accent opacity-10 rounded-full blur-3xl" />
          <p className="text-foreground/60 text-sm mb-1">Total This Month</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold gradient-text">RM {totalThisMonth.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</p>
            <div className="flex items-center text-sm text-green-400">
              <TrendingDown size={16} className="mr-1" />
              <span>15%</span>
            </div>
          </div>
          <p className="text-xs text-foreground/40 mt-2">vs last month</p>
        </Card>
      </section>

      {/* Quick Stats */}
      <section className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Quick Stats</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickStats.map((stat) => (
            <Card key={stat.category} className="glass-card p-3 text-center">
              <p className="text-xs text-foreground/60 mb-1">{stat.category}</p>
              <p className={`text-lg font-bold ${stat.color}`}>
                RM{stat.amount}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent</h2>
          <a href="/history" className="text-sm text-teal-400">
            View All
          </a>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <Card key={tx.id} className="glass-card p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{tx.emoji}</div>
                  <div>
                    <p className="font-semibold">{tx.merchant}</p>
                    <p className="text-sm text-foreground/60">
                      {tx.category} • {new Date(tx.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-teal-400">
                  RM{tx.amount.toFixed(2)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </MobileLayout>
  )
}
