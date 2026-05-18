import prisma from "@/lib/prisma";
import { calculateWealth } from "@/services/investment-service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")
  const userId = searchParams.get("userId")

  if (token !== process.env.WEBHOOK_SECRET_TOKEN || !userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const [accounts, investments, assets, liabilities, user] = await Promise.all([
    prisma.financialAccount.findMany({ where: { userId } }),
    prisma.investment.findMany({ where: { userId } }),
    prisma.asset.findMany({ where: { userId } }),
    prisma.liability.findMany({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId } })
  ]);

  const accountsWithBalance = await Promise.all(accounts.map(async (acc) => {
    const transactions = await prisma.transaction.findMany({ where: { financialAccountId: acc.id } });
    const balance = transactions.reduce((sum, t) => sum + t.amount, 0);
    return { ...acc, balance };
  }));

  const wealth = calculateWealth(accountsWithBalance, investments, assets, liabilities);

  return NextResponse.json({
    name: user?.name?.split(" ")[0] || "Investidor",
    netWorth: wealth.totalWealth,
    assets: wealth.assetsTotal,
    debts: wealth.liabilitiesTotal,
    yield: wealth.totalYield
  });
}