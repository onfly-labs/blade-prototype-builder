import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { ShieldCheck, Plus, ToggleLeft, ToggleRight, Trash2, Edit, Save, X, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { fetchRules, createRule, updateRule, deleteRule, type Rule } from "@/lib/rulesStore";

type View = "list" | "form";

const AprovacoesAutomaticas = () => {
  const [view, setView] = useState<View>("list");
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const loadRules = async () => {
    try {
      setLoading(true);
      const data = await fetchRules();
      setRules(data);
    } catch {
      toast({ title: "Erro ao carregar regras", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRules(); }, []);

  const handleNewRule = () => {
    setEditingRule(null);
    setFormName("");
    setFormDesc("");
    setView("form");
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setFormName(rule.name);
    setFormDesc(rule.description);
    setView("form");
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    try {
      if (editingRule) {
        await updateRule(editingRule.id, { name: formName, description: formDesc });
        toast({ title: "Regra atualizada", description: `"${formName}" foi salva com sucesso.` });
      } else {
        await createRule(formName, formDesc);
        toast({ title: "Regra salva", description: `"${formName}" foi criada e ativada.` });
      }
      await loadRules();
      setView("list");
    } catch {
      toast({ title: "Erro ao salvar regra", variant: "destructive" });
    }
  };

  const handleToggle = async (rule: Rule) => {
    try {
      await updateRule(rule.id, { active: !rule.active });
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, active: !r.active } : r));
      toast({ title: !rule.active ? "Regra ativada" : "Regra desativada", description: `"${rule.name}" foi ${!rule.active ? "ativada" : "desativada"}.` });
    } catch {
      toast({ title: "Erro ao atualizar regra", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRule(id);
      setRules(prev => prev.filter(r => r.id !== id));
      toast({ title: "Regra removida" });
    } catch {
      toast({ title: "Erro ao remover regra", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => setView("list")} className="hover:text-foreground transition-colors">Aprovações Automáticas</button>
          {view === "form" && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground">{editingRule ? "Editar regra" : "Nova regra"}</span>
            </>
          )}
        </div>

        {view === "list" && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Regras de Viagem</h1>
                <p className="text-sm text-muted-foreground">Gerencie regras e políticas de aprovação automática</p>
              </div>
              <Button onClick={handleNewRule} className="rounded-xl gap-2 ml-auto" size="sm">
                <Plus className="w-4 h-4" />
                Nova regra
              </Button>
            </div>
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <p className="font-medium text-foreground">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleToggle(rule)} className="transition-colors">
                        {rule.active ? <ToggleRight className="w-8 h-8 text-primary" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
                      </button>
                      <button onClick={() => handleEditRule(rule)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(rule.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {rules.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhuma regra cadastrada</p>
                    <Button onClick={handleNewRule} variant="outline" className="mt-4 rounded-xl">Criar primeira regra</Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {view === "form" && (
          <>
            <h1 className="text-xl font-bold text-foreground mb-6">{editingRule ? "Editar regra" : "Nova regra"}</h1>
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nome da regra</label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Ex: Limite de diária de hotel" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Descrição</label>
                <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={3} className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Descreva a regra em detalhes..." />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave} className="rounded-xl gap-2"><Save className="w-4 h-4" />Salvar regra</Button>
                <Button onClick={() => setView("list")} variant="outline" className="rounded-xl gap-2"><X className="w-4 h-4" />Cancelar</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AprovacoesAutomaticas;
