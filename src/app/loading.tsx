import Logo from "@/components/Logo";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <Logo className="text-4xl animate-pulse" />
        
        <div className="absolute inset-3.75 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
      
      <div className="flex flex-col items-center space-y-2">
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
          BROC. Intelligence
        </p>
        <p className="text-zinc-600 text-xs italic animate-bounce">
          Consolidando seu patrimônio...
        </p>
      </div>
    </div>
  );
}