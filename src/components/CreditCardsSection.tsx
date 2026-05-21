import { CreditCard } from "lucide-react";
import CreditCardSummary from "./CreditCardSummary";

interface CreditCardData {
  id: string;
  name: string;
  invoiceAmount: number;
  limit: number | null;
  dueDay: number | null;
}

interface Props {
  data: CreditCardData[];
}

export default function CreditCardsSection({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-zinc-300 tracking-tight">
          Meus Cartões
        </h2>
      </div>
      
      <div className="grid gap-6">
        {data.map((card) => (
          <CreditCardSummary
            key={card.id}
            name={card.name}
            invoiceAmount={card.invoiceAmount}
            limit={card.limit || 0}
            dueDay={card.dueDay || 0}
          />
        ))}
      </div>
    </section>
  );
}