export interface Transaction {
  id: string
  userId: string
  categoryId: string | null
  amount: string
  merchant: string | null
  note: string | null
  receiptUrl: string | null
  createdAt: Date
  updatedAt: Date
  category?: Category
}

export interface Category {
  id: string
  userId: string
  name: string
  icon: string | null
  color: string | null
  isDefault: boolean
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  provider: string | null
  createdAt: Date
  updatedAt: Date
}

export interface GrokParseResult {
  amount: number
  merchant?: string
  category: string
  items?: Array<{ name: string; price: number }>
  date?: string
  note?: string
}

export interface ChartData {
  name: string
  value: number
  date?: string
}

export interface MonthlySpending {
  month: string
  amount: number
}

export interface CategorySpending {
  category: string
  amount: number
  percentage: number
}

export interface MerchantSpending {
  merchant: string
  amount: number
}
