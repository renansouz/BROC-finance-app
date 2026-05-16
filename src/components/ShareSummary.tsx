'use client'

import { toast } from "sonner"
import { Share2 } from "lucide-react"

interface Props {
  month: string
  year: string
  balance: number
  incomes: number
  expenses: number
  budgets: {
    categoryName: string
    spent: number
    limit: number
  }[]
}

export default function ShareSummary({ month, year, balance, incomes, expenses, budgets }: Props) {
  const format = (val: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const handleCopy = () => {
    let text = `📊 *FINANCE.RDEV - Resumo de ${month}/${year}*\n\n`;
    text += `💰 *Saldo:* ${format(balance)}\n`;
    text += `📈 *Receitas:* ${format(incomes)}\n`;
    text += `📉 *Despesas:* ${format(expenses)}\n\n`;

    if (budgets.length > 0) {
      text += `🎯 *Status das Metas:*\n`;
      budgets.forEach(b => {
        const percent = ((b.spent / b.limit) * 100).toFixed(0);
        text += `- ${b.categoryName}: ${percent}% (${format(b.spent)} / ${format(b.limit)})\n`;
      });
    }

    text += `\n_Gerado automaticamente pelo FINANCE.RDEV_`;

    navigator.clipboard.writeText(text);
    toast.success("Resumo copiado para a área de transferência!");
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold py-2 px-4 rounded-xl border border-white/10 transition-all text-xs"
    >
      <Share2 className="w-4 h-4" />
      Copiar Resumo
    </button>
  );
}