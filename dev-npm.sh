#!/bin/bash

echo "📦 Instalando dependências (server)..."
(cd server && npm install)

echo "📦 Instalando dependências (web)..."
(cd web && npm install)

echo "🚀 Iniciando projetos com npm..."

trap "kill 0" EXIT

(cd server && npm run dev) &
(cd web && npm run dev) &

wait
