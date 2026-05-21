'use client'

import { Mail, FileUp, MousePointerClick, Info, Copy, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Props {
  syncMethods: string 
  activeBanks: string[]
}

export default function EmptyStateGuide({ syncMethods, activeBanks }: Props) {
  const methods = syncMethods?.split(',') || []
  
  const copyWebhook = () => {
    navigator.clipboard.writeText("https://api.broc.com/webhook/v1/transaction")
    toast.success("Link do seu robô copiado!")
  }

  const hasEmail = methods.includes('EMAIL')
  const hasFile = methods.includes('FILE')
  const isOnlyManual = methods.length === 1 && methods.includes('MANUAL')

  return (
    <div className="bg-card border border-primary/20 rounded-[40px] p-8 md:p-16 text-center space-y-12 animate-in fade-in zoom-in duration-700">
      
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Configuração de entrada ativa
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">
          Quase lá, {activeBanks.length > 0 ? 'investidor' : 'parceiro'}!
        </h2>
        <p className="text-zinc-500 text-sm md:text-base font-medium">
          Detectamos que você opera com <strong>{activeBanks.length} instituições</strong>. 
          Siga os passos abaixo para ativar seu dashboard automaticamente:
        </p>
      </div>
      
      <div className={cn(
        "grid grid-cols-1 gap-8 text-left max-w-6xl mx-auto",
        hasEmail && hasFile ? "lg:grid-cols-2" : "max-w-2xl"
      )}>
        
        {hasEmail && (
          <div className="bg-zinc-900/30 p-8 rounded-4xl border border-white/5 space-y-6 relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Mail className="w-24 h-24 text-primary" />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Via Automação</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-primary uppercase">Passo 1</span>
                <p className="text-sm font-bold text-zinc-300 leading-tight">
                  Ative as notificações de compra por e-mail no app do seu banco.
                </p>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-black text-primary uppercase">Passo 2</span>
                <p className="text-sm font-bold text-zinc-300 leading-tight">
                  Crie uma regra de encaminhamento automático para o seu link único:
                </p>
                <button 
                  onClick={copyWebhook} 
                  className="w-full flex items-center justify-between bg-zinc-950 border border-white/10 p-3 rounded-xl hover:bg-zinc-900 transition-all group/btn"
                >
                  <span className="text-[10px] font-mono text-zinc-500 truncate mr-2">api.broc.com/web...</span>
                  <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase">
                    <Copy className="w-3 h-3" /> Copiar
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {hasFile && (
          <div className="bg-zinc-900/30 p-8 rounded-4xl border border-white/5 space-y-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileUp className="w-24 h-24 text-blue-500" />
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                <FileUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Via Arquivos</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-blue-500 uppercase">Passo 1</span>
                <p className="text-sm font-bold text-zinc-300 leading-tight">
                  No seu Internet Banking, exporte o extrato do mês no formato <strong>.OFX</strong> ou <strong>.CSV</strong>.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-blue-500 uppercase">Passo 2</span>
                <p className="text-sm font-bold text-zinc-300 leading-tight">
                  Clique no botão <strong>"Nova Transação"</strong> no topo da página e selecione a aba <strong>"Importar"</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {isOnlyManual && (
          <div className="bg-zinc-900/30 p-10 rounded-4xl border border-white/5 text-center space-y-4">
             <MousePointerClick className="w-10 h-10 text-zinc-500 mx-auto" />
             <p className="text-sm font-bold text-zinc-300">
               Você escolheu o modo manual. Use o botão roxo no topo para começar a registrar seus gastos agora mesmo.
             </p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-4 pt-6">
        <div className="flex items-center gap-2 text-zinc-600">
          <Info className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">O guia sumirá automaticamente após a primeira sincronização</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {activeBanks.map(bank => (
            <span key={bank} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-bold text-zinc-500 uppercase">
              {bank}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}