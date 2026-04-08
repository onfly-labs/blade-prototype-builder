export interface Rule {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

const STORAGE_KEY = "onfly_approval_rules";

const defaultRules: Rule[] = [
  { id: 1, name: "Limite de valor diária hotel", description: "Limitar valor de diária de hotel a R$500", active: true },
  { id: 2, name: "Antecedência mínima aéreo", description: "Passagens aéreas devem ser compradas com 7 dias de antecedência", active: true },
  { id: 3, name: "Aprovação para internacional", description: "Viagens internacionais precisam de aprovação do gestor", active: false },
];

export const getRules = (): Rule[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultRules;
};

export const saveRules = (rules: Rule[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
};

export const getActiveRules = (): Rule[] => {
  return getRules().filter((r) => r.active);
};
