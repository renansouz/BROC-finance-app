export function calculateWealth(accounts: any[], investments: any[]) {
  const totalInAccounts = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0); 
  
  const totalInvested = investments.reduce((acc, inv) => acc + inv.currentAmount, 0);
  const totalYield = investments.reduce((acc, inv) => acc + (inv.currentAmount - inv.initialAmount), 0);

  return {
    totalWealth: totalInAccounts + totalInvested,
    totalInvested,
    totalYield,
    yieldPercentage: totalInvested > 0 ? (totalYield / totalInvested) * 100 : 0
  };
}