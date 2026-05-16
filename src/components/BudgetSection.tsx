'use client'

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

interface BudgetData {
  categoryName: string
  categoryColor: string
  spent: number
  limit: number
}

export default function BudgetSection({ budgets }: { budgets: BudgetData[] }) {
  if (budgets.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-zinc-300">Minhas Metas de Gastos</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const percent = Math.min((budget.spent / budget.limit) * 100, 100)
          const isOver = budget.spent > budget.limit

          return (
            <Card key={budget.categoryName} className="bg-[#18181b] border-white/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: budget.categoryColor }} />
                      <CardTitle className="text-sm font-bold text-zinc-300">{budget.categoryName}</CardTitle>
                   </div>
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOver ? 'bg-rose-500/20 text-rose-500' : 'bg-zinc-800 text-zinc-500'}`}>
                    {isOver ? 'LIMITE EXCEDIDO' : `${percent.toFixed(0)}%`}
                   </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500 font-medium">Gasto: <b className="text-zinc-200">R$ {budget.spent.toFixed(2)}</b></span>
                  <span className="text-zinc-500 font-medium">Meta: <b className="text-zinc-200">R$ {budget.limit.toFixed(2)}</b></span>
                </div>
                <Progress 
                  value={percent} 
                  className={`h-1.5 bg-zinc-900 ${isOver ? '[&>div]:bg-rose-500' : '[&>div]:bg-primary'}`} 
                />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}