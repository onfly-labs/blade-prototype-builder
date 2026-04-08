import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Briefcase, Filter, Calendar, MapPin, Plane, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = ["Próximas viagens", "Minhas viagens", "Histórico"];

const reservations = [
  {
    id: 1,
    type: "Aéreo",
    origin: "São Paulo (CGH)",
    destination: "Rio de Janeiro (SDU)",
    date: "17/04/2026",
    status: "Confirmada",
    traveler: "Ivan Silva",
  },
  {
    id: 2,
    type: "Hotel",
    origin: "Rio de Janeiro",
    destination: "Hotel Copacabana Palace",
    date: "17/04/2026 – 20/04/2026",
    status: "Pendente",
    traveler: "Ivan Silva",
  },
  {
    id: 3,
    type: "Aéreo",
    origin: "São Paulo (GRU)",
    destination: "Brasília (BSB)",
    date: "20/04/2026",
    status: "Expirada",
    traveler: "Maria Santos",
  },
  {
    id: 4,
    type: "Hotel",
    origin: "Brasília",
    destination: "Hotel Nacional",
    date: "01/04/2026 – 03/04/2026",
    status: "Expirada",
    traveler: "João Pereira",
  },
];

const Reservas = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
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
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Tipo</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Origem / Destino</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Data</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Viajante</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {r.type === "Aéreo" ? <Plane className="w-4 h-4 text-primary" /> : <MapPin className="w-4 h-4 text-primary" />}
                      <span className="text-sm font-medium text-foreground">{r.type}</span>
                    </div>
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
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        r.status === "Confirmada"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state placeholder */}
        {reservations.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma reserva encontrada</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reservas;
