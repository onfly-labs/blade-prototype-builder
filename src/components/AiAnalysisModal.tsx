import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bot, CheckCircle2, XCircle, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";

type AiAnalysisModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  decision: "approved" | "reproved";
  reservationId?: string | number;
};

const approvedAnalysis = {
  summary: "A reserva foi analisada e aprovada automaticamente pela inteligência artificial com base nos critérios da política de viagens corporativas.",
  criteria: [
    { label: "Política de viagens", status: "ok", detail: "Dentro dos limites de valor e antecedência mínima." },
    { label: "Orçamento do centro de custo", status: "ok", detail: "O centro de custo possui saldo disponível suficiente." },
    { label: "Histórico de preços", status: "ok", detail: "O valor está dentro da média dos últimos 90 dias para o mesmo trecho/destino." },
    { label: "Duplicidade", status: "ok", detail: "Nenhuma reserva duplicada identificada para o mesmo período." },
  ],
  confidence: 94,
};

const reprovedAnalysis = {
  summary: "A reserva foi analisada e reprovada automaticamente pela inteligência artificial por não atender aos critérios da política de viagens.",
  criteria: [
    { label: "Política de viagens", status: "fail", detail: "O valor excede o limite permitido para a categoria." },
    { label: "Orçamento do centro de custo", status: "warning", detail: "O centro de custo está próximo do limite orçamentário mensal." },
    { label: "Histórico de preços", status: "fail", detail: "O valor está 38% acima da média dos últimos 90 dias para o mesmo trecho/destino." },
    { label: "Duplicidade", status: "ok", detail: "Nenhuma reserva duplicada identificada." },
  ],
  confidence: 89,
};

const statusIcon = (status: string) => {
  switch (status) {
    case "ok": return <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />;
    case "fail": return <XCircle className="w-4 h-4 text-destructive shrink-0" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />;
    default: return null;
  }
};

export default function AiAnalysisModal({ open, onOpenChange, decision, reservationId }: AiAnalysisModalProps) {
  const analysis = decision === "approved" ? approvedAnalysis : reprovedAnalysis;
  const isApproved = decision === "approved";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Bot className="w-5 h-5 text-primary" />
            Análise da IA
            {reservationId && <span className="text-xs text-muted-foreground font-normal">· Reserva {reservationId}</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Decision badge */}
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${isApproved ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            {isApproved
              ? <CheckCircle2 className="w-5 h-5 text-green-600" />
              : <XCircle className="w-5 h-5 text-destructive" />
            }
            <span className={`text-sm font-semibold ${isApproved ? "text-green-700" : "text-red-700"}`}>
              {isApproved ? "Aprovado pela IA" : "Reprovado pela IA"}
            </span>
            <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {analysis.confidence}% confiança
            </span>
          </div>

          {/* Summary */}
          <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>

          {/* Criteria */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Critérios Avaliados</h4>
            {analysis.criteria.map((c, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-secondary/50">
                {statusIcon(c.status)}
                <div>
                  <p className="text-sm font-medium text-foreground">{c.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
