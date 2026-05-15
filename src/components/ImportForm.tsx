'use client'

import { useState } from "react"
import { importTransactions } from "@/app/actions"
import { toast } from "sonner"

interface Account {
  id: string
  name: string
}

export default function ImportForm({ accounts }: { accounts: Account[] }) {
  const [selectedAccountId, setSelectedAccountId] = useState("")

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAccountId) {
      toast.error("Selecione uma conta antes de importar!")
      e.target.value = "" 
      return
    }

    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n')
      
      const parsedData = lines.slice(1).map(line => {
        const [description, amount] = line.split(',')
        if (!description || !amount) return null
        return {
          description: description.trim(),
          amount: parseFloat(amount.trim())
        }
      }).filter(item => item !== null) as { description: string, amount: number }[]

      if (parsedData.length > 0) {
        await importTransactions(parsedData, selectedAccountId)
        toast.success(`${parsedData.length} transações importadas no ${accounts.find(a => a.id === selectedAccountId)?.name}!`)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">1. Selecione a Conta</label>
        <select 
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
          className="w-full bg-zinc-950 border border-white/10 p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Clique para escolher...</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">2. Envie o arquivo CSV</label>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload}
          disabled={!selectedAccountId}
          className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-bold hover:file:bg-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )
}