-- COLE ESTE CÓDIGO NO EDITOR SQL DO SUPABASE E CLIQUE EM "RUN"

-- Adicionar campo ativo na tabela bairros
ALTER TABLE bairros 
ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- Atualizar bairros existentes para ativo = true
UPDATE bairros SET ativo = true WHERE ativo IS NULL;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'bairros' 
  AND column_name = 'ativo'; 