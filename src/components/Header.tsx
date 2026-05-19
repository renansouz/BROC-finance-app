import UserButton from "./UserButton";

interface HeaderProps {
  user: any; 
}

export default function Header({ user }: HeaderProps) {
  return (
     <header className="flex items-center justify-between pb-6 border-b border-border">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Dashboard</h2>
        <p className="hidden sm:block text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">
          Visão Geral do seu Patrimônio
        </p>
      </div>
      <UserButton user={user} />
    </header>
  )
}