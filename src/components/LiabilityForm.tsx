'use client'

import { useState } from "react"
import { addLiability } from "@/app/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, MinusCircle } from "lucide-react"
import { toast } from "sonner"

export default function LiabilityForm() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 hover:bg-rose-500/20 transition-all">
          <Plus className="w-4 h-4" /> Nova Dívida / Empréstimo
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#18181b] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MinusCircle className="w-5 h-5 text-rose-500" />
            Cadastrar Passivo (Dívida)
          </DialogTitle>
        </DialogHeader>
        
        <form action={async (formData) => {
          await addLiability(formData)
          toast.success("Dívida registrada. Seu patrimônio líquido foi atualizado.")
          setOpen(false)
        }} className="space-y-4 pt-4">
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-zinc-500">Descrição da Dívida</label>
            <input 
              name="name" 
              placeholder="Ex: Financiamento do Apê, Empréstimo Pessoal..." 
              className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-rose-500" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-zinc-500">Tipo</label>
            <select 
              name="type" 
              className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-rose-500" 
              required
            >
              <option value="FINANCING">Financiamento (Casa/Carro)</option>
              <option value="LOAN">Empréstimo</option>
              <option value="OTHER">Outros Passivos</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-zinc-500">Valor Total Devido (R$)</label>
            <input 
              name="totalAmount" 
              type="number" 
              step="0.01" 
              placeholder="Quanto você deve hoje?" 
              className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-rose-500" 
              required 
            />
          </div>

          <button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-900/20">
            Registrar Dívida
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}