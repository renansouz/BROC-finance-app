'use client'

import { addTransaction } from "@/app/actions"
import { toast } from "sonner"
import { useState } from "react"

interface Props {
  accounts: any[]
  categories: any[]
}

export default function AddTransactionForm({ accounts, categories }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await addTransaction(formData)
      toast.success("Transação adicionada!")
    } catch (error) {
      toast.error("Erro ao salvar transação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Descrição</label>
        <input name="description" placeholder="Ex: Café, Almoço, Salário..." className="w-full bg-zinc-950 border border-white/10 p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Valor (R$)</label>
          <input name="amount" type="number" step="0.01" placeholder="Ex: -15.50 ou 2000" className="w-full bg-zinc-950 border border-white/10 p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary" required />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Data</label>
          <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-zinc-950 border border-white/10 p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary text-white" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Conta</label>
          <select name="financialAccountId" className="w-full bg-zinc-950 border border-white/10 p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary" required>
            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Categoria</label>
          <select name="categoryId" className="w-full bg-zinc-950 border border-white/10 p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary">
            <option value="">Sem categoria</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {loading ? "Salvando..." : "Salvar Transação"}
      </button>
    </form>
  )
}