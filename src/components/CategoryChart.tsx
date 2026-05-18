'use client'

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export default function CategoryChart({ data }: { data: any[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-75 w-full bg-zinc-900/10 animate-pulse rounded-xl" />

  return (
    <div className="h-75 w-full min-h-0 min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#3f3f46'} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
            itemStyle={{ color: '#fff', fontSize: '12px' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}