import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFullDashboard } from "@/services/dashboard-service";
import { performUserOnboarding } from "@/services/onboarding";

import MobileNav from "@/components/MobileNav";
import UserButton from "@/components/UserButton";
import EmptyStateGuide from "@/components/EmptyStateGuide";

import MonthPicker from "@/components/MonthPicker";
import ActionModal from "@/components/ActionModal";
import SummaryCards from "@/components/SummaryCards";
import CreditCardsSection from "@/components/CreditCardsSection";
import AnalyticsSection from "@/components/AnalyticsSection";
import ShareSummary from "@/components/ShareSummary";
import PaymentTimeline from "@/components/PaymentTimeline";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<any> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const { month, year, q } = await searchParams;

  const sMonth = parseInt(month || (new Date().getMonth() + 1).toString());
  const sYear = parseInt(year || new Date().getFullYear().toString());

  const data = await getFullDashboard(userId, sMonth, sYear, q);

  if (!data.settings.isOnboardingComplete) {
    redirect("/setup");
  }

  await performUserOnboarding(userId);
  
  const hasTransactions = data.finance.transactions.length > 0;
  const bankList = data.settings.activeBanks?.split(',') || [];

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between lg:justify-end">
        <MobileNav />
        <UserButton user={session.user} />
      </header>
      
      <SummaryCards 
        balance={data.finance.totalBalance} 
        incomes={data.finance.totalIncomes} 
        expenses={data.finance.totalExpenses} 
      />
      
      <section className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card/40 p-4 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <MonthPicker />
          <div className="w-px h-6 bg-border hidden sm:block" />
          <ShareSummary 
            month={sMonth.toString().padStart(2, '0')}
            year={sYear.toString()}
            balance={data.finance.totalBalance}
            incomes={data.finance.totalIncomes}
            expenses={data.finance.totalExpenses}
            budgets={data.finance.budgetSummary}
          />
        </div>
        <ActionModal accounts={data.accounts} categories={data.categories} />
      </section>
      
      {!hasTransactions ? (
        <div className="py-10">
          <EmptyStateGuide 
            syncMethods={data.settings.syncMethods || 'MANUAL'} // Alterado para o plural
            activeBanks={bankList} 
          />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3 animate-in fade-in duration-700">
          <div className="lg:col-span-2 space-y-8">
            <AnalyticsSection 
              evolutionData={data.evolutionData}
              chartData={data.finance.chartData}
              topExpenses={data.finance.topExpenses}
            />
          </div>
          
          <div className="space-y-8">
            <div className="p-6 bg-primary/5 rounded-4xl border border-primary/10 shadow-sm group hover:border-primary/30 transition-all">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Liquidez Disponível</p>
              <p className="text-4xl font-black text-white mt-1">
                R$ {data.wealth.availableWealth.toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] px-2">Próximos Pagamentos</h3>
              <PaymentTimeline items={data.paymentItems} />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] px-2">Meus Cartões</h3>
              <CreditCardsSection data={data.finance.creditCardsData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}