import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AccountForm from "@/components/AccountForm"
import Link from "next/link"
import { ChevronLeft, Landmark, CreditCard } from "lucide-react"
import MobileNav from "@/components/MobileNav"
import UserButton from "@/components/UserButton"

export default async function AccountsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const accounts = await prisma.financialAccount.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between lg:justify-end">
        <MobileNav />
        <UserButton user={session.user} />
      </header>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Contas</h1>
          <p className="text-zinc-500 font-medium">Gerencie suas conexões bancárias.</p>
        </div>
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