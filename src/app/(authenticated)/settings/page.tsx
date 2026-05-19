import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Settings as SettingsIcon } from "lucide-react"
import BudgetModal from "@/components/BudgetModal"
import AssetForm from "@/components/AssetForm";
import LiabilityForm from "@/components/LiabilityForm";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<any> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { month, year } = await searchParams
  const sMonth = parseInt(month || (new Date().getMonth() + 1).toString())
  const sYear = parseInt(year || new Date().getFullYear().toString())

  const [categories, budgets] = await Promise.all([
    prisma.category.findMany({ where: { userId: session.user.id }, orderBy: { name: 'asc' } }),
    prisma.budget.findMany({ where: { userId: session.user.id, month: sMonth, year: sYear } })
  ])

  return (
    <div className="min-h-screen bg-background text-white p-6 md:p-10 space-y-8">
      <header className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" /> Voltar ao Dashboard
        </Link>
        <div className="flex items-center gap-2">
           <SettingsIcon className="w-5 h-5 text-primary" />
           <h1 className="text-xl font-bold">Configurações</h1>
        </div>
      </header>

      <section className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black">Metas por Categoria</h2>
          <p className="text-zinc-500 text-sm">Defina quanto você planeja gastar em {sMonth}/{sYear}.</p>
        </div>

        <div className="bg-[#18181b] border border-white/10 rounded-2xl overflow-hidden">
          {categories.map((cat) => {
            const budget = budgets.find(b => b.categoryId === cat.id)
            return (
              <div key={cat.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#3f3f46' }} />
                  <span className="font-bold text-zinc-200">{cat.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-zinc-500">
                    {budget ? `R$ ${budget.amount.toFixed(2)}` : "Sem meta"}
                  </span>
                  <BudgetModal 
                    categoryId={cat.id} 
                    categoryName={cat.name} 
                    currentAmount={budget?.amount || 0}
                    month={sMonth}
                    year={sYear}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="max-w-2xl mx-auto space-y-6 pt-10 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">Patrimônio e Dívidas</h2>
            <p className="text-zinc-500 text-sm">Gerencie seus bens imobilizados e financiamentos.</p>
          </div>
          <div className="flex gap-2">
            <AssetForm />
            <LiabilityForm />
          </div>
        </div>
      </section>

    </div>
  )
}