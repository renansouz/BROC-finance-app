import prisma from "@/lib/prisma";
import { addTransaction } from "./actions";
import ImportForm from "@/components/ImportForm";
import CategoryPicker from "@/components/CategoryPicker";

export default async function Home() {
  
  const transactions = await prisma.transaction.findMany({
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    }
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <main className="max-w-6xl mx-auto p-10 font-sans">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Fluxo de Caixa
        </h1>
        <p className="text-gray-500 mt-2">Gerencie suas finanças de forma simples.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        <section className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">
            Novo Lançamento
          </h2>
          <form action={addTransaction} className="flex flex-col gap-4">
            <input 
              name="description" 
              placeholder="Descrição (ex: Almoço)" 
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              required 
            />
            <div className="flex gap-4">
              <input 
                name="amount" 
                type="number" 
                step="0.01" 
                placeholder="Valor (ex: -50.50)" 
                className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required 
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95"
              >
                Salvar
              </button>
            </div>
            <p className="text-[10px] text-gray-400">Use sinal de menos (-) para despesas.</p>
          </form>
        </section>

        <section className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 flex flex-col justify-center">
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 text-center">
            Importação em Massa
          </h2>
          <ImportForm />
        </section>

      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-700">Últimas Movimentações</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-gray-400 font-semibold border-b border-gray-100">
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 text-gray-700 font-medium">{t.description}</td>
                  <td className="px-6 py-4">
                     <CategoryPicker 
                        transactionId={t.id} 
                        currentCategoryId={t.categoryId} 
                        categories={categories} 
                      />
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${t.amount < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                  </td>
                </tr>
              ))}
              
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-gray-400 font-medium">Nenhum dado encontrado.</p>
                      <p className="text-xs text-gray-300">Comece adicionando ou importando uma transação.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}