import { z } from 'zod'

export const transactionSchema = z.object({
  amount: z.string().min(1, 'Amount is required').transform((val) => parseFloat(val)),
  merchant: z.string().min(1, 'Merchant is required'),
  categoryId: z.string().uuid('Invalid category').optional(),
  category: z.string().optional(),
  note: z.string().optional(),
  receiptUrl: z.string().url().optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>

export const nlpParseSchema = z.object({
  text: z.string().min(1, 'Text is required'),
})

export const receiptScanSchema = z.object({
  imageData: z.string().min(1, 'Image data is required'),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  icon: z.string().optional(),
  color: z.string().optional(),
})

export type CategoryInput = z.infer<typeof categorySchema>
