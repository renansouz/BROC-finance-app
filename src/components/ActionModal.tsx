'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Upload, PenLine } from "lucide-react"
import ImportForm from "./ImportForm"
import AddTransactionForm from "./AddTransactionForm"

interface Props {
  accounts: any[]
  categories: any[]
}

export default function ActionModal({ accounts, categories }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" /> Nova Transação
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#18181b] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Gerenciar Finanças</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900 mb-4">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <PenLine className="w-3 h-3" /> Manual
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="w-3 h-3" /> Importar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            <AddTransactionForm accounts={accounts} categories={categories} />
          </TabsContent>
          
          <TabsContent value="import">
            <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5">
               <ImportForm accounts={accounts} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}