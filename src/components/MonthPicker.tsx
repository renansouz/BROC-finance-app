'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function MonthPicker() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentMonth = searchParams.get('month') || (new Date().getMonth() + 1).toString().padStart(2, '0')
  const currentYear = searchParams.get('year') || new Date().getFullYear().toString()

  const months = [
    { label: 'Janeiro', value: '01' }, { label: 'Fevereiro', value: '02' },
    { label: 'Março', value: '03' }, { label: 'Abril', value: '04' },
    { label: 'Maio', value: '05' }, { label: 'Junho', value: '06' },
    { label: 'Julho', value: '07' }, { label: 'Agosto', value: '08' },
    { label: 'Setembro', value: '09' }, { label: 'Outubro', value: '10' },
    { label: 'Novembro', value: '11' }, { label: 'Dezembro', value: '12' },
  ]

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 3 + i).toString())

    const handleUpdate = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`/dashboard?${params.toString()}`)
  }
  return (
    <div className="flex gap-2 bg-zinc-900 border border-white/10 p-1.5 rounded-xl">
      <select 
        value={currentMonth}
        onChange={(e) => handleUpdate('month', e.target.value)}
        className="bg-transparent text-xs font-bold text-zinc-300 px-3 py-1.5 outline-none cursor-pointer hover:text-white"
      >
        {months.map(m => <option key={m.value} value={m.value} className="bg-zinc-900">{m.label}</option>)}
      </select>

      <div className="w-px bg-white/10 my-1" />

      <select 
        value={currentYear}
        onChange={(e) => handleUpdate('year', e.target.value)}
        className="bg-transparent text-xs font-bold text-zinc-300 px-3 py-1.5 outline-none cursor-pointer hover:text-white"
      >
        {years.map(y => <option key={y} value={y} className="bg-zinc-900">{y}</option>)}
      </select>
    </div>
  )
}