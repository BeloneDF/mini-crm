#!/bin/bash

echo "📦 Instalando dependências (server)..."
(cd server && pnpm install)

echo "📦 Instalando dependências (web)..."
(cd web && pnpm install)

echo "🚀 Iniciando projetos com pnpm..."

trap "kill 0" EXIT

(cd server && pnpm run dev) &
(cd web && pnpm run dev) &

wait
