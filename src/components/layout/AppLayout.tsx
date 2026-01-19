'use client'

import { ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Camera,
  FileText,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSession, signOut } from 'next-auth/react'
import { isGuestMode, clearGuestMode } from '@/lib/guest-mode'
import { useRouter } from 'next/navigation'

interface AppLayoutProps {
  children: ReactNode
  showFAB?: boolean
}

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/insights', icon: BarChart3, label: 'Insights' },
  { href: '/scan', icon: Camera, label: 'Scan', highlight: true },
  { href: '/history', icon: FileText, label: 'History' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function AppLayout({ children, showFAB = true }: AppLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isGuest = isGuestMode()
  const userName = session?.user?.name || (isGuest ? 'Guest' : 'User')
  const userEmail = session?.user?.email || (isGuest ? 'Local mode' : '')

  const handleLogout = async () => {
    if (isGuest) {
      clearGuestMode()
      router.push('/login')
    } else {
      await signOut({ callbackUrl: '/login' })
    }
  }

  // Desktop sidebar
  const Sidebar = () => (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen glass-card border-r border-foreground/10 bg-background/80 backdrop-blur-xl sticky top-0 h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-foreground/10">
        <h1 className="text-2xl font-bold gradient-text">WalletLog</h1>
        <p className="text-xs text-foreground/60 mt-1">Finance Tracker</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all touch-target',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'hover:bg-accent hover:text-accent-foreground text-foreground/70',
                item.highlight && 'gradient-accent text-white font-semibold'
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-foreground/10">
        <Card className="p-4 glass-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
              <User className="text-white" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{userName}</p>
              <p className="text-xs text-foreground/60 truncate">{userEmail}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-500/10"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </Card>
      </div>
    </aside>
  )

  // Mobile sidebar (slide-over)
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-72 glass-card z-50 lg:hidden transform transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-foreground/10">
            <div>
              <h1 className="text-2xl font-bold gradient-text">WalletLog</h1>
              <p className="text-xs text-foreground/60 mt-1">Finance Tracker</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all touch-target',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'hover:bg-accent hover:text-accent-foreground text-foreground/70',
                    item.highlight && 'gradient-accent text-white font-semibold'
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-foreground/10">
            <Card className="p-4 glass-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
                  <User className="text-white" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{userName}</p>
                  <p className="text-xs text-foreground/60 truncate">{userEmail}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-500/10"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </Card>
          </div>
        </div>
      </aside>
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 liquid-bg -z-10" />

      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-30 glass-card border-b border-foreground/10 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu size={24} />
                </Button>
                <div>
                  <h1 className="text-lg font-bold gradient-text">WalletLog</h1>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />
    </div>
  )
}
