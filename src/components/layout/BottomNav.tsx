'use client'

import Link from 'next/link'
import { Home, Camera, FileText, BarChart3, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/insights', icon: BarChart3, label: 'Insights' },
  { href: '/scan', icon: Camera, label: 'Scan', isCenter: true },
  { href: '/history', icon: FileText, label: 'History' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav border-t border-white/10 dark:border-white/10 px-2 py-2 flex justify-around items-center z-50 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        if (item.isCenter) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 relative -mt-6"
            >
              <div className="w-14 h-14 gradient-accent rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30 glow-accent">
                <Icon size={28} className="text-white" />
              </div>
              <span className="text-xs font-semibold">Scan</span>
            </Link>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 transition-colors touch-target',
              isActive
                ? 'text-foreground'
                : 'text-foreground/60 hover:text-foreground'
            )}
          >
            <Icon size={24} />
            <span className="text-xs">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
