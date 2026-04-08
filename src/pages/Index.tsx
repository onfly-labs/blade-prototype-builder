import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Plane, Hotel, Car, Concierge } from "lucide-react";
import { Button } from "@/components/ui/button";

const searchTabs = [
  { id: "aereo", label: "Aéreo", icon: Plane },
  { id: "hotel", label: "Hotel", icon: Hotel },
  { id: "carro", label: "Carro", icon: Car },
  { id: "concierge", label: "Concierge", icon: Concierge },
];

const flightResults = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=200&fit=crop",
    origin: "São Paulo",
    originCode: "CGH",
    originAirport: "Aeroporto de Congonhas",
    destination: "Rio de Janeiro",
    destinationCode: "SDU",
    destinationAirport: "Aeroporto Santos Dumont",
    dateGo: "17/04/2026",
    dateReturn: "23/04/2026",
    type: "Ida e volta",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=400&h=200&fit=crop",
    origin: "São Paulo",
    originCode: "GRU",
    originAirport: "Aeroporto de Guarulhos",
    destination: "Brasília",
    destinationCode: "BSB",
    destinationAirport: "Aeroporto de Brasília",
    dateGo: "20/04/2026",
    dateReturn: "22/04/2026",
    type: "Ida e volta",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1534854638093-bada1813ca19?w=400&h=200&fit=crop",
    origin: "Rio de Janeiro",
    originCode: "GIG",
    originAirport: "Aeroporto do Galeão",
    destination: "Salvador",
    destinationCode: "SSA",
    destinationAirport: "Aeroporto de Salvador",
    dateGo: "25/04/2026",
    dateReturn: "",
    type: "Somente ida",
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("aereo");
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-8">
            Ivan, vamos viajar?
          </h1>
        </div>
      </section>

      {/* Search Card */}
      <div className="max-w-4xl mx-auto -mt-6 px-4">
        <div className="bg-card rounded-2xl shadow-lg p-6">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-border mb-5">
            {searchTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Trip type toggle */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setTripType("roundtrip")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tripType === "roundtrip"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Ida e volta
            </button>
            <button
              onClick={() => setTripType("oneway")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tripType === "oneway"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Somente ida
            </button>
          </div>

          {/* Search fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-secondary rounded-xl p-3">
              <label className="text-xs text-muted-foreground">Origem</label>
              <p className="text-sm font-medium text-foreground mt-0.5">São Paulo (CGH)</p>
            </div>
            <div className="bg-secondary rounded-xl p-3">
              <label className="text-xs text-muted-foreground">Destino</label>
              <p className="text-sm font-medium text-foreground mt-0.5">Para onde?</p>
            </div>
            <div className="bg-secondary rounded-xl p-3">
              <label className="text-xs text-muted-foreground">Data ida</label>
              <p className="text-sm font-medium text-foreground mt-0.5">Selecionar</p>
            </div>
            {tripType === "roundtrip" && (
              <div className="bg-secondary rounded-xl p-3">
                <label className="text-xs text-muted-foreground">Data volta</label>
                <p className="text-sm font-medium text-foreground mt-0.5">Selecionar</p>
              </div>
            )}
          </div>

          <Button className="mt-5 w-full md:w-auto rounded-xl" size="lg">
            Buscar voos
          </Button>
        </div>
      </div>

      {/* Results */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-lg font-semibold text-foreground mb-4">Últimas buscas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {flightResults.map((flight) => (
            <div key={flight.id} className="bg-card rounded-2xl shadow-sm overflow-hidden border border-border">
              <img src={flight.image} alt={flight.destination} className="w-full h-32 object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Plane className="w-3.5 h-3.5" />
                  <span>{flight.type}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{flight.origin}</p>
                    <p className="text-xs text-muted-foreground">{flight.dateGo}</p>
                    <p className="text-xs text-muted-foreground">{flight.originCode} – {flight.originAirport}</p>
                  </div>
                  <div className="flex-1 mx-3 border-t border-dashed border-border relative">
                    <Plane className="w-3.5 h-3.5 text-muted-foreground absolute -top-2 left-1/2 -translate-x-1/2 rotate-90" />
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-foreground">{flight.destination}</p>
                    <p className="text-xs text-muted-foreground">{flight.dateReturn || "–"}</p>
                    <p className="text-xs text-muted-foreground">{flight.destinationCode} – {flight.destinationAirport}</p>
                  </div>
                </div>
                <button className="text-xs text-primary font-medium mt-3 hover:underline">
                  Continuar busca →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
