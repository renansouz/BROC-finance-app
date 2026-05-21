'use client'

import { useState } from "react"
import { importTransactions } from "@/app/actions"
import { toast } from "sonner"
import Papa from "papaparse"
import { FileSearch, ChevronRight } from "lucide-react"
import prisma from "@/lib/prisma"

interface Account { id: string; name: string }

export default function ImportForm({ accounts }: { accounts: Account[] }) {
  const [selectedAccountId, setSelectedAccountId] = useState("")
  const [csvData, setCsvData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [mapping, setMapping] = useState({ date: "", description: "", amount: "" })
  const [step, setStep] = useState(1)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: false, 
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as string[][]
        
        const headerIndex = rows.findIndex(row => 
          row.some(cell => /data|descri|valor|lançament/i.test(String(cell)))
        )

        if (headerIndex !== -1) {
          const rawHeaders = rows[headerIndex].map(h => h.trim())
          const dataRows = rows.slice(headerIndex + 1)

          const parsedData = dataRows.map(row => {
            const obj: any = {}
            rawHeaders.forEach((header, index) => {
              obj[header] = row[index]
            })
            return obj
          })

          setHeaders(rawHeaders)
          setCsvData(parsedData)
          setStep(2)
        } else {
          toast.error("Cabeçalho não encontrado. O arquivo é um CSV válido?")
        }
      }
    })
  }

  const handleImport = async () => {
    if (!mapping.date || !mapping.description || !mapping.amount) {
      return toast.error("Selecione todas as colunas.")
    }

    const formattedData = csvData.map(row => {
      const rawDesc = String(row[mapping.description] || "")
      const rawAmt = String(row[mapping.amount] || "")
      const rawDate = String(row[mapping.date] || "")

      if (rawDesc.toLowerCase().includes("saldo") || rawDesc.toLowerCase().includes("extrato") || !rawAmt) {
        return null
      }

      const cleanedAmount = rawAmt.replace(/[^\d,-]/g, "").replace(",", ".")
      const finalAmount = parseFloat(cleanedAmount)

      if (isNaN(finalAmount) || finalAmount === 0) return null

      let finalDate: Date
      if (rawDate.includes('/')) {
        const [d, m, y] = rawDate.split('/')
        finalDate = new Date(`${y}-${m}-${d}`)
      } else {
        finalDate = new Date(rawDate)
      }

      return {
        description: rawDesc.trim(),
        amount: finalAmount,
        date: finalDate
      }
    }).filter(item => item !== null) as { description: string, amount: number, date: Date }[]

    if (formattedData.length === 0) {
      return toast.error("Nenhuma transação válida encontrada.")
    }

    try {
      await importTransactions(formattedData, selectedAccountId)
      toast.success(`${formattedData.length} transações importadas!`)
      setStep(1)
      setCsvData([])
    } catch (error) {
      toast.error("Erro ao importar dados.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">1. Destino dos dados</label>
        <select 
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(e.target.value)}
          className="w-full bg-zinc-950 border border-white/10 p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Selecione a conta...</option>
          {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
        </select>
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">2. Arquivo do Banco</label>
          <div className="border-2 border-dashed border-white/5 rounded-2xl p-8 text-center hover:border-primary/30 transition-all cursor-pointer relative">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange}
              disabled={!selectedAccountId}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <FileSearch className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">Clique para selecionar o CSV</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">2. Mapear Colunas</label>
            <button onClick={() => setStep(1)} className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase">Trocar arquivo</button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { label: "Data", key: "date" },
              { label: "Descrição", key: "description" },
              { label: "Valor (Ex: -15.00)", key: "amount" }
            ].map(field => (
              <div key={field.key} className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-white/5">
                <span className="text-xs font-bold text-zinc-300">{field.label}</span>
                <select 
                  className="bg-transparent text-xs text-primary font-bold outline-none"
                  value={(mapping as any)[field.key]}
                  onChange={(e) => setMapping(prev => ({ ...prev, [field.key]: e.target.value }))}
                >
                  <option value="">Selecionar...</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>

          <button 
            onClick={handleImport}
            className="w-full bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary/80 transition-all flex items-center justify-center gap-2"
          >
            CONFIRMAR IMPORTAÇÃO <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}