'use client'

import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, AlertCircle, CheckCircle2 } from "lucide-react";

interface PaymentItem {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  type: 'BILL' | 'CREDIT_CARD';
  isPaid?: boolean;
}

export default function PaymentTimeline({ items }: { items: PaymentItem[] }) {
  const sortedItems = [...items].sort((a, b) => a.dueDay - b.dueDay);

  const today = new Date().getDate();

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarClock className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-zinc-300">Agenda de Pagamentos</h2>
      </div>

      <div className="flex flex-col gap-3">
        {sortedItems.map((item) => {
          const isLate = item.dueDay < today && !item.isPaid;
          const isToday = item.dueDay === today;

          return (
            <div 
              key={item.id} 
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                isLate ? 'bg-rose-500/5 border-rose-500/20' : 
                isToday ? 'bg-primary/5 border-primary/20' : 'bg-[#18181b] border-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isLate ? 'bg-rose-500/20' : 'bg-zinc-800'}`}>
                  <span className={`text-xs font-black ${isLate ? 'text-rose-500' : 'text-zinc-400'}`}>
                    DIA {item.dueDay.toString().padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200">{item.name}</p>
                  <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter">
                    {item.type === 'CREDIT_CARD' ? 'Fatura Cartão' : 'Conta Fixa'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className={`text-sm font-black ${isLate ? 'text-rose-500' : 'text-zinc-200'}`}>
                  R$ {item.amount.toLocaleString('pt-BR')}
                </span>
                {item.isPaid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className={`w-5 h-5 ${isLate ? 'text-rose-500' : 'text-zinc-700'}`} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}