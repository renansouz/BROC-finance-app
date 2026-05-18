import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserButton from "./UserButton";

export default async function Header() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  
  return (
    <header className="flex items-center justify-between pb-6 border-b border-white/5">
      <div>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Dashboard</h2>
        <p className="hidden md:block text-zinc-500 text-xs font-medium uppercase tracking-widest">Visão Geral do Patrimônio</p>
      </div>

      <UserButton user={session.user} />
    </header>
  )
}