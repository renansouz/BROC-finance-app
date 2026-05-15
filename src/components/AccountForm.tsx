'use client'

import { useState } from "react"
import { addFinancialAccount } from "@/app/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

export default function AccountForm() {
  const [type, setType] = useState("CHECKING")
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-primary text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Conta / Cartão
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#18181b] border-white/10 text-white">
        <DialogHeader><DialogTitle>Cadastrar Conta</DialogTitle></DialogHeader>
        <form action={async (formData) => {
          await addFinancialAccount(formData)
          setOpen(false)
        }} className="space-y-4 pt-4">
          <input name="name" placeholder="Ex: Sofisa, Nubank..." className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none" required />
          
          <select name="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none">
            <option value="CHECKING">Conta Corrente / Salário</option>
            <option value="SAVINGS">Poupança / Investimento</option>
            <option value="CREDIT">Cartão de Crédito</option>
          </select>

          {type === "CREDIT" && (
            <div className="grid grid-cols-1 gap-4">
              <input name="limit" type="number" placeholder="Limite Total (R$)" className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none" required />
              <div className="grid grid-cols-2 gap-4">
                <input name="closingDay" type="number" placeholder="Dia Fechamento" className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none" required />
                <input name="dueDay" type="number" placeholder="Dia Vencimento" className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none" required />
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-primary py-3 rounded-xl font-bold">Salvar Conta</button>
        </form>
      </DialogContent>
    </Dialog>
  )
}