'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Upload } from "lucide-react"
import ImportForm from "./ImportForm"

export default function ActionModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-primary hover:bg-primary/80 text-sm text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" />
          Nova Transação / Importar
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#18181b] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Gerenciar Transações</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="p-4 bg-zinc-900 rounded-xl border border-white/5">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" /> 
              Importar arquivo CSV
            </h3>
            <ImportForm />
          </div>
          <p className="text-[10px] text-zinc-500 text-center italic">
            Dica: O formulário de adição manual será integrado aqui em breve.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}