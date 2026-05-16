'use client'

import { useState } from "react"
import { upsertBudget } from "@/app/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Target, Save } from "lucide-react"
import { toast } from "sonner"

interface Props {
  categoryId: string
  categoryName: string
  currentAmount: number
  month: number
  year: number
}

export default function BudgetModal({ categoryId, categoryName, currentAmount, month, year }: Props) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(currentAmount.toString())
  const [allYear, setAllYear] = useState(false);

  async function handleSave() {
    await upsertBudget(categoryId, parseFloat(amount), month, year, allYear)
    toast.success(allYear ? "Metas anuais atualizadas!" : "Meta atualizada!")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-primary transition-colors">
          <Target className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#18181b] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Definir Meta: {categoryName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-zinc-500">Valor Limite Mensal (R$)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 500.00" 
              className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 py-2">
            <input 
              type="checkbox" 
              id="allYear"
              checked={allYear}
              onChange={(e) => setAllYear(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-zinc-900 text-primary focus:ring-primary"
            />
            <label htmlFor="allYear" className="text-xs text-zinc-400 cursor-pointer select-none">
              Replicar esta meta para todos os meses <br />  restantes de {year}
            </label>
          </div>
          <button 
            onClick={handleSave}
            className="w-full bg-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Salvar Meta
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}