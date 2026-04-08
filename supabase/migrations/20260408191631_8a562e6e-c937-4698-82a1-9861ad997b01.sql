
CREATE TABLE public.approval_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.approval_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view rules"
ON public.approval_rules FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create rules"
ON public.approval_rules FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update rules"
ON public.approval_rules FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete rules"
ON public.approval_rules FOR DELETE
TO authenticated
USING (true);

-- Seed default rules
INSERT INTO public.approval_rules (name, description, active) VALUES
  ('Limite de valor diária hotel', 'Limitar valor de diária de hotel a R$500', true),
  ('Antecedência mínima aéreo', 'Passagens aéreas devem ser compradas com 7 dias de antecedência', true),
  ('Aprovação para internacional', 'Viagens internacionais precisam de aprovação do gestor', false);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_approval_rules_updated_at
BEFORE UPDATE ON public.approval_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
