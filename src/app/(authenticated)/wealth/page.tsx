import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFullDashboard } from "@/services/dashboard-service";
import WealthSummary from "@/components/WealthSummary";
import WealthSection from "@/components/WealthSection";
import EconomicIndicators from "@/components/EconomicIndicators";
import AssetForm from "@/components/AssetForm"; 
import LiabilityForm from "@/components/LiabilityForm"; 
import MobileNav from "@/components/MobileNav";
import UserButton from "@/components/UserButton";
import prisma from "@/lib/prisma";
import { Landmark, TrendingDown } from "lucide-react";

export default async function WealthPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  
  const [data, assets, liabilities] = await Promise.all([
    getFullDashboard(session.user.id, new Date().getMonth() + 1, new Date().getFullYear(), undefined),
    prisma.asset.findMany({ where: { userId: session.user.id } }),
    prisma.liability.findMany({ where: { userId: session.user.id } })
  ]);

  return (
    <div className="space-y-10 pb-10">
      <header className="flex items-center justify-between lg:justify-end">
        <MobileNav />
        <UserButton user={session.user} />
      </header>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Patrimônio</h1>
          <p className="text-zinc-500 font-medium tracking-tight">Gestão de ativos e passivos de longo prazo.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <AssetForm />
          <LiabilityForm />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 ">
        <div className="lg:col-span-1 space-y-6">
          <WealthSummary totalWealth={data.wealth.totalWealth} totalYield={data.wealth.totalYield} />
          <EconomicIndicators indicators={data.indicators} />
        </div>
        <div className="lg:col-span-2">
          <WealthSection data={data.wealthEvolution} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 text-emerald-500">
            <Landmark className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Ativos Imobilizados</h3>
          </div>
          <div className="bg-card border border-border rounded-4xl overflow-hidden">
            {assets.length > 0 ? assets.map(asset => (
              <div key={asset.id} className="flex justify-between items-center p-5 border-b border-white/5 last:border-0 hover:bg-white/2">
                <span className="font-bold text-zinc-300">{asset.name}</span>
                <span className="font-black text-emerald-400">R$ {asset.value.toLocaleString('pt-BR')}</span>
              </div>
            )) : <p className="p-10 text-center text-zinc-600 italic text-sm">Nenhum bem cadastrado.</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 text-rose-500">
            <TrendingDown className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-widest">Dívidas e Financiamentos</h3>
          </div>
          <div className="bg-card border border-border rounded-4xl overflow-hidden">
            {liabilities.length > 0 ? liabilities.map(liab => (
              <div key={liab.id} className="flex justify-between items-center p-5 border-b border-white/5 last:border-0 hover:bg-white/2">
                <span className="font-bold text-zinc-300">{liab.name}</span>
                <span className="font-black text-rose-500">R$ {liab.totalAmount.toLocaleString('pt-BR')}</span>
              </div>
            )) : <p className="p-10 text-center text-zinc-600 italic text-sm">Nenhuma dívida cadastrada.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}