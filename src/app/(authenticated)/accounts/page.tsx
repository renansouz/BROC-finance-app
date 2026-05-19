import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AccountForm from "@/components/AccountForm"
import Link from "next/link"
import { ChevronLeft, Landmark, CreditCard } from "lucide-react"

export default async function AccountsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const accounts = await prisma.financialAccount.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-10 space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" /> Voltar ao Dashboard
        </Link>
        <AccountForm />
      </div>

      <h1 className="text-3xl font-black">Minhas Contas e Cartões</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-[#18181b] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              {acc.type === 'CREDIT' ? <CreditCard /> : <Landmark />}
            </div>
            <div>
              <p className="font-bold text-lg">{acc.name}</p>
              <p className="text-xs text-zinc-500 uppercase font-black tracking-widest">{acc.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}