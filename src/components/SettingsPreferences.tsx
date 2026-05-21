'use client'

import { useState } from "react"
import { saveOnboarding } from "@/app/actions"
import { Car, Home, LineChart, Landmark, Mail, FileUp, MousePointerClick, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Props {
  settings: any
}

export default function SettingsPreferences({ settings }: Props) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    hasVehicles: settings.hasVehicles,
    hasRealEstate: settings.hasRealEstate,
    hasFGTS: settings.hasFGTS,
    hasInvestments: settings.hasInvestments,
    activeBanks: settings.activeBanks?.split(',') || [],
    syncMethods: settings.syncMethods?.split(',') || ['MANUAL'],
  })

  const BANKS = ['sofisa', 'nubank', 'btg', 'xp', 'itau', 'bradesco', 'inter']

  const handleSave = async () => {
    setLoading(true)
    try {
      await saveOnboarding({
        ...formData,
        activeBanks: formData.activeBanks.join(','),
        syncMethods: formData.syncMethods.join(','),
      })
      toast.success("Preferências atualizadas!")
    } catch (error) {
      toast.error("Erro ao salvar.")
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (key: string, value: string) => {
    setFormData(prev => {
      const list = (prev as any)[key]
      const newList = list.includes(value) ? list.filter((i: string) => i !== value) : [...list, value]
      return { ...prev, [key]: newList }
    })
  }

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest px-1">Ativos Visíveis no Patrimônio</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'hasVehicles', label: 'Veículos', icon: Car },
            { id: 'hasRealEstate', label: 'Imóveis', icon: Home },
            { id: 'hasFGTS', label: 'FGTS', icon: Landmark },
            { id: 'hasInvestments', label: 'Investimentos', icon: LineChart },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setFormData(prev => ({ ...prev, [item.id]: !(prev as any)[item.id] }))}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all",
                (formData as any)[item.id] ? "bg-primary/10 border-primary text-primary" : "bg-zinc-900 border-white/5 text-zinc-500"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest px-1">Instituições Financeiras</h3>
        <div className="flex flex-wrap gap-2">
          {BANKS.map(bank => (
            <button
              key={bank}
              onClick={() => toggleItem('activeBanks', bank)}
              className={cn(
                "px-4 py-2 rounded-full border text-[10px] font-black uppercase transition-all",
                formData.activeBanks.includes(bank) ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-500 border-white/5"
              )}
            >
              {bank}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest px-1">Métodos de Sincronização</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'EMAIL', label: 'E-mail', icon: Mail },
            { id: 'FILE', label: 'Arquivo', icon: FileUp },
            { id: 'MANUAL', label: 'Manual', icon: MousePointerClick },
          ].map(method => (
            <button
              key={method.id}
              onClick={() => toggleItem('syncMethods', method.id)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                formData.syncMethods.includes(method.id) ? "bg-primary/10 border-primary text-primary" : "bg-zinc-900 border-white/5 text-zinc-500"
              )}
            >
              <method.icon className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">{method.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-50"
      >
        {loading ? "SALVANDO..." : "ATUALIZAR PREFERÊNCIAS"}
      </button>
    </div>
  )
}