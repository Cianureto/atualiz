-- COLE ESTE CÓDIGO NO EDITOR SQL DO SUPABASE E CLIQUE EM "RUN"

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

-- Habilitar RLS para clientes
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Criar política para clientes (leitura e escrita públicas)
CREATE POLICY "Clientes são visíveis para todos" ON clientes
  FOR ALL USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_clientes_updated_at 
    BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verificar se a tabela foi criada
SELECT 'clientes' as tabela, COUNT(*) as total FROM clientes; 