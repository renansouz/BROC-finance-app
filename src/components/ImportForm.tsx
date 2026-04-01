'use client'

import { importTransactions } from "@/app/actions"

export default function ImportForm() {
  const handleFileUpload = async (e:
    React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async (event) => {
        const text = event.target?.result as string
        const lines = text.split('\n')

        const parsedData = lines.slice(1).map(line => {
          const [description, amount] = line.split(',')
          if(!description || !amount) return null
          return {
            description: description.trim(),
            amount: parseFloat(amount.trim())
          }
        }).filter(item => item !== null) as { description: string, amount: number }[]

        if (parsedData.length > 0 ) {
          await importTransactions(parsedData)
          alert(`${parsedData.length} transações importadas!`)
        }
      }
      reader.readAsText(file)
    }  

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
      <p className="text-sm text-gray-600 mb-2 font-medium">Importar via CSV (Descrição, Valor)</p>
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileUpload}
        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  )
}