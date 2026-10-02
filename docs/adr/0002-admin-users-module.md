# ADR 002: Gestão de Usuários do Painel Admin

## Status
Proposed

## Contexto
O ADR 001 (`0001-dynamic-insights-architecture.md`) previu um "Módulo de Usuários" no painel admin, mas apenas como escopo de alto nível ("Gestão de acessos: Login, Cadastro e Edição de administradores/editores"). Faltavam as decisões de schema, permissões, API e UI. Este ADR detalha o módulo de usuários para que a implementação siga um contrato claro.

A autenticação já existe (`api/auth/login.php`, `check_session.php`, `logout.php`) e a tabela `users` já está criada (`database.sql:13-23`). O objetivo agora é: migrar o login para **e-mail**, adicionar **nome** e **telefone**, e definir o comportamento de listagem/edição/exclusão por perfil.

## Decisões

### 1. Autenticação por e-mail
- O login passa a validar **`email` + `password`** (em vez de `username`).
- A coluna `email` já é `NOT NULL UNIQUE` (`database.sql:17`), então o admin atual **já possui um e-mail gravado**. A migration deve garantir que esse e-mail seja válido antes de virar o identificador de login.
- O campo `username` deixa de ser o identificador de login. Decisão: **substituído pelo e-mail** (a coluna pode ser mantida no banco por compatibilidade com registros antigos, mas não é mais usada nem populada).

### 2. Schema da tabela `users`
- Adicionar colunas:
  - `nome` `varchar(120)` — nome completo (exibido na tabela e usado como identificação amigável).
  - `telefone` `varchar(20)` — telefone de contato.
- Manter: `id`, `password` (hash bcrypt), `email` (único, agora é o login), `role` `enum('admin','editor')` DEFAULT `'editor'`, `created_at`.
- As FKs `user_id` de `insights` e `portfolio` (`database.sql:44,66`) permanecem inalteradas.
- Migration: novo arquivo `migrate-users-nome-telefone.sql` (ALTER TABLE + backfill do e-mail do admin atual, se necessário).
- Migration de correção: `migrate-users-username-nullable.sql` — torna `username` nullable e remove a constraint UNIQUE (o campo foi descontinuado em favor do `email`; sem isso, inserts falham com `Duplicate entry '' for key 'username'`).

### 3. API `api/users/` (nova)
Endpoints com checagem de sessão e de perfil no servidor (nunca confiar só no front):

| Endpoint | Método | Quem pode | Observação |
|---|---|---|---|
| `api/users/list.php` | GET | Admin e Editor | Retorna todos os usuários (sem o hash da senha). |
| `api/users/insert.php` | POST | **Somente Admin** | Cria usuário. Editor → 403. |
| `api/users/update.php` | PUT/POST | Admin (qualquer um) / **Editor (somente a própria linha)** | Editor não pode alterar `role`. |
| `api/users/delete.php` | DELETE/POST | **Somente Admin** | Bloqueia excluir a própria conta e excluir o último Admin. |

- Respostas em JSON; erros com HTTP adequado (400 validação, 401 não autenticado, 403 sem permissão, 404 não encontrado, 500 servidor).
- Todas as queries com PDO prepared statements (conforme ADR 001).

### 4. Interface Admin (`/admin/users`)
- Rota no router com `meta: { requiresAuth: true }` (visível para Admin e Editor).
- **Tabela** com colunas: Nome, E-mail, Telefone, Role (badge), Criado em, Ações.
- **Botão "+ Novo Usuário"** no cabeçalho, ao lado do título — visível e habilitado **somente para Admin** (Editor não vê).
- **Coluna Ações** (Editar / Excluir):
  - **Admin**: habilitado em todas as linhas.
  - **Editor**: habilitado **somente na própria linha**; nas demais, botões **desabilitados**. Editor não exclui ninguém.
- **Modal** de criação/edição:
  - Campos: nome completo, e-mail, telefone, senha (definida no cadastro), role (Admin/Editor).
  - Role: default **Editor**; a escolha de role só aparece para Admin.
  - Na edição pelo Editor (própria linha): sem campo de role.

### 5. Regras de proteção
- Editor **não altera `role`** de ninguém (inclusive o próprio).
- Não permitir **excluir a conta logada**.
- Não permitir **excluir o último Admin** (evita lockout total do painel).
- E-mail único; senha com tamanho mínimo; telefone em formato válido.
- A modal deve exibir erros da API (ex.: e-mail já cadastrado).

## Especificações Técnicas

### Payloads
- `insert.php` (Admin): `{ "nome", "email", "telefone", "password", "role" }` → `201 { "id" }`.
- `update.php`: `{ "id", "nome", "email", "telefone", "password" (opcional), "role" (só Admin) }` → `200 { "success": true }`.
- `delete.php`: `{ "id" }` → `200 { "success": true }`.
- `list.php`: → `200 [ { "id", "nome", "email", "telefone", "role", "created_at" }, ... ]` (sem `password`).

### Validações
- `email`: formato válido e único.
- `nome`: obrigatório, 3–120 caracteres.
- `telefone`: opcional, formato brasileiro (ex.: `(11) 99999-9999`).
- `password`: obrigatória no cadastro; mínimo 8 caracteres; opcional na edição (só altera se enviada).
- `role`: `admin` ou `editor`; default `editor`.

### Comportamento da UI
- Estado vazio: "Nenhum usuário encontrado." (mesmo padrão de Insights/Portfólio).
- Loading na tabela durante o fetch.
- Feedback de erro/sucesso via toast ou alert (padrão já usado no admin).

## Consequências
- **Migration SQL necessária** (`migrate-users-nome-telefone.sql`) + ajuste do `api/auth/login.php` para aceitar `email`.
- **ADR 001** deve ser atualizado para apontar este ADR como detalhamento do "Módulo de Usuários".
- Novo módulo `api/users/` e nova view `UsersManager.js` no admin para manter.
- O `username` deixa de ser usado no login; registros antigos permanecem no banco.
