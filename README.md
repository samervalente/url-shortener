# URL Shortener Service

[![CI](https://github.com/samervalente/url-shortener/actions/workflows/ci.yml/badge.svg)](https://github.com/samervalente/url-shortener/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Plataforma escalável para encurtamento de URLs, construída com NX e NestJS, e operando em ambiente Kubernetes. Além de reduzir links, o sistema também oferece recursos de autenticação e gerenciamento de usuários.

## Acesse a API na nuvem

1. IAM: acesse em [IAM API](http://104.155.158.165:3003/api)

1. URL Shortener: acesse em [IAM API](http://34.71.71.218:3006/api)

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Rodando local com Docker Compose](#rodando-local-com-docker-compose)
- [Rodando local com Kubernetes](#rodando-local-com-kubernetes)
- [Testes](#testes)
- [Escalando a aplicação horizontalmente](#escalando-a-aplicacao-horizontalmente)

## Funcionalidades

- Encurtamento de URLs com suporte a códigos personalizados
- Autenticação e autorização de usuários
- Kubernetes deploy
- Documentação da API disponível via Swagger
- Health check

## Tecnologias e estratégias utilizadas

- **Backend Framework**: NestJS
- **Banco de dados**: PostgreSQL com PrismaORM
- **Autenticação**: Passport JWT, Passport Local, Auth Guards
- **Containerização**: Docker
- **Orquestração de containers**: Kubernetes
- **Documentação da API**: OpenAPI/Swagger
- **Testes**: Jest
- **Escalabilidade**: Dockerização, artefatos kubernetes, load balancer, HPA
- **Deploy**: Google Cloud Plataform e Kubernetes Engine para criação de clusters

## Arquitetura

### Componentes do sistema

- Serviço de IAM: Responsável pela autenticação de usuários e gerenciamento de contas
- Serviço de Encurtamento de URL: Cuida da criação e redirecionamento de links curtos, bem como as operações autenticadas pelo usuário como busca, edição e exclusão
- API Gateway: Faz o roteamento e protege as requisições recebidas
- Banco de Dados PostgreSQL: Armazena informações de usuários e URLs

### Fluxo de Dados

1. As requisições chegam através do API Gateway (KrakenD)
2. A autenticação é realizada pelo serviço de IAM
3. As operações relacionadas a URLs são tratadas pelo serviço de encurtamento
4. Os dados são armazenados nos bancos PostgreSQL

## Pré-requisitos

### Ferramentas necessárias

- Node.js (recomendada a versão >= v20)
- npm
- Docker
- Kubectl

## Rodando local com Docker Compose

Execute a aplicação na sua máquina de desenvolvimento

### Steps

1. Clone o repositório

```bash
git clone https://github.com/samervalente/url-shortener.git
cd url-shortener
```

2. Copie o arquivo `.env.example` para `.env`

```bash
cp .env.example .env
```

3. Suba a aplicação e inicie todos os serviços

```bash
docker-compose up --build
```

4. Os seguintes serviços vão estar disponíveis em:

- API Gateway: <http://localhost:8080/api>
- IAM: <http://localhost:3003/api>
- URL Shortener: <http://localhost:3006/api>

5. Importe a coleção do postman

   - Abra o Postman
   - Clique no botão "Importar"
   - Selecione o arquivo `postman.json` que está na raiz do projeto

Observação: A coleção está configurada para definir automaticamente a variável `accessToken` após a execução das requisições correspondentes.

## Rodando local com Kubernetes

1. Inicie o ambiente de desenvolvimento

```bash
npm run k8s:apply
```

2. Os seguintes serviços vão estar disponíveis em:

- IAM: <http://localhost:3003/api>
- URL Shortener: <http://localhost:3006/api>

## Testes

### Testes unitários

Execute os testes com o comando:

```bash
npm run test
```

## Escalando a aplicação horizontalmente

Embora a GCP já forneça recursos como monitoramento, observabilidade, dashboards e a aplicação possui uma arquitetura de microserviços, podemos implementar estratégias adicionais para escalar nossa aplicação horizontalmente. Algumas ações-chave incluem:

- Otimizar a escalabilidade automática com HPA (Horizontal Pod Autoscaling).

- Utilizar StatefulSets e Persistent Volumes para gerenciar estado e dados persistentes.

- Coletar métricas de performance com Prometheus e Grafana.

- Integrar OpenTelemetry para rastrear a performance e a distribuição das requisições entre os microserviços.

- Usar Jaeger e Elasticsearch para rastreamento distribuído e agregação de logs.
