import Link from "next/link";
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");
  
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-25%] left-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 flex items-center justify-between p-8 max-w-7xl mx-auto">
        <Logo />
        <Link 
          href="/dashboard" 
          className="text-sm font-bold bg-white text-black px-6 py-3 rounded-full hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
        >
          Acessar App
        </Link>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-32 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          O novo padrão da gestão patrimonial
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85]">
          Sua riqueza sob uma <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-400 to-indigo-400">
            nova perspectiva.
          </span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-12 font-medium leading-relaxed">
          O <span className="text-white font-bold">BROQ.</span> consolida seus ativos e gastos em uma interface de alta performance. Simples. Inteligente. Imparável.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-2xl transition-all shadow-2xl shadow-primary/20 group text-lg"
          >
            Começar jornada 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-10 py-5 rounded-2xl font-bold border border-white/10 hover:bg-white/5 transition-all text-zinc-300 text-lg">
            Ver como funciona
          </button>
        </div>

        <div className="mt-28 w-full aspect-video bg-zinc-900/50 rounded-[40px] border border-white/10 shadow-[0_0_100px_-20px_rgba(139,92,246,0.15)] overflow-hidden relative group p-4">
           <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />
           <div className="w-full h-full rounded-[24px] overflow-hidden border border-white/5 bg-[#0c0c0e]">
              <img 
                 src="https://i.imgur.com/6knbgSD.png" 
                 alt="broq Dashboard Preview" 
                 className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700"
              />
           </div>
           <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Interface Premium broq.
              </div>
           </div>
        </div>
      </main>

      {/* Seção de Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32 grid md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: "Automação Real", desc: "Integração via n8n para processar e receber seus gastos em tempo real." },
          { icon: BarChart3, title: "Visão 360º", desc: "Patrimônio líquido, ativos imobilizados e investimentos em um só lugar." },
          { icon: Shield, title: "Cofre de Dados", desc: "Isolamento total e criptografia de ponta para sua privacidade financeira." },
        ].map((feat, i) => (
          <div key={i} className="p-10 bg-white/[0.03] border border-white/5 rounded-[32px] hover:border-primary/30 transition-all duration-500 group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <feat.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-zinc-100">{feat.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}