'use client'

import { updateTransactionCategory } from "@/app/actions"
import { toast } from "sonner"

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
      onChange={async (e) => {
        const newCategoryId = e.target.value
        await updateTransactionCategory(transactionId, newCategoryId)
        toast.info("Categoria atualizada com sucesso")
      }}
      className="bg-zinc-950 border border-white/10 text-zinc-400 text-[11px] font-medium rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer hover:text-white transition-colors"
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