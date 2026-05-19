'use client'

import Link from "next/link";
import SearchInput from "./SearchInput";
import CategoryPicker from "./CategoryPicker";

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
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-zinc-300 tracking-tight">
          Detalhamento das Transações
        </h2>
        <SearchInput />
      </div>

      {/* Container da Tabela */}
      <div className="rounded-2xl border border-white/10 bg-[#18181b] overflow-hidden shadow-2xl">
        <table className="w-full text-sm">
          <thead className="hidden md:table-header-group bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-5 text-left font-bold text-zinc-400 uppercase tracking-tighter">Descrição</th>
              <th className="px-6 py-5 text-left font-bold text-zinc-400 uppercase tracking-tighter">Categoria</th>
              <th className="px-6 py-5 text-right font-bold text-zinc-400 uppercase tracking-tighter">Valor</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {transactions.map((t) => (
              <tr 
                key={t.id} 
                className="flex flex-col md:table-row hover:bg-white/2 transition-colors px-6 py-4 md:px-0 md:py-0"
              >
                {/* Descrição + Valor (Mobile) */}
                <td className="md:px-6 md:py-5 flex justify-between items-start md:table-cell">
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-200 text-base md:text-sm">{t.description}</span>
                    <span className="md:hidden text-[10px] text-zinc-500 uppercase font-bold">
                      {new Date(t.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <span className={`md:hidden font-black text-base ${t.amount < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                    {formatCurrency(t.amount)}
                  </span>
                </td>

                {/* Categoria */}
                <td className="mt-2 md:mt-0 md:px-6 md:py-5 flex items-center md:table-cell">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: t.category?.color || '#3f3f46' }}
                    />
                    <CategoryPicker 
                      transactionId={t.id} 
                      currentCategoryId={t.categoryId} 
                      categories={categories} 
                    />
                  </div>
                </td>

                {/* Valor (Desktop) */}
                <td
                  className={`hidden md:table-cell px-6 py-5 text-right font-black ${
                    t.amount < 0 ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {formatCurrency(t.amount)}
                </td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-20 text-center text-zinc-500 italic">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalTransactions > currentLimit && (
          <div className="p-4 border-t border-white/10 flex justify-center">
            <Link
              href={`/dashboard?month=${month}&year=${year}${q ? `&q=${q}` : ''}&limit=${currentLimit + 10}`}
              scroll={false}
              className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
            >
              Ver mais transações (+10)
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}