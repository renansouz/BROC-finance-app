import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserButton from "./UserButton";

export default async function Header() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  
  return (
    <header className="flex items-center justify-between pb-6 border-b border-white/10">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">
          FINANCE.<span className="text-primary">RDEV</span>
        </h1>
        <p className="hidden md:block text-zinc-500 text-xs font-medium">Sua inteligência financeira pessoal.</p>
      </div>
      <UserButton user={session!.user} />
    </header>
  )
}