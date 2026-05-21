'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveOnboarding } from "@/app/actions"
import { Car, Home, LineChart, Landmark, Check, Mail, FileUp, MousePointerClick, ChevronRight, ChevronLeft, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"


const STEP_1_ASSETS = [
  { id: 'hasVehicles', label: 'Possuo Veículos', icon: Car },
  { id: 'hasRealEstate', label: 'Possuo Imóveis', icon: Home },
  { id: 'hasFGTS', label: 'Tenho FGTS', icon: Landmark },
  { id: 'hasInvestments', label: 'Sou Investidor', icon: LineChart },
]

const STEP_2_BANKS = [
  { id: 'sofisa', label: 'Sofisa Direto' },
  { id: 'nubank', label: 'Nubank' },
  { id: 'btg', label: 'BTG Pactual' },
  { id: 'xp', label: 'XP Investimentos' },
  { id: 'itau', label: 'Itaú' },
  { id: 'bradesco', label: 'Bradesco' },
  { id: 'inter', label: 'Inter' },
]

const STEP_3_METHODS = [
  { id: 'EMAIL', label: 'Automação via E-mail', icon: Mail, desc: 'Ideal para Sofisa, Nubank, BTG e XP.' },
  { id: 'FILE', label: 'Importação de Arquivo', icon: FileUp, desc: 'Recomendado para Bradesco, Itaú e Inter.' },
  { id: 'MANUAL', label: 'Entrada Manual', icon: MousePointerClick, desc: 'Controle total dígito a dígito.' },
]

export default function OnboardingWizard({ userId }: { userId: string }) {
  const [step, setStep] = useState(1)
  const [assets, setAssets] = useState<string[]>([])
  const [banks, setBanks] = useState<string[]>([])
  const [methods, setMethods] = useState<string[]>([]) 
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggleItem = (id: string, state: string[], setState: any) => {
    setState(state.includes(id) ? state.filter(i => i !== id) : [...state, id])
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const data = {
        hasVehicles: assets.includes('hasVehicles'),
        hasRealEstate: assets.includes('hasRealEstate'),
        hasFGTS: assets.includes('hasFGTS'),
        hasInvestments: assets.includes('hasInvestments'),
        activeBanks: banks.join(','),
        syncMethods: methods.join(',') 
      }
      await saveOnboarding(data)
      toast.success("Perfil configurado com sucesso!")
      router.push('/dashboard')
    } catch (error) {
      toast.error("Erro ao salvar configurações. Tente novamente.")
      setLoading(false) 
    }
  }

  return (
    <div className="space-y-8 w-full">
      <div className="flex gap-2 justify-center mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className={cn("h-1.5 w-12 rounded-full transition-all", step >= i ? "bg-primary" : "bg-zinc-800")} />
        ))}
      </div>
      
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">O que você possui?</h2>
            <p className="text-zinc-500 text-sm">Personalize sua visão de patrimônio.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STEP_1_ASSETS.map((opt) => (
              <button key={opt.id} onClick={() => toggleItem(opt.id, assets, setAssets)} className={cn("flex flex-col items-start p-6 rounded-3xl border transition-all text-left group relative", assets.includes(opt.id) ? "bg-primary/10 border-primary shadow-lg shadow-primary/10" : "bg-card border-white/5 hover:border-white/10")}>
                <div className={cn("p-3 rounded-2xl mb-4 transition-colors", assets.includes(opt.id) ? "bg-primary text-white" : "bg-zinc-900 text-zinc-500")}>
                  <opt.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">{opt.label}</h3>
                {assets.includes(opt.id) && <Check className="absolute top-6 right-6 w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all">
            PRÓXIMO PASSO <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Onde está seu dinheiro?</h2>
            <p className="text-zinc-500 text-sm">Selecione as instituições que você utiliza.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STEP_2_BANKS.map((bank) => (
              <button key={bank.id} onClick={() => toggleItem(bank.id, banks, setBanks)} className={cn("p-4 rounded-2xl border text-center transition-all", banks.includes(bank.id) ? "bg-primary border-primary text-white font-bold" : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/10")}>
                <span className="text-xs">{bank.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="flex-1 border border-white/10 text-zinc-400 font-bold py-4 rounded-2xl hover:bg-white/5">VOLTAR</button>
            <button onClick={() => setStep(3)} className="flex-2 bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200">CONTINUAR <ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Sincronização</h2>
            <p className="text-zinc-500 text-sm">Como você prefere trazer seus dados? (Selecione um ou mais)</p>
          </div>
          <div className="flex flex-col gap-3">
            {STEP_3_METHODS.map((opt) => (
              <button 
                key={opt.id} 
                onClick={() => toggleItem(opt.id, methods, setMethods)} 
                className={cn(
                  "flex items-center gap-4 p-5 rounded-3xl border transition-all text-left",
                  methods.includes(opt.id) ? "bg-primary/10 border-primary" : "bg-card border-white/5 hover:border-white/10"
                )}
              >
                <div className={cn("p-3 rounded-2xl transition-colors", methods.includes(opt.id) ? "bg-primary text-white" : "bg-zinc-900 text-zinc-500")}>
                  <opt.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm">{opt.label}</h3>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">{opt.desc}</p>
                </div>
                {methods.includes(opt.id) && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep(2)} className="flex-1 border border-white/10 text-zinc-400 font-bold py-4 rounded-2xl">VOLTAR</button>
            <button 
              onClick={handleFinish} 
              disabled={loading || methods.length === 0} 
              className="flex-2 bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary/80 transition-all disabled:opacity-50"
            >
              {loading ? "CONFIGURANDO..." : "CONCLUIR SETUP"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}