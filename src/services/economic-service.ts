export async function getEconomicIndicators() {
  try {
    // Série 432: SELIC acumulada no mês (%)
    // Série 433: IPCA variação mensal (%)
    const [selicRes, ipcaRes] = await Promise.all([
      fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/12?formato=json"),
      fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json")
    ]);

    if (!selicRes.ok || !ipcaRes.ok) throw new Error("API do BCB fora do ar");

    const selicData = await selicRes.json();
    const ipcaData = await ipcaRes.json();

    const lastSelic = selicData[selicData.length - 1].valor;
    const lastIpca = ipcaData[ipcaData.length - 1].valor;

    return {
      selic: parseFloat(lastSelic),
      ipca: parseFloat(lastIpca)
    };
  } catch (error) {
    console.error("Erro ao buscar indicadores:", error);
    return { selic: 0, ipca: 0 };
  }
}