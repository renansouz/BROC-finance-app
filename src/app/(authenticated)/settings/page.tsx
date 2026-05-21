import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Target, Settings2 } from "lucide-react"
import BudgetModal from "@/components/BudgetModal"
import SettingsPreferences from "@/components/SettingsPreferences"
import MobileNav from "@/components/MobileNav"
import UserButton from "@/components/UserButton"

export default async function SettingsPage({ searchParams }: { searchParams: Promise<any> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { month, year } = await searchParams
  const sMonth = parseInt(month || (new Date().getMonth() + 1).toString())
  const sYear = parseInt(year || new Date().getFullYear().toString())

    const monthName = new Date(sYear, sMonth - 1).toLocaleString('pt-BR', { month: 'long' });

  const [categories, budgets, settings] = await Promise.all([
    prisma.category.findMany({ where: { userId: session.user.id }, orderBy: { name: 'asc' } }),
    prisma.budget.findMany({ where: { userId: session.user.id, month: sMonth, year: sYear } }),
    prisma.userSettings.findUnique({ where: { userId: session.user.id } })
  ])

  return (
    <div className="min-h-screen bg-background text-white pb-20 space-y-12">
      <header className="flex items-center justify-between lg:justify-end">
        <MobileNav />
        <UserButton user={session.user} />
      </header>

      <div className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-black tracking-tighter">Configurações</h1>
        <p className="text-zinc-500 font-medium">Personalize seu ecossistema BROC.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Settings2 className="w-5 h-5" />
            <h2 className="text-xl font-bold">Preferências do Sistema</h2>
          </div>
          
          <SettingsPreferences settings={settings} />
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Target className="w-5 h-5" />
            <h2 className="text-xl font-bold">Metas de {monthName} ({sYear})</h2>
          </div>

          <div className="bg-card border border-border rounded-4xl overflow-hidden">
            {categories.map((cat) => {
              const budget = budgets.find(b => b.categoryId === cat.id)
              return (
                <div key={cat.id} className="flex items-center justify-between p-5 border-b border-white/5 last:border-0 hover:bg-white/1">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#3f3f46' }} />
                    <span className="font-bold text-zinc-200">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-zinc-500">
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
      </div>
    </div>
  )
}