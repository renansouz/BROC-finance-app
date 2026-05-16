'use client'

import { useState } from "react"
import { addAsset } from "@/app/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Car, Home, Package } from "lucide-react"
import { toast } from "sonner"

export default function AssetForm() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-zinc-900 border border-white/10 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 hover:bg-zinc-800 transition-all">
          <Plus className="w-4 h-4" /> Novo Bem (Carro/Casa)
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#18181b] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Cadastrar Patrimônio Imobilizado</DialogTitle>
        </DialogHeader>
        <form action={async (formData) => {
          await addAsset(formData)
          toast.success("Bem cadastrado com sucesso!")
          setOpen(false)
        }} className="space-y-4 pt-4">
          <input name="name" placeholder="Ex: Honda Civic 2023" className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none" required />
          
          <select name="type" className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none" required>
            <option value="VEHICLE">Veículo (Carro, Moto, etc)</option>
            <option value="REAL_ESTATE">Imóvel (Casa, Apto, Lote)</option>
            <option value="OTHER">Outros Bens de Valor</option>
          </select>

          <input name="value" type="number" step="0.01" placeholder="Valor Estimado (R$)" className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl outline-none" required />

          <button type="submit" className="w-full bg-primary text-black font-bold py-3 rounded-xl">Salvar no Patrimônio</button>
        </form>
      </DialogContent>
    </Dialog>
  )
}