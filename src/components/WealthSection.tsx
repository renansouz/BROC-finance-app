'use client' 

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WealthEvolutionChart = dynamic(() => import('./WealthEvolutionChart'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-zinc-900/20 animate-pulse rounded-xl" />
});

export default function WealthSection({ data }: { data: any[] }) {
  return (
    <Card className="lg:col-span-2 bg-[#18181b] border-white/10 p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-sm font-bold uppercase text-zinc-500">Histórico de Patrimônio Líquido</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <WealthEvolutionChart data={data} />
      </CardContent>
    </Card>
  );
}