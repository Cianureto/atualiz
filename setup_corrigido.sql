-- COLE ESTE CÓDIGO NO EDITOR SQL DO SUPABASE E CLIQUE EM "RUN"

-- 1. Criar tabela de produtos
CREATE TABLE produtos (
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

-- 2. Criar tabela de bairros
CREATE TABLE bairros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  taxa_entrega DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de pedidos
CREATE TABLE pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pendente',
  observacoes TEXT,
  total DECIMAL(10,2) NOT NULL,
  bairro_id UUID REFERENCES bairros(id),
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_telefone VARCHAR(20) NOT NULL,
  cliente_endereco TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela de itens do pedido
CREATE TABLE itens_pedido (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES produtos(id),
  quantidade INTEGER NOT NULL DEFAULT 1,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Inserir bairros (sem IDs fixos)
INSERT INTO bairros (nome, taxa_entrega) VALUES
  ('Centro', 5.00),
  ('Jardim América', 7.50),
  ('Vila Nova', 6.00),
  ('Bela Vista', 8.00),
  ('Santa Rosa', 9.50);

-- 6. Inserir produtos (sem IDs fixos)
INSERT INTO produtos (nome, descricao, preco, imagem_url, ativo, ordem, categoria) VALUES
  ('Pizza Margherita', 'Molho de tomate, mussarela, manjericão fresco e azeite', 35.90, 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400', true, 1, 'Pizzas'),
  ('Pizza Pepperoni', 'Molho de tomate, mussarela e pepperoni', 42.90, 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400', true, 2, 'Pizzas'),
  ('Hambúrguer Artesanal', 'Pão brioche, blend 180g, queijo cheddar, alface, tomate e molho especial', 28.90, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400', true, 3, 'Hambúrgueres'),
  ('Batata Frita Especial', 'Batatas rústicas com temperos especiais e molho barbecue', 18.90, 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400', true, 4, 'Acompanhamentos'),
  ('Refrigerante Lata', 'Coca-Cola, Pepsi, Guaraná ou Sprite - 350ml', 6.90, 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400', true, 5, 'Bebidas'),
  ('Açaí 500ml', 'Açaí cremoso com granola, banana e mel', 22.90, 'https://images.pexels.com/photos/4051662/pexels-photo-4051662.jpeg?auto=compress&cs=tinysrgb&w=400', false, 6, 'Sobremesas');

-- 7. Inserir pedidos de exemplo (usando IDs dos bairros que foram criados)
INSERT INTO pedidos (data_hora, status, observacoes, total, bairro_id, cliente_nome, cliente_telefone, cliente_endereco) 
SELECT 
  '2024-01-15T19:30:00'::timestamp with time zone, 
  'confirmado', 
  'Sem cebola na pizza', 
  48.40, 
  b.id, 
  'João Silva', 
  '(11) 99999-9999', 
  'Rua das Flores, 123'
FROM bairros b WHERE b.nome = 'Centro';

INSERT INTO pedidos (data_hora, status, observacoes, total, bairro_id, cliente_nome, cliente_telefone, cliente_endereco) 
SELECT 
  '2024-01-15T20:15:00'::timestamp with time zone, 
  'preparando', 
  '', 
  57.30, 
  b.id, 
  'Maria Santos', 
  '(11) 88888-8888', 
  'Av. Principal, 456'
FROM bairros b WHERE b.nome = 'Jardim América';

-- 8. Inserir itens dos pedidos (usando IDs dos produtos e pedidos que foram criados)
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, observacoes)
SELECT 
  p.id,
  prod.id,
  1,
  'Sem cebola'
FROM pedidos p, produtos prod 
WHERE p.cliente_nome = 'João Silva' AND prod.nome = 'Pizza Margherita';

INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, observacoes)
SELECT 
  p.id,
  prod.id,
  2,
  NULL
FROM pedidos p, produtos prod 
WHERE p.cliente_nome = 'João Silva' AND prod.nome = 'Refrigerante Lata';

INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, observacoes)
SELECT 
  p.id,
  prod.id,
  2,
  NULL
FROM pedidos p, produtos prod 
WHERE p.cliente_nome = 'Maria Santos' AND prod.nome = 'Hambúrguer Artesanal';

-- 9. Verificar se deu certo
SELECT 'produtos' as tabela, COUNT(*) as total FROM produtos
UNION ALL
SELECT 'bairros' as tabela, COUNT(*) as total FROM bairros
UNION ALL
SELECT 'pedidos' as tabela, COUNT(*) as total FROM pedidos
UNION ALL
SELECT 'itens_pedido' as tabela, COUNT(*) as total FROM itens_pedido; 