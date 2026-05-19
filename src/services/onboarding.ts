import prisma from "@/lib/prisma";

const DEFAULT_CATEGORIES = [
  { name: "Alimentação", color: "#10b981" },
  { name: "Transporte", color: "#3b82f6" }, 
  { name: "Lazer", color: "#8b5cf6" },   
  { name: "Moradia", color: "#f43f5e" },      
  { name: "Contas Fixas", color: "#f59e0b" }, 
  { name: "Salário", color: "#22c55e" },     
  { name: "Sem categoria", color: "#71717a" }, 
];

export async function performUserOnboarding(userId: string) {
  const categoryCount = await prisma.category.count({ where: { userId } });
  if (categoryCount === 0) {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map(cat => ({ ...cat, userId }))
    });
  }

  const accountCount = await prisma.financialAccount.count({ where: { userId } });
  if (accountCount === 0) {
    await prisma.financialAccount.create({
      data: {
        name: "Minha Conta",
        type: "CHECKING", 
        userId: userId
      }
    });
  }

  const settings = await prisma.userSettings.findUnique({ where: { userId } });

  if (!settings) {
    await prisma.userSettings.create({ data: { userId } });
  }

}