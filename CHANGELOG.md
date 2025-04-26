# Changelog

Todas as alterações importantes neste projeto serão documentadas neste arquivo.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),  
e este projeto segue a [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [0.4.0] - 2025-04-26

### Adicionado

- Ranking das URLs mais acessadas

## [0.3.0] - 2025-04-26

### Adicionado

- KrankenD para API Gateway
- Construção de docker compose
- Health check das apis de IAM e encurtador
- Artefatos do kubernetes para deploy

### Alterado

- Refatoração do http exception filter
- Correções de
- Construção de docker compose

## [0.2.0] - 2025-04-23

### Adicionado

- Cadastro e login de usuários com autenticação via JWT
- RBAC com criação de auth guard e roles guard
- Short URL com usuário autenticado
- Busca, edição e exclusão de URLs encurtadas
- Audit middleware para registro de logs
- Testes automatizados
  - Domínio de autenticação
  - Domínio de URLS
  - Domínio de usuários

### Alterado

- Melhoria no http exception filter para capturar erros do prisma
- Melhoria na documentação do swagger

## [0.1.0] - 2025-04-23

### Adicionado

- Primeira versão da API.
- Hooks de commit-msg, pré-commit e pré-push
- Endpoint para encurtar URLs
- Endpoint público para redirecionamento
- Github actions workflow

---
