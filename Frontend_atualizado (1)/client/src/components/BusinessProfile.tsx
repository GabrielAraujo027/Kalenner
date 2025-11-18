import { MapPin, Phone, Navigation, Heart, Share2, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

const BusinessProfile = () => {
  const services = [
    { name: "Corte Masculino", price: "R$ 25,00" },
    { name: "Barba", price: "R$ 15,00" },
    { name: "Corte + Barba", price: "R$ 35,00", note: "*** 5 dias grátis com ***" },
    { name: "Corte Masculino", price: "R$ 25,00" },
    { name: "Barba", price: "R$ 15,00" },
    { name: "Corte + Barba", price: "R$ 35,00" },
  ];

  const hours = [
    { day: "Segunda-feira", time: "9:00 - 18:00" },
    { day: "Terça-feira", time: "9:00 - 18:00" },
    { day: "Quarta-feira", time: "9:00 - 18:00" },
    { day: "Quinta-feira", time: "9:00 - 18:00" },
    { day: "Sexta-feira", time: "9:00 - 18:00" },
    { day: "Sábado", time: "8:00 - 16:00" },
    { day: "Domingo", time: "Fechado", closed: true },
  ];

  const team = [
    { name: "Alexandre P." },
    { name: "Rafael Fogo" },
    { name: "Lucas Silva" },
    { name: "Ryan" },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card className="overflow-hidden">
        {/* Image Gallery */}
        <div className="relative h-64 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
          <Badge className="absolute top-4 left-4 bg-success text-success-foreground gap-1">
            <span className="text-xs">★</span> RECOMENDADO PELO FREEMIUM
          </Badge>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="icon" variant="secondary" className="rounded-full w-9 h-9">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full w-9 h-9">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Business Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Barbearia JJ</h1>
            <div className="flex items-start gap-2 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
              <span className="text-sm">Rua das Palmeiras, 123 - Vila Aeroporto, Guarulhos - SP, 07034-000</span>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Navigation className="w-4 h-4" />
                Direções
              </Button>
              <Button variant="outline" className="gap-2">
                <Phone className="w-4 h-4" />
                Ligações
              </Button>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Serviços</h2>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground mb-3">Serviços populares</p>
              {services.map((service, index) => (
                <div key={index} className="border-b border-border pb-3 mb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      {service.note && (
                        <p className="text-xs text-muted-foreground mt-1">{service.note}</p>
                      )}
                    </div>
                    <span className="font-semibold">{service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-muted rounded-lg h-48 flex items-center justify-center mb-6">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Mapa do local</p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Horário de funcionamento</h2>
            </div>
            <div className="space-y-2">
              {hours.map((schedule, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className={schedule.closed ? "text-muted-foreground" : ""}>
                    {schedule.day}
                  </span>
                  <span className={schedule.closed ? "text-destructive" : ""}>
                    {schedule.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Equipe</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-2 bg-muted" />
                  <p className="text-xs font-medium">{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BusinessProfile;
