# 🚀 Projeto Fullstack (Web + Server)

Este projeto é composto por duas aplicações:

- `./server` → API (Hono + TypeScript)
- `./web` → Frontend (React + Vite + TypeScript)

Você pode iniciar tudo automaticamente via scripts `.sh` ou manualmente.

---

# 📦 Pré-requisitos

É necessário ter instalado em sua máquina:

- Node.js (versão LTS recomendada)
- npm ou pnpm

> Recomendação: utilize **pnpm** (foi o gerenciador utilizado no desenvolvimento).

Caso não possua pnpm instalado:
https://pnpm.io/installation

---
# 📦 Envs

Você deve criar um arquivo `.env` em cada diretorio (server e web).

As variáveis de ambiente devem ser exatamente as mesmas definidas no arquivo `.env.example`.

Basta copiar o `.env.example`, renomear para `.env` e ajustar os valores se necessário.


# ⚡ Execução Automática (Recomendado)

No diretório raiz do projeto, execute:

## ▶️ Sem banco populado

sh dev-npm.sh  
ou  
sh dev-pnpm.sh  

## 🌱 Com banco populado (seed)

sh dev-npm-seed.sh  
ou  
sh dev-pnpm-seed.sh  

Esses scripts irão:

- Instalar as dependências
- Iniciar o servidor
- Iniciar o frontend

---

# 🛠 Execução Manual

Caso prefira iniciar manualmente:

---

## 🔧 Iniciar o Server

1. Acesse a pasta:

cd server

2. Instale as dependências:

npm install  
ou  
pnpm install  

3. Execute o projeto:

npm run dev  
ou  
pnpm run dev  

### 🌱 Para rodar com seed:

npm run dev:seed  
ou  
pnpm run dev:seed  

---

## 🌐 Iniciar o Web

1. Acesse a pasta:

cd web

2. Instale as dependências:

npm install  
ou  
pnpm install  

3. Execute o projeto:

npm run dev  
ou  
pnpm run dev  

---

# ⚡ Execução de Testes do server (Necessário instalar as bibliotecas)

No diretório do server execute o comando `pnpm run test`

# 🧩 Tecnologias Utilizadas

## Frontend
- React 19
- Vite
- TypeScript
- TanStack Query
- TanStack Table
- React Hook Form
- Zod
- TailwindCSS
- Radix UI
- Axios

## Backend
- Hono
- TypeScript
- JWT
- Bcrypt
- Zod
