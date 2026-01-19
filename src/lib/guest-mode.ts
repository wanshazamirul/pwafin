'use client'

import { useEffect, useState } from 'react'

const GUEST_MODE_KEY = 'walletlog-guest-mode'
const GUEST_ID_KEY = 'walletlog-guest-id'

export function setGuestMode() {
  if (typeof window === 'undefined') return
  const guestId = 'guest-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
  localStorage.setItem(GUEST_MODE_KEY, 'true')
  localStorage.setItem(GUEST_ID_KEY, guestId)
}

export function isGuestMode(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(GUEST_MODE_KEY) === 'true'
}

export function getGuestId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(GUEST_ID_KEY)
}

export function clearGuestMode() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(GUEST_MODE_KEY)
  localStorage.removeItem(GUEST_ID_KEY)
}

export function useGuestMode() {
  const [isGuest, setIsGuest] = useState(false)
  const [guestId, setGuestId] = useState<string | null>(null)

  useEffect(() => {
    setIsGuest(isGuestMode())
    setGuestId(getGuestId())

    const handleStorageChange = () => {
      setIsGuest(isGuestMode())
      setGuestId(getGuestId())
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { isGuest, guestId }
}
