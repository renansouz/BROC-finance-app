export function calculateWealth(
  accounts: any[] = [],   
  investments: any[] = [], 
  assets: any[] = [], 
  liabilities: any[] = []
) {

  const totalInAccounts = (accounts || []).reduce((acc, curr) => acc + (curr.balance || 0), 0);
  const totalInvested = investments.reduce((acc, inv) => acc + inv.currentAmount, 0);
  const totalAssetsValue = assets.reduce((acc, asset) => acc + asset.value, 0);
  const totalLiabilities = liabilities.reduce((acc, liab) => acc + liab.totalAmount, 0);

  // Ativos totais
  const assetsTotal = totalInAccounts + totalInvested + totalAssetsValue;
  
  // Patrimônio Líquido
  const netWorth = assetsTotal - totalLiabilities;

  // Rendimento dos investimentos
  const totalYield = investments.reduce((acc, inv) => acc + (inv.currentAmount - inv.initialAmount), 0);

  return {
    totalWealth: netWorth, 
    assetsTotal,
    liabilitiesTotal: totalLiabilities,
    totalYield,
  };
}