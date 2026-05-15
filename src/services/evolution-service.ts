import prisma from "@/lib/prisma";

export async function getEvolutionData(userId: string, selectedMonth: number, selectedYear: number) {
  // Calcular o intervalo de 6 meses atrás
  const sixMonthsAgo = new Date(selectedYear, selectedMonth - 6, 1);
  const endOfPeriod = new Date(selectedYear, selectedMonth, 1);

  // Buscar transações no banco
  const periodTransactions = await prisma.transaction.findMany({
    where: { 
      userId, 
      date: { gte: sixMonthsAgo, lt: endOfPeriod } 
    },
  });

  // Montar o array de evolução
  const evolutionData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(selectedYear, selectedMonth - 1 - i, 1);
    const monthName = d.toLocaleString("pt-BR", { month: "short" }).toUpperCase();
    
    const mTransactions = periodTransactions.filter(
      (t) => t.date.getMonth() === d.getMonth() && t.date.getFullYear() === d.getFullYear()
    );

    evolutionData.push({
      month: monthName,
      receitas: mTransactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0),
      despesas: Math.abs(mTransactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0)),
    });
  }

  return evolutionData;
}