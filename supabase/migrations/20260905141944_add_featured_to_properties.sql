-- Marca quais imóveis o CRM destacou para aparecerem nos "Imóveis em Destaque" da home,
-- filtrados por região (Praia Brava, Frente Mar, Barra Sul, Centro, Barra Norte).
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
