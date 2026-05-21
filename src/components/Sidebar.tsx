'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  Settings,
  ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import Logo from "./Logo" 

const MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }, 
  { label: "Transações", href: "/transactions", icon: Wallet },
  { label: "Patrimônio", href: "/wealth", icon: TrendingUp },
  { label: "Contas", href: "/accounts", icon: CreditCard },
  { label: "Configurações", href: "/settings", icon: Settings },
]

export default function Sidebar({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname()

  return (
    <aside className={cn(isMobile ? "flex h-full w-full" : "fixed left-0 top-0 h-screen w-64 hidden lg:flex", "bg-card flex-col p-6 z-50")}
>
      <div className="mb-10">
        <Logo className="text-3xl" /> 
      </div>

      <nav className="flex-1 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-200")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* <div className="mt-auto">
        <Link 
          href="/pro" 
          className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-2xl group hover:bg-primary/20 transition-all"
        >
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Upgrade to Pro</span>
          <ArrowUpRight className="w-3 h-3 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div> */}
    </aside>
  )
}