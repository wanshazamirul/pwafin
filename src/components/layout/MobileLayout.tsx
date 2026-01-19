import { ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { FAB } from './FAB'

interface MobileLayoutProps {
  children: ReactNode
  showNav?: boolean
  showFAB?: boolean
}

export function MobileLayout({ children, showNav = true, showFAB = true }: MobileLayoutProps) {
  return (
    <div className="min-h-screen relative">
      {/* Fixed background */}
      <div className="fixed inset-0 liquid-bg -z-10" />

      {/* Desktop container - centered with max width */}
      <div className="mx-auto w-full max-w-md lg:max-w-lg xl:max-w-md min-h-screen relative pb-safe">
        {children}

        {showFAB && <FAB />}

        {/* BottomNav - constrained to same max-width as content */}
        {showNav && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-md">
              <BottomNav />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
