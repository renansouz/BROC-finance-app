'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveOnboarding } from "@/app/actions"
import { Car, Home, LineChart, Landmark, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { id: 'hasVehicles', label: 'Possuo Veículos', icon: Car, desc: 'Carros, motos ou frotas.' },
  { id: 'hasRealEstate', label: 'Possuo Imóveis', icon: Home, desc: 'Casa, apto ou terrenos.' },
  { id: 'hasFGTS', label: 'Tenho FGTS', icon: Landmark, desc: 'Saldo retido ou reserva.' },
  { id: 'hasInvestments', label: 'Sou Investidor', icon: LineChart, desc: 'Ações, CDBs ou Crypto.' },
]

export default function OnboardingWizard({ userId }: { userId: string }) {
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggleOption = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleFinish = async () => {
    setLoading(true)
    const data = {
      hasVehicles: selected.includes('hasVehicles'),
      hasRealEstate: selected.includes('hasRealEstate'),
      hasFGTS: selected.includes('hasFGTS'),
      hasInvestments: selected.includes('hasInvestments'),
    }
    await saveOnboarding(data)
    router.push('/dashboard')
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.id)
          return (
            <button
              key={opt.id}
              onClick={() => toggleOption(opt.id)}
              className={cn(
                "flex flex-col items-start p-6 rounded-3xl border transition-all text-left group relative overflow-hidden",
                isSelected 
                  ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(139,92,246,0.1)]" 
                  : "bg-card border-white/5 hover:border-white/10"
              )}
            >
              <div className={cn(
                "p-3 rounded-2xl mb-4 transition-colors",
                isSelected ? "bg-primary text-white" : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
              )}>
                <opt.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white">{opt.label}</h3>
              <p className="text-xs text-zinc-500 mt-1">{opt.desc}</p>
              
              {isSelected && (
                <div className="absolute top-4 right-4 text-primary">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={handleFinish}
        disabled={loading}
        className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? "CONFIGURANDO..." : "FINALIZAR SETUP"}
      </button>
    </div>
  )
}