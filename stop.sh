#!/bin/bash

# 🛑 Script para detener el Proyecto Messi

echo "🛑 Deteniendo Proyecto Messi..."
echo ""

# Detener los servidores
pkill -f proxy_server.py
pkill -f admin_server.py

# Esperar un momento
sleep 2

# Verificar que se hayan detenido
if lsof -Pi :8888 -sTCP:LISTEN -t >/dev/null 2>&1 || lsof -Pi :9000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Algunos servidores aún están corriendo. Forzando cierre..."
    pkill -9 -f proxy_server.py
    pkill -9 -f admin_server.py
    sleep 1
fi

echo "✅ Servidores detenidos correctamente"
echo ""
