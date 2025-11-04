-- Criar tabela de serviços
CREATE TABLE IF NOT EXISTS public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de colaboradores
CREATE TABLE IF NOT EXISTS public.collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de relação entre colaboradores e serviços
CREATE TABLE IF NOT EXISTS public.collaborator_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collaborator_id UUID NOT NULL REFERENCES public.collaborators(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collaborator_id, service_id)
);

-- Habilitar RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborator_services ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para acesso público (ajustar conforme necessário)
CREATE POLICY "Permitir leitura pública de serviços" 
ON public.services FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de serviços" 
ON public.services FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de serviços" 
ON public.services FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão pública de serviços" 
ON public.services FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de colaboradores" 
ON public.collaborators FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de colaboradores" 
ON public.collaborators FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de colaboradores" 
ON public.collaborators FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão pública de colaboradores" 
ON public.collaborators FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de relações" 
ON public.collaborator_services FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de relações" 
ON public.collaborator_services FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir exclusão pública de relações" 
ON public.collaborator_services FOR DELETE USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para atualização automática
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaborators_updated_at
BEFORE UPDATE ON public.collaborators
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();