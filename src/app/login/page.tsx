import { signIn } from "@/auth"
import LoginButton from "@/components/LoginButton"
import Logo from "@/components/Logo"
import { ShieldCheck } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-[420px] z-10 space-y-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <Logo className="text-6xl" />
          <p className="text-zinc-500 font-medium tracking-tight">
            Sua riqueza sob uma nova perspectiva.
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
            <p className="text-sm text-zinc-500">Acesse sua conta com segurança</p>
          </div>

          <LoginButton />

          <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3.5 h-3.5 text-primary/50" />
            <span>Dados Protegidos</span>
          </div>
        </div>

        <div className="text-center">
           <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
             © 2026 BROC. INC — FINANCIAL INTELLIGENCE
           </p>
        </div>
      </div>
    </div>
  )
}