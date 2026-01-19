'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { QuickAddModal } from '@/components/scan/QuickAddModal'
import { usePathname } from 'next/navigation'

export function FAB() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Don't show FAB on scan page
  if (pathname === '/scan') {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 gradient-accent rounded-full shadow-lg shadow-teal-500/30 flex items-center justify-center text-white z-40 active:scale-95 transition-transform glow-accent touch-target-lg"
        aria-label="Add transaction"
      >
        <Plus size={28} />
      </button>

      {isOpen && <QuickAddModal onClose={() => setIsOpen(false)} />}
    </>
  )
}
