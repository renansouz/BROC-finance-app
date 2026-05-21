'use client'

import Link from "next/link";
import SearchInput from "./SearchInput";
import CategoryPicker from "./CategoryPicker";
import { deleteTransaction } from "@/app/actions";
import { Trash2 } from "lucide-react";
import EditableDescription from "./EditableDescription";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Date;
  categoryId: string | null;
  category: {
    name: string;
    color: string | null;
  } | null;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  transactions: Transaction[];
  totalTransactions: number;
  currentLimit: number;
  categories: Category[];
  month: string;
  year: string;
  q: string;
}

export default function TransactionsSection({
  transactions,
  totalTransactions,
  currentLimit,
  categories,
  month,
  year,
  q
}: Props) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
  <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-zinc-300 tracking-tight">
          Detalhamento das Transações
        </h2>
        <SearchInput />
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#18181b] overflow-hidden shadow-2xl">
        <table className="w-full text-sm">
          <thead className="hidden md:table-header-group bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-5 text-left font-bold text-zinc-400 uppercase tracking-tighter">Descrição</th>
              <th className="px-6 py-5 text-left font-bold text-zinc-400 uppercase tracking-tighter">Categoria</th>
              <th className="px-6 py-5 text-right font-bold text-zinc-400 uppercase tracking-tighter">Valor</th>
              <th className="px-6 py-5 text-right font-bold text-zinc-400 uppercase tracking-tighter"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {transactions.map((t) => (
              <tr key={t.id} className="group hover:bg-white/2 transition-colors">
                <td className="px-6 py-5">
                  <EditableDescription id={t.id} initialValue={t.description} />
                  
                  <span className="text-[10px] text-zinc-500 uppercase font-black md:hidden">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </span>
                </td>
                
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.category?.color || '#3f3f46' }} />
                    <CategoryPicker transactionId={t.id} currentCategoryId={t.categoryId} categories={categories} />
                  </div>
                </td>

                <td className={`px-6 py-5 text-right font-black tabular-nums ${t.amount < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(t.amount)}
                </td>

                <td className="px-4 py-5 text-right w-12.5">
                  <button 
                    onClick={() => deleteTransaction(t.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/10 text-zinc-600 hover:text-rose-500 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalTransactions > currentLimit && (
          <div className="p-4 border-t border-white/10 flex justify-center">
            <Link
              href={`/transactions?${q ? `q=${q}&` : ''}limit=${currentLimit + 20}`}
              scroll={false}
              className="text-xs font-black text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
            >
              Carregar mais histórico (+20)
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}