'use client'

import { useState } from 'react'
import { Search, Edit2, Trash2, Filter } from 'lucide-react'
import { BottomNav } from '@/components/layout/BottomNav'
import { FAB } from '@/components/layout/FAB'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Mock data - replace with real database queries
const mockTransactions = [
  {
    id: '1',
    merchant: 'Lunch Mamak',
    category: 'Food',
    amount: 12,
    date: new Date(),
    note: 'Nasi lemak and teh tarik',
    emoji: '🍔'
  },
  {
    id: '2',
    merchant: 'Grab to Work',
    category: 'Transport',
    amount: 20,
    date: new Date(Date.now() - 3600000),
    note: 'Morning commute',
    emoji: '🚗'
  },
  {
    id: '3',
    merchant: 'Petrol Shell',
    category: 'Transport',
    amount: 50,
    date: new Date(Date.now() - 7200000),
    note: 'Full tank',
    emoji: '⛽'
  },
  {
    id: '4',
    merchant: 'Grocery Tesco',
    category: 'Shopping',
    amount: 150.80,
    date: new Date(Date.now() - 86400000),
    note: 'Weekly groceries',
    emoji: '🛒'
  },
  {
    id: '5',
    merchant: 'Starbucks',
    category: 'Food',
    amount: 18,
    date: new Date(Date.now() - 172800000),
    note: 'Caffeine fix',
    emoji: '☕'
  },
  {
    id: '6',
    merchant: 'TNB Bill',
    category: 'Bills',
    amount: 120,
    date: new Date(Date.now() - 259200000),
    note: 'Electricity bill',
    emoji: '💡'
  },
  {
    id: '7',
    merchant: 'Kedai Tomyam',
    category: 'Food',
    amount: 25,
    date: new Date(Date.now() - 345600000),
    note: 'Dinner with family',
    emoji: '🍲'
  },
]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [deletings, setDeleting] = useState<string | null>(null)

  // Filter transactions based on search
  const filteredTransactions = mockTransactions.filter((tx) =>
    tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleDelete = (id: string) => {
    if (confirm('Delete this transaction?')) {
      setDeleting(id)
      // TODO: Call API to delete transaction
      setTimeout(() => {
        setDeleting(null)
        alert('Transaction deleted')
      }, 500)
    }
  }

  const handleEdit = (id: string) => {
    // TODO: Open edit modal
    alert(`Edit transaction ${id}`)
  }

  // Group transactions by date
  const groupedByDate = filteredTransactions.reduce((acc, tx) => {
    const dateKey = new Date(tx.date).toLocaleDateString('en-MY', {
      month: 'long',
      year: 'numeric'
    })
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(tx)
    return acc
  }, {} as Record<string, typeof mockTransactions>)

  return (
    <div className="min-h-screen pb-24 liquid-bg">
      {/* Header */}
      <header className="p-4 pt-safe">
        <h1 className="text-xl font-bold mb-4">Transactions</h1>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          <Button variant="outline" size="icon" className="touch-target">
            <Filter size={18} />
          </Button>
        </div>
      </header>

      {/* Transaction List */}
      <div className="px-4">
        {Object.entries(groupedByDate).map(([dateKey, transactions]) => (
          <div key={dateKey} className="mb-6">
            <p className="text-sm text-foreground/60 mb-2 font-medium">
              {dateKey}
            </p>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <Card
                  key={tx.id}
                  className="glass-card p-4 swipe-hint transition-all"
                  style={{ opacity: deletings === tx.id ? 0.5 : 1 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{tx.emoji}</div>
                      <div>
                        <p className="font-semibold">{tx.merchant}</p>
                        <p className="text-sm text-foreground/60">
                          {tx.category}
                          {tx.note && ` • ${tx.note}`}
                        </p>
                        <p className="text-xs text-foreground/40 mt-1">
                          {new Date(tx.date).toLocaleDateString('en-MY', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-teal-400 text-lg">
                      RM{tx.amount.toFixed(2)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(tx.id)}
                      className="flex-1 touch-target"
                    >
                      <Edit2 size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(tx.id)}
                      disabled={deletings === tx.id}
                      className="flex-1 touch-target text-red-400 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60 mb-2">No transactions found</p>
            <p className="text-sm text-foreground/40">
              Try a different search term or add a new transaction
            </p>
          </div>
        )}
      </div>

      {/* FAB */}
      <FAB />

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  )
}
