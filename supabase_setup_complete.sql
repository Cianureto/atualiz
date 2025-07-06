-- =====================================================
-- CONFIGURAÇÃO COMPLETA DO BANCO DE DADOS - PROJETO CERTIN
-- =====================================================
-- Copie e cole todo este código no Editor SQL do Supabase
-- Execute todos os comandos de uma vez

-- =====================================================
-- 1. CRIAR TABELAS
-- =====================================================

-- Tabela produtos
CREATE TABLE IF NOT EXISTS produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  imagem_url TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  categoria VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela bairros
CREATE TABLE IF NOT EXISTS bairros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  taxa_entrega DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'preparando', 'entregue', 'cancelado')),
  observacoes TEXT,
  total DECIMAL(10,2) NOT NULL,
  bairro_id UUID REFERENCES bairros(id),
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_telefone VARCHAR(20) NOT NULL,
  cliente_endereco TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela itens_pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES produtos(id),
  quantidade INTEGER NOT NULL DEFAULT 1,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de clientes
CREATE TABLE clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  data_nascimento DATE NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  maior_idade BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CRIAR FUNÇÃO PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 3. CRIAR TRIGGERS
-- =====================================================

-- Trigger para produtos
DROP TRIGGER IF EXISTS update_produtos_updated_at ON produtos;
CREATE TRIGGER update_produtos_updated_at 
    BEFORE UPDATE ON produtos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para bairros
DROP TRIGGER IF EXISTS update_bairros_updated_at ON bairros;
CREATE TRIGGER update_bairros_updated_at 
    BEFORE UPDATE ON bairros
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para pedidos
DROP TRIGGER IF EXISTS update_pedidos_updated_at ON pedidos;
CREATE TRIGGER update_pedidos_updated_at 
    BEFORE UPDATE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para clientes
DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
CREATE TRIGGER update_clientes_updated_at 
    BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bairros ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CRIAR POLÍTICAS DE SEGURANÇA
-- =====================================================

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Produtos são visíveis para todos" ON produtos;
DROP POLICY IF EXISTS "Bairros são visíveis para todos" ON bairros;
DROP POLICY IF EXISTS "Pedidos são visíveis para todos" ON pedidos;
DROP POLICY IF EXISTS "Itens de pedido são visíveis para todos" ON itens_pedido;
DROP POLICY IF EXISTS "Clientes são visíveis para todos" ON clientes;

-- Política para produtos - leitura pública
CREATE POLICY "Produtos são visíveis para todos" ON produtos
  FOR SELECT USING (true);

-- Política para bairros - leitura pública
CREATE POLICY "Bairros são visíveis para todos" ON bairros
  FOR SELECT USING (true);

-- Política para pedidos - leitura e escrita públicas
CREATE POLICY "Pedidos são visíveis para todos" ON pedidos
  FOR ALL USING (true);

-- Política para itens de pedido - leitura e escrita públicas
CREATE POLICY "Itens de pedido são visíveis para todos" ON itens_pedido
  FOR ALL USING (true);

-- Política para clientes - leitura e escrita públicas
CREATE POLICY "Clientes são visíveis para todos" ON clientes
  FOR ALL USING (true);

-- =====================================================
-- 6. INSERIR DADOS INICIAIS
-- =====================================================

-- Inserir bairros
INSERT INTO bairros (id, nome, taxa_entrega) VALUES
  ('1', 'Centro', 5.00),
  ('2', 'Jardim América', 7.50),
  ('3', 'Vila Nova', 6.00),
  ('4', 'Bela Vista', 8.00),
  ('5', 'Santa Rosa', 9.50)
ON CONFLICT (id) DO NOTHING;

-- Inserir produtos
INSERT INTO produtos (id, nome, descricao, preco, imagem_url, ativo, ordem, categoria) VALUES
  ('1', 'Pizza Margherita', 'Molho de tomate, mussarela, manjericão fresco e azeite', 35.90, 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400', true, 1, 'Pizzas'),
  ('2', 'Pizza Pepperoni', 'Molho de tomate, mussarela e pepperoni', 42.90, 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400', true, 2, 'Pizzas'),
  ('3', 'Hambúrguer Artesanal', 'Pão brioche, blend 180g, queijo cheddar, alface, tomate e molho especial', 28.90, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400', true, 3, 'Hambúrgueres'),
  ('4', 'Batata Frita Especial', 'Batatas rústicas com temperos especiais e molho barbecue', 18.90, 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400', true, 4, 'Acompanhamentos'),
  ('5', 'Refrigerante Lata', 'Coca-Cola, Pepsi, Guaraná ou Sprite - 350ml', 6.90, 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400', true, 5, 'Bebidas'),
  ('6', 'Açaí 500ml', 'Açaí cremoso com granola, banana e mel', 22.90, 'https://images.pexels.com/photos/4051662/pexels-photo-4051662.jpeg?auto=compress&cs=tinysrgb&w=400', false, 6, 'Sobremesas')
ON CONFLICT (id) DO NOTHING;

-- Inserir pedidos de exemplo
INSERT INTO pedidos (id, data_hora, status, observacoes, total, bairro_id, cliente_nome, cliente_telefone, cliente_endereco) VALUES
  ('1', '2024-01-15T19:30:00', 'confirmado', 'Sem cebola na pizza', 48.40, '1', 'João Silva', '(11) 99999-9999', 'Rua das Flores, 123'),
  ('2', '2024-01-15T20:15:00', 'preparando', '', 57.30, '2', 'Maria Santos', '(11) 88888-8888', 'Av. Principal, 456')
ON CONFLICT (id) DO NOTHING;

-- Inserir itens dos pedidos
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, observacoes) VALUES
  ('1', '1', 1, 'Sem cebola'),
  ('1', '5', 2, NULL),
  ('2', '3', 2, NULL)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. VERIFICAR CONFIGURAÇÃO
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('produtos', 'bairros', 'pedidos', 'itens_pedido', 'clientes')
ORDER BY table_name, ordinal_position;

-- Verificar se os dados foram inseridos
SELECT 'produtos' as tabela, COUNT(*) as total FROM produtos
UNION ALL
SELECT 'bairros' as tabela, COUNT(*) as total FROM bairros
UNION ALL
SELECT 'pedidos' as tabela, COUNT(*) as total FROM pedidos
UNION ALL
SELECT 'itens_pedido' as tabela, COUNT(*) as total FROM itens_pedido
UNION ALL
SELECT 'clientes' as tabela, COUNT(*) as total FROM clientes;

-- =====================================================
-- CONFIGURAÇÃO CONCLUÍDA!
-- =====================================================
-- 
-- Agora você pode:
-- 1. Testar a aplicação em http://localhost:5173
-- 2. Clicar em "Teste DB" no header
-- 3. Verificar se a conexão está funcionando
-- 4. Usar os dados do banco em vez dos mockados
--
-- ===================================================== 