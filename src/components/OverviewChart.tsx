'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Jan", total: 1200 },
  { name: "Fev", total: 2100 },
  { name: "Mar", total: 800 },
]

export default function OverviewChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `R$${value}`}
          />
          <Tooltip 
            cursor={{fill: '#27272a'}}
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }}
          />
          <Bar 
            dataKey="total" 
            fill="var(--color-primary)" 
            radius={[4, 4, 0, 0]} 
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}