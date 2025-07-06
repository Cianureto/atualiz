-- COLE ESTE CÓDIGO NO EDITOR SQL DO SUPABASE E CLIQUE EM "RUN"

-- Adicionar campos de endereço na tabela pedidos
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cliente_rua VARCHAR(255),
ADD COLUMN IF NOT EXISTS cliente_numero VARCHAR(20),
ADD COLUMN IF NOT EXISTS cliente_ponto_referencia TEXT;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
  AND column_name IN ('cliente_rua', 'cliente_numero', 'cliente_ponto_referencia')
ORDER BY ordinal_position; 