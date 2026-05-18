'use client'

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function EvolutionChart({ data }: { data: any[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-75 w-full bg-zinc-900/10 animate-pulse rounded-xl" />

  return (
    <div className="h-75 w-full min-h-0 min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 10 }}
            tickFormatter={(value) => `R$${value}`}
          />
          <Tooltip 
            cursor={{ fill: '#27272a', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px' }} />
          <Bar dataKey="receitas" name="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={15} />
          <Bar dataKey="despesas" name="Despesas" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={15} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}