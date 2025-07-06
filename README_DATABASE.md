# Configuração do Banco de Dados - Projeto Certin

Este guia explica como configurar e usar o banco de dados Supabase para o projeto Certin.

## 📋 Pré-requisitos

1. Conta no Supabase (gratuita em https://supabase.com)
2. Node.js instalado
3. Conhecimento básico de SQL

## 🚀 Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Digite um nome para o projeto (ex: "certin-database")
6. Escolha uma senha forte para o banco
7. Escolha uma região próxima
8. Clique em "Create new project"

### 2. Obter Credenciais

1. No dashboard do Supabase, vá para "Settings" > "API"
2. Copie a "Project URL" e "anon public" key
3. Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=sua_project_url_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Necessárias

Execute os seguintes comandos SQL no Editor SQL do Supabase:

#### 1. Tabela `produtos`

```sql
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

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON produtos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 2. Tabela `bairros`

```sql
CREATE TABLE bairros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  taxa_entrega DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_bairros_updated_at BEFORE UPDATE ON bairros
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 3. Tabela `pedidos`

```sql
CREATE TABLE pedidos (
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

CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 4. Tabela `itens_pedido`

```sql
CREATE TABLE itens_pedido (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES produtos(id),
  quantidade INTEGER NOT NULL DEFAULT 1,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Configuração de Políticas de Segurança (RLS)

### Habilitar RLS

```sql
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bairros ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_pedido ENABLE ROW LEVEL SECURITY;
```

### Políticas para Produtos (Leitura pública)

```sql
CREATE POLICY "Produtos são visíveis para todos" ON produtos
  FOR SELECT USING (true);
```

### Políticas para Bairros (Leitura pública)

```sql
CREATE POLICY "Bairros são visíveis para todos" ON bairros
  FOR SELECT USING (true);
```

### Políticas para Pedidos (Leitura e escrita públicas)

```sql
CREATE POLICY "Pedidos são visíveis para todos" ON pedidos
  FOR ALL USING (true);
```

### Políticas para Itens de Pedido (Leitura e escrita públicas)

```sql
CREATE POLICY "Itens de pedido são visíveis para todos" ON itens_pedido
  FOR ALL USING (true);
```

## 📊 Migração dos Dados

### 1. Executar Migração

No seu projeto React, você pode executar a migração dos dados mockados:

```typescript
import { migrateData } from './src/utils/migrateData'

// Execute no console do navegador ou em um componente
migrateData().then(() => {
  console.log('Dados migrados com sucesso!')
}).catch(error => {
  console.error('Erro na migração:', error)
})
```

### 2. Verificar Dados

Após a migração, você pode verificar se os dados foram inseridos corretamente no painel do Supabase em "Table Editor".

## 🔧 Uso no Projeto

### 1. Importar Hooks

```typescript
import { useProdutos, useBairros, usePedidos } from './hooks/useDatabase'
```

### 2. Usar nos Componentes

```typescript
function ProductGrid() {
  const { produtos, loading, error } = useProdutos()

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      {produtos.map(produto => (
        <ProductCard key={produto.id} produto={produto} />
      ))}
    </div>
  )
}
```

## 🛠️ Operações Disponíveis

### Produtos
- `getAll()` - Listar todos os produtos
- `getById(id)` - Buscar produto por ID
- `create(produto)` - Criar novo produto
- `update(id, produto)` - Atualizar produto
- `delete(id)` - Deletar produto

### Bairros
- `getAll()` - Listar todos os bairros
- `getById(id)` - Buscar bairro por ID
- `create(bairro)` - Criar novo bairro
- `update(id, bairro)` - Atualizar bairro
- `delete(id)` - Deletar bairro

### Pedidos
- `getAll()` - Listar todos os pedidos
- `getById(id)` - Buscar pedido por ID
- `create(pedido)` - Criar novo pedido
- `updateStatus(id, status)` - Atualizar status do pedido

## 🔍 Monitoramento

### Logs do Supabase

1. No dashboard do Supabase, vá para "Logs"
2. Monitore as consultas e erros
3. Configure alertas se necessário

### Métricas

- Acesse "Analytics" no dashboard para ver métricas de uso
- Monitore o uso de recursos na aba "Usage"

## 🚨 Troubleshooting

### Erro de Conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo

### Erro de Permissão
- Verifique se as políticas RLS estão configuradas corretamente
- Confirme se as tabelas existem

### Dados não aparecem
- Execute a migração novamente
- Verifique se há erros no console do navegador
- Confirme se os dados estão na tabela via Table Editor

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [API Reference](https://supabase.com/docs/reference/javascript/introduction) 