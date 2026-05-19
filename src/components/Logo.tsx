import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("text-2xl font-black tracking-tighter text-white", className)}>
      BROC<span className="text-primary">.</span>
    </div>
  );
}