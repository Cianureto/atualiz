-- COLE ESTE CÓDIGO NO EDITOR SQL DO SUPABASE E CLIQUE EM "RUN"

-- Adicionar campos de endereço na tabela clientes
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS rua VARCHAR(255),
ADD COLUMN IF NOT EXISTS numero VARCHAR(20),
ADD COLUMN IF NOT EXISTS ponto_referencia TEXT;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clientes' 
  AND column_name IN ('rua', 'numero', 'ponto_referencia')
ORDER BY ordinal_position; 