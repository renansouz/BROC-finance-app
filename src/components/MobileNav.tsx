'use client'

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Sidebar from "./Sidebar"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="lg:hidden flex items-center gap-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="p-2 hover:bg-white/5 rounded-lg text-zinc-400">
          <Menu className="w-6 h-6" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-card border-r-border w-72">
          <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
          <Sidebar isMobile />
        </SheetContent>
      </Sheet>
      <h1 className="text-lg font-black tracking-tighter">BROC<span className="text-primary">.</span></h1>
    </div>
  )
}