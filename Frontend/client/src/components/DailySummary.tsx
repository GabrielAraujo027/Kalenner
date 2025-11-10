import { Card } from "@/components/ui/card";

interface DailySummaryProps {
  count: number;
  nextAppointment?: {
    service: string;
    clientName: string;
  };
}

const DailySummary = ({ count, nextAppointment }: DailySummaryProps) => {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted border-2">
      <p className="text-sm text-muted-foreground mb-2 capitalize">{today}</p>
      <h2 className="text-4xl font-bold text-highlight mb-2">
        {count} {count === 1 ? "Compromisso" : "Compromissos"}
      </h2>
      {nextAppointment && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-1">Próximo compromisso:</p>
          <p className="font-semibold">{nextAppointment.service}</p>
          <p className="text-sm text-muted-foreground">{nextAppointment.clientName}</p>
        </div>
      )}
    </Card>
  );
};

export default DailySummary;
