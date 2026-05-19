import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OnboardingWizard from "@/components/OnboardingWizard";
import Logo from "@/components/Logo";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <Logo className="text-4xl" />
          <h1 className="text-3xl font-black tracking-tight text-white">
            Vamos configurar seu <span className="text-primary">BROC.</span>
          </h1>
          <p className="text-zinc-500 font-medium">
            Personalize sua experiência em menos de 1 minuto.
          </p>
        </div>

        <OnboardingWizard userId={session.user.id} />
      </div>
    </div>
  );
}