#!/bin/bash

# 🚀 Script para iniciar el Proyecto Messi

echo "🚀 Iniciando Proyecto Messi..."
echo ""

# Ir al directorio del proyecto
cd "$(dirname "$0")"

# Verificar si los servidores ya están corriendo
if lsof -Pi :8888 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  El servidor proxy ya está corriendo en el puerto 8888"
else
    echo "✅ Iniciando proxy_server.py (puerto 8888)..."
    python3 proxy_server.py &
fi

if lsof -Pi :9000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  El servidor admin ya está corriendo en el puerto 9000"
else
    echo "✅ Iniciando admin_server.py (puerto 9000)..."
    python3 admin_server.py &
fi

# Esperar a que los servidores inicien
echo ""
echo "⏳ Esperando que los servidores inicien..."
sleep 3

# Verificar que los servidores estén corriendo
echo ""
if lsof -Pi :8888 -sTCP:LISTEN -t >/dev/null 2>&1 && lsof -Pi :9000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Servidores iniciados correctamente"
    echo ""
    echo "⚙️  Panel de Admin: http://localhost:9000/admin"
    echo "📊 Página Principal: http://localhost:9000/professional_stats.html"
    echo "📈 API Stats: http://localhost:8888/api/stats"
    echo ""
    echo "🌐 Abriendo panel de administración..."
    sleep 1
    open http://localhost:9000/admin
else
    echo "❌ Error: Los servidores no se iniciaron correctamente"
    exit 1
fi
