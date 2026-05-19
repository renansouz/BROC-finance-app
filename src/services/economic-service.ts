export async function getEconomicIndicators() {
  try {
    const [selicRes, ipcaRes] = await Promise.all([
      fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1/formato=json"),
      fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1/formato=json")
    ]);

    if (!selicRes.ok || !ipcaRes.ok) {
      return { selic: 0, ipca: 0 };
    }

    const selicData = await selicRes.json();
    const ipcaData = await ipcaRes.json();

    return {
      selic: parseFloat(selicData[0]?.valor || 0),
      ipca: parseFloat(ipcaData[0]?.valor || 0)
    };
  } catch (error) {
    return { selic: 0, ipca: 0 };
  }
}