export function getBillingPeriod(month: number, year: number, closingDay: number) {
  const startDate = new Date(year, month - 2, closingDay + 1);
  
    const endDate = new Date(year, month - 1, closingDay, 23, 59, 59);

  return { startDate, endDate };
}