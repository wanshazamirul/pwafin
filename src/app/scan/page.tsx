'use client'

import { useState } from 'react'
import { Camera, X, Sparkles } from 'lucide-react'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function ScanPage() {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions] = useState([
    'lunch at mamak 12',
    'kedai tomyam rm12.50',
    'grab 20 to office',
    'petrol 50',
    'grocery tesco 150.80',
  ])

  const handleCapture = async () => {
    // Camera capture will be implemented with proper camera library
    alert('Camera capture will be implemented with proper library')
  }

  const handleTextSubmit = async () => {
    if (!text.trim()) return

    setIsLoading(true)
    try {
      // Call Grok API to parse the text
      const response = await fetch('/api/parse-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()
      if (data.success) {
        // TODO: Save transaction and navigate to history
        alert(`Parsed: RM${data.data.amount} - ${data.data.merchant}`)
      }
    } catch (error) {
      alert('Failed to parse. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MobileLayout showFAB={false}>
      {/* Header */}
      <header className="p-4 pt-safe flex items-center justify-between">
        <h1 className="text-xl font-bold">Scan Receipt</h1>
        <a href="/dashboard" className="text-foreground/60 touch-target">
          <X size={24} />
        </a>
      </header>

      <div className="p-4">
        {/* Camera View */}
        <Card className="glass-card p-8 mb-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-accent flex items-center justify-center">
              <Camera size={40} className="text-white" />
            </div>
            <p className="text-foreground/60 mb-4">Scan your receipt</p>
            <Button
              onClick={handleCapture}
              size="lg"
              className="gradient-accent text-white font-semibold touch-target-lg"
            >
              <Camera className="mr-2" size={20} />
              Capture Receipt
            </Button>
          </div>
        </Card>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-foreground/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-foreground/60">OR</span>
          </div>
        </div>

        {/* Text Input Section */}
        <div className="mb-4">
          <p className="text-foreground/60 text-sm mb-2">
            Type it instead... 📝
          </p>
          <p className="text-xs text-foreground/40 mb-4">
            Casual Malaysian English/Bahasa works!
          </p>
        </div>

        {/* NLP Input */}
        <Card className="glass-card p-4 mb-6">
          <Textarea
            placeholder="lunch at mamak 12"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px] bg-background/50 resize-none"
            rows={3}
          />
          <Button
            onClick={handleTextSubmit}
            disabled={!text.trim() || isLoading}
            className="w-full mt-4 gradient-accent text-white font-semibold touch-target-lg"
          >
            {isLoading ? (
              'Parsing...'
            ) : (
              <>
                <Sparkles className="mr-2" size={18} />
                Add Transaction
              </>
            )}
          </Button>
        </Card>

        {/* Recent Suggestions */}
        <div>
          <p className="text-sm text-foreground/60 mb-3">Recent examples:</p>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <Card
                key={index}
                className="glass-card p-3 text-sm cursor-pointer hover:bg-foreground/5 transition-colors"
                onClick={() => setText(suggestion)}
              >
                "{suggestion}"
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
