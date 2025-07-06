-- =====================================================
-- TESTE SIMPLES DO SUPABASE
-- =====================================================
-- Cole este código no SQL Editor do Supabase e execute

-- 1. Verificar se as tabelas existem
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('produtos', 'bairros', 'pedidos', 'itens_pedido')
ORDER BY table_name;

-- 2. Verificar estrutura da tabela produtos
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'produtos'
ORDER BY ordinal_position;

-- 3. Contar registros em cada tabela
SELECT 'produtos' as tabela, COUNT(*) as total FROM produtos
UNION ALL
SELECT 'bairros' as tabela, COUNT(*) as total FROM bairros
UNION ALL
SELECT 'pedidos' as tabela, COUNT(*) as total FROM pedidos
UNION ALL
SELECT 'itens_pedido' as tabela, COUNT(*) as total FROM itens_pedido;

-- 4. Verificar alguns produtos
SELECT id, nome, preco, categoria, ativo 
FROM produtos 
ORDER BY ordem;

-- 5. Verificar bairros
SELECT id, nome, taxa_entrega 
FROM bairros 
ORDER BY nome;

-- 6. Testar relacionamento entre pedidos e bairros
SELECT 
  p.id,
  p.cliente_nome,
  p.total,
  p.status,
  b.nome as bairro_nome,
  b.taxa_entrega
FROM pedidos p
JOIN bairros b ON p.bairro_id = b.id
ORDER BY p.data_hora DESC; 