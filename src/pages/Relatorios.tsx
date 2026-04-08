import Layout from "@/components/layout/Layout";
import { FileText, CheckCircle, Zap, XCircle, AlertTriangle, Clock } from "lucide-react";

const resumoAprovacao = [
  { label: "Total de solicitações", valor: 42, icon: FileText, cor: "text-primary" },
  { label: "Aprovadas", valor: 28, icon: CheckCircle, cor: "text-green-600" },
  { label: "Aprovação automática", valor: 18, icon: Zap, cor: "text-blue-500" },
  { label: "Reprovadas / Falhas", valor: 8, icon: XCircle, cor: "text-red-500" },
  { label: "Pendentes", valor: 6, icon: Clock, cor: "text-yellow-500" },
];

const falhasFluxo = [
  {
    id: 1,
    viajante: "Carlos Oliveira",
    tipo: "Aéreo",
    trecho: "GRU → MIA",
    fluxo: "Aprovação Gerencial",
    motivo: "Orçamento excedido – sem aprovação do diretor",
    data: "02/04/2026",
  },
  {
    id: 2,
    viajante: "Ana Costa",
    tipo: "Hotel",
    trecho: "Hotel Fasano - SP",
    fluxo: "Política de Viagem",
    motivo: "Valor da diária acima do limite permitido",
    data: "05/04/2026",
  },
  {
    id: 3,
    viajante: "João Pereira",
    tipo: "Aéreo",
    trecho: "BSB → GRU",
    fluxo: "Aprovação Automática",
    motivo: "Reserva expirada antes da conclusão do fluxo",
    data: "07/04/2026",
  },
  {
    id: 4,
    viajante: "Maria Santos",
    tipo: "Aéreo",
    trecho: "CGH → SDU",
    fluxo: "Aprovação Gerencial",
    motivo: "Aprovador não respondeu dentro do prazo (48h)",
    data: "08/04/2026",
  },
];

const aprovacoesPorFluxo = [
  { fluxo: "Aprovação Automática", aprovadas: 18, reprovadas: 1, total: 19 },
  { fluxo: "Aprovação Gerencial", aprovadas: 7, reprovadas: 5, total: 12 },
  { fluxo: "Aprovação Diretoria", aprovadas: 3, reprovadas: 2, total: 5 },
  { fluxo: "Política de Viagem", aprovadas: 0, reprovadas: 0, total: 6 },
];

const Relatorios = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Relatórios de Aprovação</h1>
            <p className="text-sm text-muted-foreground">Visão geral dos fluxos de aprovação de viagens — Abril/2026</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {resumoAprovacao.map((item) => (
            <div key={item.label} className="bg-card border border-border rounded-2xl p-4 text-center">
              <item.icon className={`w-5 h-5 mx-auto mb-2 ${item.cor}`} />
              <p className="text-2xl font-bold text-foreground">{item.valor}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Aprovações por Fluxo */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Aprovações por Fluxo</h2>
          <div className="space-y-4">
            {aprovacoesPorFluxo.map((f) => {
              const pctAprov = f.total > 0 ? Math.round((f.aprovadas / f.total) * 100) : 0;
              const pctReprov = f.total > 0 ? Math.round((f.reprovadas / f.total) * 100) : 0;
              return (
                <div key={f.fluxo}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-foreground font-medium">{f.fluxo}</span>
                    <span className="text-muted-foreground text-xs">
                      {f.aprovadas} aprovadas · {f.reprovadas} reprovadas · {f.total} total
                    </span>
                  </div>
                  <div className="flex w-full h-2.5 rounded-full overflow-hidden bg-secondary">
                    <div className="bg-green-500 h-full transition-all" style={{ width: `${pctAprov}%` }} />
                    <div className="bg-red-400 h-full transition-all" style={{ width: `${pctReprov}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Falhas no Fluxo de Aprovação */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h2 className="text-lg font-semibold text-foreground">Falhas no Fluxo de Aprovação</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Viajante</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Trecho</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Fluxo</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Motivo da falha</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {falhasFluxo.map((f) => (
                <tr key={f.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-foreground">{f.viajante}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-foreground">{f.trecho}</p>
                    <p className="text-xs text-muted-foreground">{f.tipo}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent text-accent-foreground">
                      {f.fluxo}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground max-w-xs">{f.motivo}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{f.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Relatorios;
