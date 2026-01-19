'use client'

import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Legend } from 'recharts'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { Card } from '@/components/ui/card'
import { TrendingDown, TrendingUp } from 'lucide-react'

export default function InsightsPage() {
  // Mock data - replace with real database queries
  const monthlyData = [
    { month: 'Sep', amount: 800 },
    { month: 'Oct', amount: 1200 },
    { month: 'Nov', amount: 950 },
    { month: 'Dec', amount: 1100 },
    { month: 'Jan', amount: 1234 },
  ]

  const categoryData = [
    { name: 'Food', value: 450, color: '#38b764' },
    { name: 'Transport', value: 200, color: '#257179' },
    { name: 'Shopping', value: 150, color: '#b13e53' },
    { name: 'Bills', value: 180, color: '#ef7d57' },
    { name: 'Others', value: 254, color: '#5d275d' },
  ]

  const merchantData = [
    { name: 'Mamak', amount: 450 },
    { name: 'Grab', amount: 320 },
    { name: 'Shell', amount: 280 },
    { name: 'Tesco', amount: 250 },
    { name: 'Starbucks', amount: 180 },
  ]

  const dailyData = [
    { day: 'Mon', amount: 45 },
    { day: 'Tue', amount: 62 },
    { day: 'Wed', amount: 38 },
    { day: 'Thu', amount: 75 },
    { day: 'Fri', amount: 52 },
    { day: 'Sat', amount: 88 },
    { day: 'Sun', amount: 65 },
  ]

  return (
    <MobileLayout showFAB={false}>
      {/* Header */}
      <header className="p-4 pt-safe">
        <h1 className="text-xl font-bold">Insights</h1>
      </header>

      <div className="px-4 space-y-6">
        {/* Total */}
        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60 mb-1">January 2025</p>
              <p className="text-3xl font-bold gradient-text">RM 1,234.56</p>
            </div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingDown size={20} className="mr-1" />
              <span>15%</span>
            </div>
          </div>
          <p className="text-sm text-foreground/60 mt-2">vs last month</p>
        </Card>

        {/* Line Chart - Trend */}
        <Card className="glass-card p-4">
          <h3 className="font-semibold mb-4">Spending Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
                formatter={(value) => [`RM${value ?? 0}`, 'Amount']}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="hsl(160 84% 39% / 1)"
                strokeWidth={2}
                dot={{ fill: 'hsl(160 84% 39% / 1)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart - Categories */}
        <Card className="glass-card p-4">
          <h3 className="font-semibold mb-4">By Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
                formatter={(value) => [`RM${value ?? 0}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart - Merchants */}
        <Card className="glass-card p-4">
          <h3 className="font-semibold mb-4">Top Merchants</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart layout="horizontal" data={merchantData}>
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis
                dataKey="name"
                type="category"
                width={80}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
                formatter={(value) => [`RM${value ?? 0}`, 'Amount']}
              />
              <Bar dataKey="amount" fill="hsl(25 81% 48% / 1)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart - Daily Average */}
        <Card className="glass-card p-4">
          <h3 className="font-semibold mb-4">Daily Average</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData}>
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
                formatter={(value) => [`RM${value ?? 0}`, 'Amount']}
              />
              <Bar dataKey="amount" fill="hsl(280 60% 50% / 1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </MobileLayout>
  )
}
