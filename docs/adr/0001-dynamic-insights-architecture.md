# ADR 001: Transição de Conteúdo Estático para Gestão Dinâmica (Insights & Portfólio)

## Status
Proposed

## Contexto
A landing page da Camargo Gallo Engenharia utiliza atualmente dados estáticos (`.ts`) para as seções de Insights e Portfólio. Para permitir que usuários não técnicos gerenciem o conteúdo em produção sem a necessidade de deploys via GitHub Actions/FTP, é necessária a implementação de um sistema de gestão de conteúdo (CMS) interno.

A infraestrutura de hospedagem é a Locaweb (Shared Hosting / LAMP stack), que não suporta nativamente Astro SSR ou Serverless Functions, restringindo a arquitetura a soluções compatentes com PHP e MySQL.

## Decisões

### 1. Arquitetura de Backend
Implementaremos uma arquitetura híbrida utilizando **PHP e MySQL** para prover a camada de dados:
- **Banco de Dados**: Utilização de MySQL para persistência de posts de Insights, Cases de Portfólio e Usuários.
- **API**: Criação de endpoints em PHP que funcionam como uma API REST simplificada, retornando e recebendo dados em formato JSON.
- **Imagens**: Upload de imagens via PHP, com salvamento direto no diretório `/public/assets/uploads/` do servidor.

### 2. Interface de Administração (Admin Panel)
Será desenvolvido um painel administrativo dedicado:
- **Tecnologia**: Single Page Application (SPA) utilizando **Vue 3**.
- **Escopo**:
    - **Módulo de Insights**: CRUD completo de artigos (Título, Resumo, Conteúdo, Data, Categoria, Imagem de Destaque).
    - **Módulo de Portfólio**: CRUD completo de obras/cases (Título, Descrição, Imagem, Categoria, Data).
    - **Módulo de Usuários**: Gestão de acessos (Login, Cadastro e Edição de administradores/editores). Detalhado no ADR 002 (`0002-admin-users-module.md`).
- **UX**: Dashboard centralizado com tabelas de resultados e botões de inserção rápida para cada módulo.

### 3. Consumo no Front-end (Astro)
A renderização dos dados nos componentes de Insights e Portfólio transitará de estática para dinâmica:
- **Client-side Fetching**: Utilização de JavaScript/Vue para consumir a API PHP em tempo real.
- **Experiência**: Os dados serão injetados no DOM após o carregamento da página. Dado que o site é configurado como `noindex`, o impacto em SEO é considerado desprezível frente ao ganho de agilidade na gestão.

### 4. Estratégia de Segurança
Para garantir a integridade do servidor e dos dados na Locaweb:
- **Injeção SQL**: Uso obrigatório de **PDO com Prepared Statements** para todas as queries.
- **Autenticação**: Sistema de sessões PHP (`$_SESSION`) com senhas criptografadas via `password_hash()` (bcrypt).
- **Proteção de Uploads**: 
    - Validação rigorosa de extensões e MIME-types (via `finfo`).
    - Renomeação automática de arquivos para evitar colisões e execução de scripts.
- **Sanitização**: Uso de `htmlspecialchars()` em todas as saídas de dados para prevenir XSS.
- **Controle de Acesso**: Middleware PHP em cada endpoint da API para validar a sessão do usuário.

## Especificações Técnicas

### Estrutura de Diretórios (Servidor)
Para manter a organização e segurança, a estrutura no servidor seguirá:
- `/api/`: Scripts PHP de backend (Auth, CRUDs, Upload).
- `/admin/`: Build da SPA em Vue 3.
- `/public/assets/uploads/`: Armazenamento das imagens dinâmicas.

### Modelagem de Dados (MySQL)
As tabelas seguirão a seguinte estrutura básica:
- **`users`**: `id (PK)`, `username`, `password` (hashed), `email`, `role` (admin/editor), `created_at`.
- **`insights`**: `id (PK)`, `titulo`, `resumo`, `conteudo`, `data`, `categoria`, `imagem`, `user_id (FK)`.
- **`portfolio`**: `id (PK)`, `titulo`, `descricao`, `imagem`, `categoria`, `data_obra`, `status`, `user_id (FK)`.

### Fluxo de Autenticação
1. O Admin Vue envia credenciais para `api/auth/login.php`.
2. O PHP valida o hash da senha e inicia uma `$_SESSION` no servidor.
3. O navegador armazena o cookie `PHPSESSID`.
4. Todas as requisições subsequentes para a API são validadas via `session_start()` e verificação de `user_id`.

## Justificativa
Esta abordagem é a única viável que garante:
1. **Compatibilidade Total**: Funciona nativamente na infraestrutura atual da Locaweb.
2. **Custo Zero**: Não exige contratação de novos serviços de banco de dados ou servidores.
3. **Autonomia**: Permite a atualização de conteúdo em tempo real sem intervenção técnica ou novo build do projeto.

## Consequências
- **Dependência de PHP**: Introduz a necessidade de manutenção de scripts PHP ao lado da stack Astro/Vue.
- **SEO**: O conteúdo dos insights e portfólio deixa de ser indexável no HTML estático (aceitável devido ao `noindex` global).
- **Gestão de Credenciais**: Necessidade de configuração segura de variáveis de ambiente para o banco de dados no servidor.
