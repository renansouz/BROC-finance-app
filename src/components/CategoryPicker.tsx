'use client'

import { updateTransactionCategory } from "@/app/actions"

interface Category {
  id: string
  name: string
}

export default function CategoryPicker({ 
  transactionId, 
  currentCategoryId, 
  categories 
}: { 
  transactionId: string, 
  currentCategoryId: string | null, 
  categories: Category[] 
}) {
  return (
    <select 
      defaultValue={currentCategoryId || ""}
      onChange={(e) => updateTransactionCategory(transactionId, e.target.value)}
      className="text-xs border border-gray-300 rounded p-1 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
    >
      <option value="">Sem categoria</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  )
}