import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFullDashboard } from "@/services/dashboard-service";
import TransactionsSection from "@/components/TransactionsSection";
import MobileNav from "@/components/MobileNav";
import UserButton from "@/components/UserButton";
import prisma from "@/lib/prisma"; 

export default async function TransactionsPage({ searchParams }: { searchParams: Promise<any> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { q, limit } = await searchParams;
  const currentLimit = parseInt(limit || "20");

  const allTransactions = await prisma.transaction.findMany({
    where: { 
      userId: session.user.id,
      description: q ? { contains: q, mode: 'insensitive' } : undefined
    },
    include: { financialAccount: true, category: true },
    orderBy: { date: 'desc' }, 
    take: currentLimit 
  });

  const totalTransactions = await prisma.transaction.count({
    where: { userId: session.user.id }
  });

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between lg:justify-end">
        <MobileNav />
        <UserButton user={session.user} />
      </header>

      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-black tracking-tighter">Histórico Geral</h1>
        <p className="text-zinc-500 text-sm">Todas as suas movimentações em um só lugar.</p>
      </div>

      <TransactionsSection 
        transactions={allTransactions}
        totalTransactions={totalTransactions}
        currentLimit={currentLimit}
        categories={categories}
        month="" 
        year=""
        q={q || ""}
      />
    </div>
  );
}