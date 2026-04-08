import Layout from "@/components/layout/Layout";
import { FileText, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";

const gastos = [
  { categoria: "Aéreo", valor: "R$ 12.450,00", percentual: 45 },
  { categoria: "Hotel", valor: "R$ 8.200,00", percentual: 30 },
  { categoria: "Alimentação", valor: "R$ 3.800,00", percentual: 14 },
  { categoria: "Transporte", valor: "R$ 3.050,00", percentual: 11 },
];

const viajantes = [
  { nome: "Ivan Silva", viagens: 8, gasto: "R$ 14.200,00" },
  { nome: "Maria Santos", viagens: 5, gasto: "R$ 9.800,00" },
  { nome: "Carlos Oliveira", viagens: 3, gasto: "R$ 6.500,00" },
  { nome: "Ana Costa", viagens: 2, gasto: "R$ 4.100,00" },
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
            <h1 className="text-xl font-bold text-foreground">Relatórios</h1>
            <p className="text-sm text-muted-foreground">Visão geral de gastos e viajantes</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Total de gastos</span>
            </div>
            <p className="text-2xl font-bold text-foreground">R$ 27.500,00</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />-12% vs mês anterior</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">Viajantes ativos</span>
            </div>
            <p className="text-2xl font-bold text-foreground">18</p>
            <p className="text-xs text-muted-foreground mt-1">neste mês</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Total de viagens</span>
            </div>
            <p className="text-2xl font-bold text-foreground">24</p>
            <p className="text-xs text-muted-foreground mt-1">em abril/2026</p>
          </div>
        </div>

        {/* Gastos por Categoria */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Gastos por Categoria</h2>
          <div className="space-y-4">
            {gastos.map((g) => (
              <div key={g.categoria}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{g.categoria}</span>
                  <span className="text-muted-foreground">{g.valor} ({g.percentual}%)</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div className="bg-primary rounded-full h-2.5 transition-all" style={{ width: `${g.percentual}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Viajantes */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Top Viajantes</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Colaborador</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Viagens</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Gasto total</th>
              </tr>
            </thead>
            <tbody>
              {viajantes.map((v) => (
                <tr key={v.nome} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-foreground">{v.nome}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{v.viagens}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{v.gasto}</td>
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
