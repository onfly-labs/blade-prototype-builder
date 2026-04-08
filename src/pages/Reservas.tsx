import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Briefcase, Filter, Calendar, MapPin, Plane, RefreshCw, Bell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const tabs = ["Próximas viagens", "Minhas viagens", "Histórico"];

const reservations = [
  {
    id: "#03Z925",
    type: "Aéreo",
    icon: Plane,
    origin: "São Paulo (CGH)",
    destination: "Rio de Janeiro (SDU)",
    date: "17/04/2026",
    status: "Confirmada",
    traveler: "Ivan Silva",
    costCenter: "CC-001 Marketing",
    approvalDeadline: "2026-04-10T14:00:00",
    hoursLeft: 48,
  },
  {
    id: "#07K412",
    type: "Hotel",
    icon: MapPin,
    origin: "Rio de Janeiro",
    destination: "Hotel Copacabana Palace",
    date: "17/04/2026 – 20/04/2026",
    status: "Pendente",
    traveler: "Ivan Silva",
    costCenter: "CC-001 Marketing",
    approvalDeadline: "2026-04-09T08:00:00",
    hoursLeft: 10,
  },
  {
    id: "#12B738",
    type: "Aéreo",
    icon: Plane,
    origin: "São Paulo (GRU)",
    destination: "Brasília (BSB)",
    date: "20/04/2026",
    status: "Pendente",
    traveler: "Maria Santos",
    costCenter: "CC-003 Vendas",
    approvalDeadline: "2026-04-08T18:00:00",
    hoursLeft: 4,
  },
  {
    id: "#18F291",
    type: "Hotel",
    icon: MapPin,
    origin: "Brasília",
    destination: "Hotel Nacional",
    date: "01/04/2026 – 03/04/2026",
    status: "Expirada",
    traveler: "João Pereira",
    costCenter: "CC-002 TI",
    approvalDeadline: null,
    hoursLeft: 0,
  },
];

const formatTimeLeft = (hours: number) => {
  if (hours <= 0) return "Expirado";
  if (hours < 1) return "< 1h restante";
  if (hours < 24) return `${hours}h restantes`;
  const days = Math.floor(hours / 24);
  const h = hours % 24;
  return `${days}d ${h}h restantes`;
};

const Reservas = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notified, setNotified] = useState<Record<string, boolean>>({});

  const handleNotify = (id: string) => {
    setNotified((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <Layout>
      <TooltipProvider>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Reservas</h1>
              <p className="text-sm text-muted-foreground">Acompanhe e controle seus próximos compromissos</p>
            </div>
          </div>

          {/* Tabs + Filter */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    activeTab === i
                      ? "border-primary text-primary bg-accent"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Button variant="default" size="sm" className="rounded-xl gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Reserva</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Tipo</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Origem / Destino</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Data</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Viajante</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Centro de Custos</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Aprovação</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => {
                  const isUrgent = r.status === "Pendente" && r.hoursLeft <= 12;
                  const Icon = r.icon;

                  return (
                    <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono font-semibold text-foreground">{r.id}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center cursor-default">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{r.type}</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-foreground">{r.origin}</p>
                        <p className="text-xs text-muted-foreground">{r.destination}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-foreground">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          {r.date}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">{r.traveler}</td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-foreground">{r.costCenter}</span>
                      </td>
                      <td className="px-5 py-4">
                        {r.status === "Expirada" ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Clock className={`w-3.5 h-3.5 ${isUrgent ? "text-destructive" : "text-muted-foreground"}`} />
                            <span className={`text-xs font-medium ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
                              {formatTimeLeft(r.hoursLeft)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            r.status === "Confirmada"
                              ? "bg-green-100 text-green-700"
                              : r.status === "Expirada"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {r.status === "Expirada" && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-lg">
                              <RefreshCw className="w-3.5 h-3.5" />
                              Recotar
                            </Button>
                          )}
                          {isUrgent && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={notified[r.id] ? "secondary" : "destructive"}
                                  size="sm"
                                  className="gap-1.5 text-xs rounded-lg"
                                  onClick={() => handleNotify(r.id)}
                                  disabled={notified[r.id]}
                                >
                                  <Bell className="w-3.5 h-3.5" />
                                  {notified[r.id] ? "Notificado" : "Lembrar"}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{notified[r.id] ? "Aprovador já foi notificado" : "Enviar lembrete ao aprovador"}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {reservations.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhuma reserva encontrada</p>
            </div>
          )}
        </div>
      </TooltipProvider>
    </Layout>
  );
};

export default Reservas;
