'use client'

import { importTransactions } from "@/app/actions"

export default function ImportForm() {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        await importTransactions(parsedData)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">
        Importar CSV (Descrição, Valor)
      </label>
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileUpload}
        className="text-xs text-zinc-400
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-xs file:font-bold
          file:bg-primary file:text-white
          hover:file:bg-primary/80
          cursor-pointer"
      />
    </div>
  )
}