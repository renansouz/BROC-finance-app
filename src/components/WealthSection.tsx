'use client'

import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function WealthEvolutionChart({ data }: { data: any[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-75 w-full bg-zinc-900/10 animate-pulse rounded-xl" />

  return (
    <div className="h-75 w-full min-h-0 min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 10 }} 
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
            itemStyle={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: '12px' }}
            formatter={(value: any) => [
              `R$ ${Number(value).toLocaleString('pt-BR')}`, 
              'Patrimônio'
            ] as [string, string]}
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorWealth)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}