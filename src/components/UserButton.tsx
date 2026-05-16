'use client'

import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { LogOut, ChevronDown, Settings, User } from "lucide-react"
import Link from "next/link"


interface UserButtonProps {
  user: {
    name?: string | null
    image?: string | null
    email?: string | null
  }
}

export default function UserButton({ user }: UserButtonProps) {
  const firstName = user.name?.split(" ")[0] || "Usuário"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex cursor-pointer items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 pr-3 rounded-full transition-all outline-none">
          <Avatar className="w-7 h-7 border border-primary/20">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="bg-zinc-800 text-[10px]">
              {firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <span className="text-xs font-bold text-zinc-200 truncate max-w-20">
            {firstName}
          </span>
          
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-[#18181b] border-white/10 text-white" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none text-zinc-200">{user.name}</p>
            <p className="text-xs leading-none text-zinc-500">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem className="focus:bg-white/5 cursor-pointer">
          <User className="mr-2 h-4 w-4 text-zinc-400" />
          <span>Meu Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-white/5 cursor-pointer">
          <Link className="gap-1.5 flex" href="/settings">
            <Settings className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Configurações</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem 
          onClick={() => signOut()}
          className="focus:bg-rose-500/10 text-rose-500 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair da conta</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}