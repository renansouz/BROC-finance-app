export function calculateWealth(
  accounts: any[] = [],
  investments: any[] = [],
  assets: any[] = [],
  liabilities: any[] = []
) {
  const totalInAccounts = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  
  // Separamos os investimentos por tipo
  const liquidInvestments = investments.filter(inv => !['FGTS', 'PENSION'].includes(inv.type));
  const longTermInvestments = investments.filter(inv => ['FGTS', 'PENSION'].includes(inv.type));

  const totalLiquidInvested = liquidInvestments.reduce((acc, inv) => acc + inv.currentAmount, 0);
  const totalLongTerm = longTermInvestments.reduce((acc, inv) => acc + inv.currentAmount, 0);
  const totalAssetsValue = assets.reduce((acc, asset) => acc + asset.value, 0);
  const totalLiabilities = liabilities.reduce((acc, liab) => acc + liab.totalAmount, 0);

  // Ativos Totais
  const assetsTotal = totalInAccounts + totalLiquidInvested + totalLongTerm + totalAssetsValue;
  
  // Patrimônio Disponível
  const availableWealth = totalInAccounts + totalLiquidInvested - totalLiabilities;

  return {
    totalWealth: assetsTotal - totalLiabilities, // Net Worth total
    availableWealth,                             // Net Worth Líquido (Realidade imediata)
    longTermWealth: totalLongTerm,               // FGTS + Previdência
    assetsTotal,
    liabilitiesTotal: totalLiabilities,
    totalYield: investments.reduce((acc, inv) => acc + (inv.currentAmount - inv.initialAmount), 0),
  };
}