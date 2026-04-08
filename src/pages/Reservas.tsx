import { useState, useMemo, useEffect } from "react";
import AiAnalysisModal from "@/components/AiAnalysisModal";
import Layout from "@/components/layout/Layout";
import { Briefcase, Filter, Calendar, Hotel, Plane, RefreshCw, Bell, Clock, X, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Car, Bus, ExternalLink, CheckCircle2, XCircle, Bot, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

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

const typeMap: Record<string, { label: string; icon: typeof Plane; slug: string }> = {
  FlightOrder: { label: "Aéreo", icon: Plane, slug: "fly" },
  HotelOrder: { label: "Hotel", icon: Hotel, slug: "hotel" },
  CarRentalOrder: { label: "Carro", icon: Car, slug: "car" },
  BusOrder: { label: "Ônibus", icon: Bus, slug: "bus" },
};

const typeSlugMap: Record<string, string> = {
  "Aéreo": "fly",
  "Hotel": "hotel",
  "Carro": "car",
  "Ônibus": "bus",
};

const getDetailUrl = (type: string, numericId: number) =>
  `https://app.onfly.com/travel/#/travel/reserve-details/${typeSlugMap[type] || "fly"}/${numericId}`;

const mapStatus = (statusId: number): string => {
  switch (statusId) {
    case 1: return "Pendente";
    case 2: return "Reprovada";
    case 3: return "Aprovada";
    case 4: return "Expirada";
    default: return "Pendente";
  }
};

const mapAiDecision = (item: any): "approved" | "reproved" | null => {
  // Check history for AI-based decisions
  if (item.history?.data) {
    for (const h of item.history.data) {
      if (h.changedBy?.data?.name?.toLowerCase().includes("ia") || h.changedBy?.data?.name?.toLowerCase().includes("automático")) {
        if (h.action === "approved") return "approved";
        if (h.action === "reproved") return "reproved";
      }
    }
  }
  // If status is 3 (approved) and decidedDate is close to createdDate, consider it AI
  if (item.status === 3 && item.decidedDate) {
    const created = new Date(item.createdDate).getTime();
    const decided = new Date(item.decidedDate).getTime();
    if (decided - created < 60000) return "approved"; // < 1 min = AI
  }
  return null;
};

const parseApiResponse = (data: any[]): Reservation[] => {
  return data.map((item) => {
    const typeInfo = typeMap[item.type] || { label: item.type, icon: Plane, slug: "fly" };
    const solicitor = item.solicitor?.data;
    const costCenter = item.costCenter?.data;

    const hoursLeft = item.expiresAt
      ? Math.max(0, Math.round((new Date(item.expiresAt).getTime() - Date.now()) / 3600000))
      : 0;

    return {
      id: `#${item.id}`,
      numericId: item.id,
      type: typeInfo.label,
      icon: typeInfo.icon,
      origin: item.description || "—",
      destination: solicitor ? solicitor.name : "—",
      date: new Date(item.createdDate).toLocaleDateString("pt-BR"),
      tripDate: item.createdDate.split(" ")[0],
      status: mapStatus(item.status),
      traveler: solicitor ? solicitor.name : "—",
      costCenter: costCenter ? `${costCenter.code} - ${costCenter.name}` : "—",
      approvalDeadline: item.expiresAt,
      hoursLeft,
      myTrip: true,
      aiDecision: mapAiDecision(item),
    };
  });
};

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
    case "Reprovada": return "bg-red-100 text-red-700";
    case "Expirada": return "bg-red-100 text-red-700";
    case "Pendente": return "bg-yellow-100 text-yellow-700";
    default: return "bg-muted text-muted-foreground";
  }
};

const Reservas = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notified, setNotified] = useState<Record<string, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Filter states
  const [filterId, setFilterId] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTraveler, setFilterTraveler] = useState("");
  const [filterCostCenter, setFilterCostCenter] = useState("all");
  const [filterOrigin, setFilterOrigin] = useState("");
  const [filterDestination, setFilterDestination] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [aiModal, setAiModal] = useState<{ open: boolean; decision: "approved" | "reproved"; id: string } | null>(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/onfly-reservations?page=${currentPage}&perPage=${perPage}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      if (result.data) {
        setReservations(parseApiResponse(result.data));
        setTotalItems(result.meta?.pagination?.total || result.data.length);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast({
        title: "Erro ao carregar reservas",
        description: "Não foi possível carregar as reservas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [currentPage, perPage]);

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

    if (activeTab === 0) {
      data = data.filter((r) => new Date(r.tripDate) >= today && (r.status === "Aprovada" || r.status === "Pendente" || r.status === "Expirada"));
    } else if (activeTab === 1) {
      data = data.filter((r) => r.myTrip);
    } else if (activeTab === 2) {
      data = data.filter((r) => new Date(r.tripDate) < today);
    }

    if (filterId) data = data.filter((r) => r.id.toLowerCase().includes(filterId.toLowerCase()));
    if (filterType !== "all") data = data.filter((r) => r.type === filterType);
    if (filterStatus !== "all") data = data.filter((r) => r.status === filterStatus);
    if (filterTraveler) data = data.filter((r) => r.traveler.toLowerCase().includes(filterTraveler.toLowerCase()));
    if (filterCostCenter !== "all") data = data.filter((r) => r.costCenter === filterCostCenter);
    if (filterOrigin) data = data.filter((r) => r.origin.toLowerCase().includes(filterOrigin.toLowerCase()));
    if (filterDestination) data = data.filter((r) => r.destination.toLowerCase().includes(filterDestination.toLowerCase()));

    return data;
  }, [activeTab, filterId, filterType, filterStatus, filterTraveler, filterCostCenter, filterOrigin, filterDestination, reservations]);

  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const paginatedReservations = filteredReservations;

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
            <Button variant="outline" size="sm" className="ml-auto gap-2" onClick={fetchReservations} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
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
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Carregando reservas...</span>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Reserva</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Tipo</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Descrição</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Data</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Solicitante</th>
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
                            <button onClick={() => setAiModal({ open: true, decision: "approved", id: r.id })} className="inline-flex items-center gap-1 text-xs font-medium text-green-700 hover:underline cursor-pointer">
                              <Bot className="w-3.5 h-3.5" />
                              Aprovado pela IA
                            </button>
                          ) : r.aiDecision === "reproved" ? (
                            <button onClick={() => setAiModal({ open: true, decision: "reproved", id: r.id })} className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline cursor-pointer">
                              <Bot className="w-3.5 h-3.5" />
                              Reprovado pela IA
                            </button>
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
            )}
          </div>

          {!loading && filteredReservations.length > 0 && (
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
                {((currentPage - 1) * perPage) + 1}–{Math.min(currentPage * perPage, totalItems)} de {totalItems}
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

          {!loading && filteredReservations.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhuma reserva encontrada</p>
            </div>
          )}
        </div>
      </TooltipProvider>
      {aiModal && (
        <AiAnalysisModal
          open={aiModal.open}
          onOpenChange={(open) => !open && setAiModal(null)}
          decision={aiModal.decision}
          reservationId={aiModal.id}
        />
      )}
    </Layout>
  );
};

export default Reservas;
