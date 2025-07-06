# Sistema de Delivery com Autenticação Supabase

## Funcionalidades Implementadas

### 🔐 Sistema de Autenticação Completo
- **Login/Registro**: Autenticação por email e senha
- **Recuperação de Senha**: Envio de email para reset de senha
- **Proteção de Rotas**: Rotas protegidas que requerem autenticação
- **Perfil do Usuário**: Edição de dados pessoais (nome, telefone, endereço)
- **Logout**: Funcionalidade de sair da conta

### 🛒 Sistema de Carrinho
- Adicionar/remover produtos
- Atualizar quantidades
- Cálculo automático de totais
- Seleção de bairro para entrega

### 📱 Interface Responsiva
- Design moderno e responsivo
- Navegação intuitiva
- Feedback visual para ações do usuário

## Configuração do Supabase

### 1. Configurar o Projeto Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e a chave anônima

### 2. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 3. Executar o SQL para Configurar o Banco
Execute o SQL do arquivo `supabase_profiles.sql` no SQL Editor do Supabase:

```sql
-- Criar tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários editarem apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para usuários inserirem seu próprio perfil
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Função para criar perfil automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. Configurar Autenticação no Supabase
1. Vá para Authentication > Settings
2. Configure o URL de redirecionamento: `http://localhost:5173`
3. Ative a confirmação de email (opcional)

## Como Usar

### Para Usuários
1. **Registro**: Clique em "Entrar" no header e depois "Criar conta"
2. **Login**: Use email e senha para fazer login
3. **Perfil**: Clique em "Perfil" para editar seus dados
4. **Carrinho**: Adicione produtos e finalize pedidos
5. **Logout**: Clique em "Sair" para desconectar

### Para Desenvolvedores
1. **Instalar dependências**: `npm install`
2. **Configurar Supabase**: Siga os passos acima
3. **Executar projeto**: `npm run dev`
4. **Acessar**: `http://localhost:5173`

## Estrutura do Código

### Contextos
- `AuthContext`: Gerencia autenticação com Supabase
- `CartContext`: Gerencia carrinho de compras
- `ProductContext`: Gerencia produtos
- `SettingsContext`: Gerencia configurações

### Componentes Principais
- `LoginModal`: Modal de login/registro
- `ProtectedRoute`: Protege rotas que requerem autenticação
- `UserProfile`: Página de perfil do usuário
- `Header`: Header com navegação e autenticação

### Rotas
- `/`: Página inicial com produtos
- `/cart`: Carrinho de compras
- `/profile`: Perfil do usuário (protegida)

## Funcionalidades Técnicas

### Autenticação
- ✅ Login com email/senha
- ✅ Registro de novos usuários
- ✅ Recuperação de senha
- ✅ Proteção de rotas
- ✅ Logout
- ✅ Perfil de usuário com dados editáveis

### Segurança
- ✅ Row Level Security (RLS) no Supabase
- ✅ Políticas de acesso por usuário
- ✅ Validação de formulários
- ✅ Tratamento de erros

### UX/UI
- ✅ Interface responsiva
- ✅ Feedback visual para ações
- ✅ Loading states
- ✅ Mensagens de erro/sucesso
- ✅ Design moderno com Tailwind CSS

## Próximos Passos

1. **Implementar pedidos**: Conectar carrinho com sistema de pedidos
2. **Histórico de pedidos**: Página para ver pedidos anteriores
3. **Notificações**: Sistema de notificações para status de pedidos
4. **Pagamentos**: Integração com gateway de pagamento
5. **Admin Panel**: Painel administrativo para gerenciar pedidos

## Tecnologias Utilizadas

- **React 18** com TypeScript
- **Vite** para build e dev server
- **Supabase** para backend e autenticação
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Lucide React** para ícones 