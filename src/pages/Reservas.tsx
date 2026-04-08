import { useState, useMemo } from "react";
import AiAnalysisModal from "@/components/AiAnalysisModal";
import Layout from "@/components/layout/Layout";
import { Briefcase, Filter, Calendar, Hotel, Plane, RefreshCw, Bell, Clock, X, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Car, Bus, ExternalLink, CheckCircle2, XCircle, Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const tabs = ["Próximas viagens", "Minhas viagens", "Histórico"];

type Reservation = {
  id: string;
  numericId: number;
  type: string;
  icon: typeof Plane;
  origin: string;
  destination: string;
  date: string;
  tripDate: string;
  status: string;
  traveler: string;
  costCenter: string;
  approvalDeadline: string | null;
  hoursLeft: number;
  myTrip: boolean;
  aiDecision?: "approved" | "reproved" | null;
};

const typeSlugMap: Record<string, string> = {
  "Aéreo": "fly",
  "Hotel": "hotel",
  "Carro": "car",
  "Ônibus": "bus",
};

const getDetailUrl = (type: string, numericId: number) =>
  `https://app.onfly.com/travel/#/travel/reserve-details/${typeSlugMap[type] || "fly"}/${numericId}`;

const reservations: Reservation[] = [
  {
    id: "#03Z925",
    numericId: 6690003,
    type: "Aéreo",
    icon: Plane,
    origin: "São Paulo (CGH)",
    destination: "Rio de Janeiro (SDU)",
    date: "17/04/2026",
    tripDate: "2026-04-17",
    status: "Aprovada",
    traveler: "Ivan Silva",
    costCenter: "CC-001 Marketing",
    approvalDeadline: "2026-04-10T14:00:00",
    hoursLeft: 48,
    myTrip: true,
    aiDecision: "approved",
  },
  {
    id: "#07K412",
    numericId: 6690079,
    type: "Hotel",
    icon: Hotel,
    origin: "Rio de Janeiro",
    destination: "Hotel Copacabana Palace",
    date: "17/04/2026 – 20/04/2026",
    tripDate: "2026-04-17",
    status: "Pendente",
    traveler: "Ivan Silva",
    costCenter: "CC-001 Marketing",
    approvalDeadline: "2026-04-09T08:00:00",
    hoursLeft: 10,
    myTrip: true,
    aiDecision: "reproved",
  },
  {
    id: "#12B738",
    numericId: 6690149,
    type: "Aéreo",
    icon: Plane,
    origin: "São Paulo (GRU)",
    destination: "Brasília (BSB)",
    date: "20/04/2026",
    tripDate: "2026-04-20",
    status: "Pendente",
    traveler: "Maria Santos",
    costCenter: "CC-003 Vendas",
    approvalDeadline: "2026-04-08T18:00:00",
    hoursLeft: 4,
    myTrip: false,
    aiDecision: "approved",
  },
  {
    id: "#18F291",
    numericId: 6691062,
    type: "Hotel",
    icon: Hotel,
    origin: "Brasília",
    destination: "Hotel Nacional",
    date: "15/04/2026 – 17/04/2026",
    tripDate: "2026-04-15",
    status: "Expirada",
    traveler: "João Pereira",
    costCenter: "CC-002 TI",
    approvalDeadline: null,
    hoursLeft: 0,
    myTrip: false,
  },
  {
    id: "#21A100",
    numericId: 6688501,
    type: "Aéreo",
    icon: Plane,
    origin: "Recife (REC)",
    destination: "São Paulo (GRU)",
    date: "05/03/2026",
    tripDate: "2026-03-05",
    status: "Aprovada",
    traveler: "Ivan Silva",
    costCenter: "CC-001 Marketing",
    approvalDeadline: null,
    hoursLeft: 0,
    myTrip: true,
    aiDecision: "approved",
  },
  {
    id: "#22C301",
    numericId: 6688710,
    type: "Carro",
    icon: Car,
    origin: "São Paulo",
    destination: "Campinas",
    date: "05/03/2026 – 07/03/2026",
    tripDate: "2026-03-05",
    status: "Aprovada",
    traveler: "Maria Santos",
    costCenter: "CC-003 Vendas",
    approvalDeadline: null,
    hoursLeft: 0,
    myTrip: false,
  },
  {
    id: "#23D502",
    numericId: 6688811,
    type: "Aéreo",
    icon: Plane,
    origin: "Curitiba (CWB)",
    destination: "Porto Alegre (POA)",
    date: "10/02/2026",
    tripDate: "2026-02-10",
    status: "Aprovada",
    traveler: "João Pereira",
    costCenter: "CC-002 TI",
    approvalDeadline: null,
    hoursLeft: 0,
    myTrip: false,
  },
  {
    id: "#25G890",
    numericId: 6689100,
    type: "Ônibus",
    icon: Bus,
    origin: "Salvador",
    destination: "Recife",
    date: "01/03/2026",
    tripDate: "2026-03-01",
    status: "Expirada",
    traveler: "Ana Costa",
    costCenter: "CC-001 Marketing",
    approvalDeadline: null,
    hoursLeft: 0,
    myTrip: false,
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

const statusColor = (status: string) => {
  switch (status) {
    case "Aprovada": return "bg-green-100 text-green-700";
    case "Aprovada": return "bg-green-100 text-green-700";
    case "Expirada": return "bg-red-100 text-red-700";
    case "Pendente": return "bg-yellow-100 text-yellow-700";
    default: return "bg-muted text-muted-foreground";
  }
};

const Reservas = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notified, setNotified] = useState<Record<string, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filterId, setFilterId] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTraveler, setFilterTraveler] = useState("");
  const [filterCostCenter, setFilterCostCenter] = useState("all");
  const [filterOrigin, setFilterOrigin] = useState("");
  const [filterDestination, setFilterDestination] = useState("");

  const handleNotify = (id: string) => {
    setNotified((prev) => ({ ...prev, [id]: true }));
  };

  const clearFilters = () => {
    setFilterId("");
    setFilterType("all");
    setFilterStatus("all");
    setFilterTraveler("");
    setFilterCostCenter("all");
    setFilterOrigin("");
    setFilterDestination("");
  };

  const hasActiveFilters = filterId || filterType !== "all" || filterStatus !== "all" || filterTraveler || filterCostCenter !== "all" || filterOrigin || filterDestination;

  const uniqueTypes = [...new Set(reservations.map((r) => r.type))];
  const uniqueStatuses = [...new Set(reservations.map((r) => r.status))];
  const uniqueCostCenters = [...new Set(reservations.map((r) => r.costCenter))];

  const filteredReservations = useMemo(() => {
    let data = reservations;

    const today = new Date(new Date().toISOString().split("T")[0]);

    // Tab filtering
    if (activeTab === 0) {
      // Próximas viagens: data futura (Confirmada, Pendente ou Expirada com data futura)
      data = data.filter((r) => new Date(r.tripDate) >= today && (r.status === "Aprovada" || r.status === "Pendente" || r.status === "Expirada"));
    } else if (activeTab === 1) {
      // Minhas viagens
      data = data.filter((r) => r.myTrip);
    } else if (activeTab === 2) {
      // Histórico: somente reservas com data anterior a hoje
      data = data.filter((r) => new Date(r.tripDate) < today);
    }

    // Additional filters
    if (filterId) data = data.filter((r) => r.id.toLowerCase().includes(filterId.toLowerCase()));
    if (filterType !== "all") data = data.filter((r) => r.type === filterType);
    if (filterStatus !== "all") data = data.filter((r) => r.status === filterStatus);
    if (filterTraveler) data = data.filter((r) => r.traveler.toLowerCase().includes(filterTraveler.toLowerCase()));
    if (filterCostCenter !== "all") data = data.filter((r) => r.costCenter === filterCostCenter);
    if (filterOrigin) data = data.filter((r) => r.origin.toLowerCase().includes(filterOrigin.toLowerCase()));
    if (filterDestination) data = data.filter((r) => r.destination.toLowerCase().includes(filterDestination.toLowerCase()));

    return data;
  }, [activeTab, filterId, filterType, filterStatus, filterTraveler, filterCostCenter, filterOrigin, filterDestination]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const totalPages = Math.max(1, Math.ceil(filteredReservations.length / perPage));
  const paginatedReservations = filteredReservations.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Reset page when filters/tab change
  useMemo(() => { setCurrentPage(1); }, [activeTab, filterId, filterType, filterStatus, filterTraveler, filterCostCenter, filterOrigin, filterDestination]);

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
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="default" size="sm" className="rounded-xl gap-2 relative">
                  <Filter className="w-4 h-4" />
                  Filtros
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[420px] p-4" align="end">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Filtros</h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" onClick={clearFilters}>
                      <X className="w-3 h-3" /> Limpar
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Reserva (ID)</label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        placeholder="#03Z..."
                        value={filterId}
                        onChange={(e) => setFilterId(e.target.value)}
                        className="pl-8 h-9 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {uniqueTypes.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {uniqueStatuses.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Viajante</label>
                    <Input
                      placeholder="Nome..."
                      value={filterTraveler}
                      onChange={(e) => setFilterTraveler(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Centro de Custos</label>
                    <Select value={filterCostCenter} onValueChange={setFilterCostCenter}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {uniqueCostCenters.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Origem</label>
                    <Input
                      placeholder="Cidade..."
                      value={filterOrigin}
                      onChange={(e) => setFilterOrigin(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Destino</label>
                    <Input
                      placeholder="Cidade ou hotel..."
                      value={filterDestination}
                      onChange={(e) => setFilterDestination(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
                <Button className="w-full mt-4 rounded-lg" size="sm" onClick={() => setShowFilters(false)}>
                  Aplicar filtros
                </Button>
              </PopoverContent>
            </Popover>
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
                   <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">IA</th>
                   <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReservations.map((r) => {
                  const isUrgent = r.status === "Pendente" && r.hoursLeft <= 12;
                  const Icon = r.icon;
                  const detailHref = getDetailUrl(r.type, r.numericId);

                  return (
                    <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="px-5 py-4">
                        <a href={detailHref} target="_blank" rel="noopener noreferrer" className="text-sm font-mono font-semibold text-primary hover:underline">
                          {r.id}
                        </a>
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
                        {r.status === "Expirada" || r.status === "Aprovada" ? (
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
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {r.aiDecision === "approved" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                            <Bot className="w-3.5 h-3.5" />
                            Aprovado pela IA
                          </span>
                        ) : r.aiDecision === "reproved" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                            <Bot className="w-3.5 h-3.5" />
                            Reprovado pela IA
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {r.status === "Pendente" && (
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-lg text-green-700 border-green-300 hover:bg-green-50">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Aprovar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredReservations.length > 0 && (
            <div className="flex items-center justify-end mt-4 px-2 gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Conteúdos por página:</span>
                <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setCurrentPage(1); }}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-sm text-muted-foreground">
                {((currentPage - 1) * perPage) + 1}–{Math.min(currentPage * perPage, filteredReservations.length)} de {filteredReservations.length}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {filteredReservations.length === 0 && (
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
