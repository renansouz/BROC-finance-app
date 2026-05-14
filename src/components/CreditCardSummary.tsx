'use client'

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"

interface CreditCardProps {
  name: string
  invoiceAmount: number
  limit: number
  dueDay: number
}

export default function CreditCardSummary({ name, invoiceAmount, limit, dueDay }: CreditCardProps) {
  const usedPercentage = (Math.abs(invoiceAmount) / limit) * 100
  const availableLimit = limit - Math.abs(invoiceAmount)

  return (
    <Card className="bg-zinc-900 border-white/10 overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-400 opacity-50" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm font-bold text-zinc-300">{name}</CardTitle>
        </div>
        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-bold">
          Vence dia {dueDay}
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="text-2xl font-black text-white">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(invoiceAmount))}
          </div>
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Fatura Atual</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <span>Limite usado</span>
            <span className="text-zinc-300">{usedPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={usedPercentage} className="h-1.5 bg-zinc-800" />
          <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
            <span>Disponível: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(availableLimit)}</span>
            <span>Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(limit)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}