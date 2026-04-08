import Layout from "@/components/layout/Layout";
import { FileText, CheckCircle, Zap, XCircle, AlertTriangle, Clock, Plane, Hotel, Car, Bus, ExternalLink, Bot } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Status: 1=Aprovada, 2=Reprovada, 3=Aprovada (automática), 4=Pendente, 5=Expirada
const statusMap: Record<number, { label: string; color: string }> = {
  1: { label: "Aprovada", color: "bg-green-100 text-green-700 border-green-200" },
  2: { label: "Reprovada", color: "bg-red-100 text-red-700 border-red-200" },
  3: { label: "Aprovada", color: "bg-green-100 text-green-700 border-green-200" },
  4: { label: "Pendente", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  5: { label: "Expirada", color: "bg-gray-100 text-gray-600 border-gray-200" },
};

const typeMap: Record<string, { label: string; icon: typeof Plane }> = {
  FlyOrder: { label: "Aéreo", icon: Plane },
  HotelOrder: { label: "Hotel", icon: Hotel },
  CarOrder: { label: "Carro", icon: Car },
  BusOrder: { label: "Ônibus", icon: Bus },
};

const flowMap: Record<number, string> = {
  1: "Aprovação Gerencial",
  2: "Aprovação Gerencial",
  3: "Aprovação Automática",
  4: "Aprovação Gerencial",
  5: "Aprovação Gerencial",
};

const mockApprovals = [
  {
    id: 6690003,
    approvalSlug: "eyJ0eXBlIjoiSG90ZWxPcmRlciIsImlkIjoyNDIwMjk5N30",
    type: "HotelOrder",
    decidedDate: null,
    createdDate: "2026-04-08 11:38:04",
    expiresAt: "2026-04-09 11:38:04",
    protocol: "#03ZE1F",
    status: 4,
    solicitor: { data: { name: "Regis Bruno Barbosa de Melo" } },
    totalAmount: 64710,
    costCenter: { data: { id: "1", name: "01AD300101 - B4B-ADM - COMERCIAL" } },
    description: "Visitas com o Chiabai",
    permissions: { data: { pay: false, approve: true, reprove: true } },
  },
  {
    id: 6690079,
    approvalSlug: "eyJ0eXBlIjoiSG90ZWxPcmRlciIsImlkIjoyNDIwMzAzNX0",
    type: "HotelOrder",
    decidedDate: null,
    createdDate: "2026-04-08 11:44:06",
    expiresAt: "2026-04-09 11:44:06",
    protocol: "#03ZE3J",
    status: 4,
    solicitor: { data: { name: "Regis Bruno Barbosa de Melo" } },
    totalAmount: 17174,
    costCenter: { data: { id: "1", name: "01AD300101 - B4B-ADM - COMERCIAL" } },
    description: "Acompanhar Filipe Chiabai",
    permissions: { data: { pay: false, approve: true, reprove: true } },
  },
  {
    id: 6690149,
    approvalSlug: "eyJ0eXBlIjoiRmx5T3JkZXIiLCJpZCI6MTM3MTgwMzJ9",
    type: "FlyOrder",
    decidedDate: null,
    createdDate: "2026-04-08 11:48:51",
    expiresAt: "2026-04-09 11:48:51",
    protocol: "#03ZE5H",
    status: 4,
    solicitor: { data: { name: "Regis Bruno Barbosa de Melo" } },
    totalAmount: 97345,
    costCenter: { data: { id: "1", name: "01AD300101 - B4B-ADM - COMERCIAL" } },
    description: "Visita na Zurich com o Lucas Pirchiner",
    permissions: { data: { pay: false, approve: true, reprove: true } },
  },
  {
    id: 6691062,
    approvalSlug: "eyJ0eXBlIjoiSG90ZWxPcmRlciIsImlkIjoyNDIwMzQ4Nn0",
    type: "HotelOrder",
    decidedDate: null,
    createdDate: "2026-04-08 13:34:18",
    expiresAt: "2026-04-09 13:34:17",
    protocol: "#03ZEUU",
    status: 4,
    solicitor: { data: { name: "Jhonny Ribeiro" } },
    totalAmount: 17800,
    costCenter: { data: { id: "2", name: "01AD120202 - ATG-OPERACOES - SUPERVISAO DE REDE" } },
    description: "Visita a MG53",
    permissions: { data: { pay: false, approve: true, reprove: true } },
  },
  {
    id: 6688501,
    approvalSlug: "eyJ0eXBlIjoiRmx5T3JkZXIiLCJpZCI6MTM3MTc1MDB9",
    type: "FlyOrder",
    decidedDate: "2026-04-07 09:15:00",
    createdDate: "2026-04-06 14:20:00",
    expiresAt: "2026-04-07 14:20:00",
    protocol: "#03ZD2A",
    status: 1,
    solicitor: { data: { name: "Carlos Oliveira" } },
    totalAmount: 125000,
    costCenter: { data: { id: "3", name: "01AD300102 - B4B-ADM - FINANCEIRO" } },
    description: "Reunião com cliente em SP",
    permissions: { data: { pay: false, approve: false, reprove: false } },
  },
  {
    id: 6688602,
    approvalSlug: "eyJ0eXBlIjoiSG90ZWxPcmRlciIsImlkIjoyNDIwMjUwMH0",
    type: "HotelOrder",
    decidedDate: "2026-04-07 10:30:00",
    createdDate: "2026-04-06 16:00:00",
    expiresAt: "2026-04-07 16:00:00",
    protocol: "#03ZD4B",
    status: 1,
    solicitor: { data: { name: "Ana Costa" } },
    totalAmount: 45000,
    costCenter: { data: { id: "3", name: "01AD300102 - B4B-ADM - FINANCEIRO" } },
    description: "Hospedagem para treinamento",
    permissions: { data: { pay: false, approve: false, reprove: false } },
  },
  {
    id: 6688710,
    approvalSlug: "eyJ0eXBlIjoiQ2FyT3JkZXIiLCJpZCI6ODkwMTIzfQ",
    type: "CarOrder",
    decidedDate: "2026-04-06 08:00:00",
    createdDate: "2026-04-05 15:30:00",
    expiresAt: "2026-04-06 15:30:00",
    protocol: "#03ZC8K",
    status: 3,
    solicitor: { data: { name: "Marcos Tavares" } },
    totalAmount: 18500,
    costCenter: { data: { id: "4", name: "01AD120201 - ATG-OPERACOES - LOGISTICA" } },
    description: "Deslocamento para visita técnica",
    permissions: { data: { pay: false, approve: false, reprove: false } },
  },
  {
    id: 6688811,
    approvalSlug: "eyJ0eXBlIjoiRmx5T3JkZXIiLCJpZCI6MTM3MTc2NTB9",
    type: "FlyOrder",
    decidedDate: "2026-04-06 08:00:00",
    createdDate: "2026-04-05 10:00:00",
    expiresAt: "2026-04-06 10:00:00",
    protocol: "#03ZC1M",
    status: 3,
    solicitor: { data: { name: "Fernanda Lima" } },
    totalAmount: 52000,
    costCenter: { data: { id: "1", name: "01AD300101 - B4B-ADM - COMERCIAL" } },
    description: "Voo para congresso",
    permissions: { data: { pay: false, approve: false, reprove: false } },
  },
  {
    id: 6688920,
    approvalSlug: "eyJ0eXBlIjoiSG90ZWxPcmRlciIsImlkIjoyNDIwMjYwMH0",
    type: "HotelOrder",
    decidedDate: "2026-04-05 16:00:00",
    createdDate: "2026-04-04 09:00:00",
    expiresAt: "2026-04-05 09:00:00",
    protocol: "#03ZB7P",
    status: 2,
    solicitor: { data: { name: "João Pereira" } },
    totalAmount: 89000,
    costCenter: { data: { id: "5", name: "01AD300103 - B4B-ADM - DIRETORIA" } },
    description: "Hotel acima do limite da política",
    permissions: { data: { pay: false, approve: false, reprove: false } },
  },
  {
    id: 6689001,
    approvalSlug: "eyJ0eXBlIjoiRmx5T3JkZXIiLCJpZCI6MTM3MTc4MDB9",
    type: "FlyOrder",
    decidedDate: "2026-04-06 12:00:00",
    createdDate: "2026-04-05 08:00:00",
    expiresAt: "2026-04-06 08:00:00",
    protocol: "#03ZB9R",
    status: 2,
    solicitor: { data: { name: "Maria Santos" } },
    totalAmount: 210000,
    costCenter: { data: { id: "5", name: "01AD300103 - B4B-ADM - DIRETORIA" } },
    description: "Classe executiva sem autorização",
    permissions: { data: { pay: false, approve: false, reprove: false } },
  },
  {
    id: 6689100,
    approvalSlug: "eyJ0eXBlIjoiQnVzT3JkZXIiLCJpZCI6NTYwMTIzfQ",
    type: "BusOrder",
    decidedDate: null,
    createdDate: "2026-04-03 10:00:00",
    expiresAt: "2026-04-04 10:00:00",
    protocol: "#03ZA3T",
    status: 5,
    solicitor: { data: { name: "Pedro Almeida" } },
    totalAmount: 8500,
    costCenter: { data: { id: "4", name: "01AD120201 - ATG-OPERACOES - LOGISTICA" } },
    description: "Ônibus para evento interno",
    permissions: { data: { pay: false, approve: false, reprove: false } },
  },
  {
    id: 6689200,
    approvalSlug: "eyJ0eXBlIjoiRmx5T3JkZXIiLCJpZCI6MTM3MTc5MDB9",
    type: "FlyOrder",
    decidedDate: "2026-04-04 07:00:00",
    createdDate: "2026-04-03 14:00:00",
    expiresAt: "2026-04-04 14:00:00",
    protocol: "#03ZA5V",
    status: 3,
    solicitor: { data: { name: "Lucas Martins" } },
    totalAmount: 34000,
    costCenter: { data: { id: "1", name: "01AD300101 - B4B-ADM - COMERCIAL" } },
    description: "Trecho dentro da política - auto aprovado",
    permissions: { data: { pay: false, approve: false, reprove: false } },
  },
  {
    id: 6689301,
    approvalSlug: "eyJ0eXBlIjoiSG90ZWxPcmRlciIsImlkIjoyNDIwMjcwMH0",
    type: "HotelOrder",
    decidedDate: "2026-04-05 11:00:00",
    createdDate: "2026-04-04 16:00:00",
    expiresAt: "2026-04-05 16:00:00",
    protocol: "#03ZB1X",
    status: 1,
    solicitor: { data: { name: "Camila Rodrigues" } },
    totalAmount: 32000,
    costCenter: { data: { id: "2", name: "01AD120202 - ATG-OPERACOES - SUPERVISAO DE REDE" } },
    description: "Pernoite para auditoria",
    permissions: { data: { pay: false, approve: false, reprove: false } },
  },
  {
    id: 6689400,
    approvalSlug: "eyJ0eXBlIjoiQ2FyT3JkZXIiLCJpZCI6ODkwMjAwfQ",
    type: "CarOrder",
    decidedDate: "2026-04-07 14:00:00",
    createdDate: "2026-04-06 11:00:00",
    expiresAt: "2026-04-07 11:00:00",
    protocol: "#03ZD6Z",
    status: 2,
    solicitor: { data: { name: "Roberto Nunes" } },
    totalAmount: 75000,
    costCenter: { data: { id: "5", name: "01AD300103 - B4B-ADM - DIRETORIA" } },
    description: "Locação premium não autorizada",
    permissions: { data: { pay: false, approve: false, reprove: false } },
  },
  {
    id: 6689500,
    approvalSlug: "eyJ0eXBlIjoiSG90ZWxPcmRlciIsImlkIjoyNDIwMjgwMH0",
    type: "HotelOrder",
    decidedDate: "2026-04-06 07:00:00",
    createdDate: "2026-04-05 12:00:00",
    expiresAt: "2026-04-06 12:00:00",
    protocol: "#03ZC3W",
    status: 3,
    solicitor: { data: { name: "Juliana Ferreira" } },
    totalAmount: 22000,
    costCenter: { data: { id: "2", name: "01AD120202 - ATG-OPERACOES - SUPERVISAO DE REDE" } },
    description: "Hotel econômico - auto aprovado",
    permissions: { data: { pay: false, approve: false, reprove: false } },
  },
];

const formatCurrency = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const getFlowName = (item: typeof mockApprovals[0]) => {
  if (item.status === 3) return "Aprovação Automática";
  return flowMap[item.status] || "Aprovação Gerencial";
};

const Relatorios = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Compute summaries
  const total = mockApprovals.length;
  const aprovadas = mockApprovals.filter((a) => a.status === 1).length;
  const autoAprovadas = mockApprovals.filter((a) => a.status === 3).length;
  const reprovadas = mockApprovals.filter((a) => a.status === 2).length;
  const pendentes = mockApprovals.filter((a) => a.status === 4).length;
  const expiradas = mockApprovals.filter((a) => a.status === 5).length;

  const resumoAprovacao = [
    { label: "Total de solicitações", valor: total, icon: FileText, cor: "text-primary" },
    { label: "Aprovadas", valor: aprovadas, icon: CheckCircle, cor: "text-green-600" },
    { label: "Aprovação automática", valor: autoAprovadas, icon: Zap, cor: "text-blue-500" },
    { label: "Reprovadas", valor: reprovadas, icon: XCircle, cor: "text-red-500" },
    { label: "Pendentes", valor: pendentes, icon: Clock, cor: "text-yellow-500" },
    { label: "Expiradas", valor: expiradas, icon: AlertTriangle, cor: "text-muted-foreground" },
  ];

  // Approvals by flow
  const flows = ["Aprovação Automática", "Aprovação Gerencial"];
  const aprovacoesPorFluxo = flows.map((fluxo) => {
    const items = mockApprovals.filter((a) => getFlowName(a) === fluxo);
    return {
      fluxo,
      aprovadas: items.filter((a) => a.status === 1 || a.status === 3).length,
      reprovadas: items.filter((a) => a.status === 2).length,
      pendentes: items.filter((a) => a.status === 4).length,
      expiradas: items.filter((a) => a.status === 5).length,
      total: items.length,
    };
  });

  // Filtered list
  const filtered = mockApprovals.filter((a) => {
    if (filterStatus === "approved" && a.status !== 1 && a.status !== 3) return false;
    if (filterStatus !== "all" && filterStatus !== "approved" && a.status !== Number(filterStatus)) return false;
    if (filterType !== "all" && a.type !== filterType) return false;
    return true;
  });

  const typeSlugMap: Record<string, string> = {
    FlyOrder: "fly",
    HotelOrder: "hotel",
    CarOrder: "car",
    BusOrder: "bus",
  };

  const detailUrl = (type: string, id: number) =>
    `https://app.onfly.com/travel/#/travel/reserve-details/${typeSlugMap[type] || "fly"}/${id}`;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Relatórios de Aprovação</h1>
            <p className="text-sm text-muted-foreground">Detalhamento dos fluxos de aprovação de viagens — Abril/2026</p>
          </div>
        </div>

        {/* Informativo de Pendentes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{pendentes} reserva{pendentes !== 1 ? 's' : ''} pendente{pendentes !== 1 ? 's' : ''} de aprovação</p>
            <p className="text-sm text-muted-foreground">Existem solicitações aguardando análise no fluxo de aprovação</p>
          </div>
        </div>

        {/* Aprovações por Fluxo */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Aprovações por Fluxo</h2>
          <div className="space-y-4">
            {aprovacoesPorFluxo.map((f) => {
              const pctAprov = f.total > 0 ? Math.round((f.aprovadas / f.total) * 100) : 0;
              const pctReprov = f.total > 0 ? Math.round((f.reprovadas / f.total) * 100) : 0;
              const pctPend = f.total > 0 ? Math.round((f.pendentes / f.total) * 100) : 0;
              const pctExp = f.total > 0 ? Math.round((f.expiradas / f.total) * 100) : 0;
              return (
                <div key={f.fluxo}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-foreground font-medium">{f.fluxo}</span>
                    <span className="text-muted-foreground text-xs">
                      {f.aprovadas} aprovadas · {f.reprovadas} reprovadas · {f.pendentes} pendentes · {f.expiradas} expiradas · {f.total} total
                    </span>
                  </div>
                  <div className="flex w-full h-2.5 rounded-full overflow-hidden bg-secondary">
                    <div className="bg-green-500 h-full" style={{ width: `${pctAprov}%` }} />
                    <div className="bg-red-400 h-full" style={{ width: `${pctReprov}%` }} />
                    <div className="bg-yellow-400 h-full" style={{ width: `${pctPend}%` }} />
                    <div className="bg-gray-400 h-full" style={{ width: `${pctExp}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Detalhamento das Aprovações</h2>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px] h-9 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="approved">Aprovada</SelectItem>
                  <SelectItem value="2">Reprovada</SelectItem>
                  <SelectItem value="4">Pendente</SelectItem>
                  <SelectItem value="5">Expirada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px] h-9 text-xs">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="FlyOrder">Aéreo</SelectItem>
                  <SelectItem value="HotelOrder">Hotel</SelectItem>
                  <SelectItem value="CarOrder">Carro</SelectItem>
                  <SelectItem value="BusOrder">Ônibus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Protocolo</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Tipo</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Solicitante</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Descrição</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Centro de Custo</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Valor</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Fluxo</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Criado em</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Decisão</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Detalhe</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const typeInfo = typeMap[item.type] || { label: item.type, icon: FileText };
                  const TypeIcon = typeInfo.icon;
                  const st = statusMap[item.status] || statusMap[4];
                  return (
                    <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono font-semibold text-primary">{item.protocol}</td>
                      <td className="px-4 py-3">
                        <Tooltip>
                          <TooltipTrigger>
                            <TypeIcon className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>{typeInfo.label}</TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{item.solicitor.data.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{item.description}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[180px] truncate">{item.costCenter.data.name}</td>
                      <td className="px-4 py-3 text-sm text-foreground text-right font-medium">{formatCurrency(item.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent text-accent-foreground whitespace-nowrap">
                          {getFlowName(item)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-xs ${st.color} border whitespace-nowrap`}>
                          {st.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(item.createdDate)}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {item.decidedDate ? formatDateTime(item.decidedDate) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <a
                          href={detailUrl(item.type, item.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      Nenhuma aprovação encontrada com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border text-xs text-muted-foreground">
            Exibindo {filtered.length} de {total} registros
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Relatorios;
