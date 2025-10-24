#!/bin/bash

# 🚀 Instalador Automático - Sistema de Estadísticas de Messi
# Este script configura todo lo necesario para actualizaciones automáticas

echo "🐐 =================================="
echo "🚀 MESSI STATS AUTO-UPDATER SETUP"  
echo "🐐 =================================="
echo ""

# Verificar Python
echo "🔍 Verificando Python..."
if command -v python3 &> /dev/null; then
    python_version=$(python3 --version)
    echo "✅ $python_version encontrado"
else
    echo "❌ Python 3 no está instalado"
    echo "💡 Instala Python 3 desde https://python.org"
    exit 1
fi

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias de Python..."
if pip3 install -r requirements.txt; then
    echo "✅ Dependencias instaladas correctamente"
else
    echo "⚠️  Error al instalar dependencias, continuando..."
fi

# Verificar archivos necesarios
echo ""
echo "📁 Verificando archivos del proyecto..."
required_files=(
    "update_stats.py"
    "proxy_server.py" 
    "js/messi-stats.json"
    "js/messi-stats.js"
    "js/messi-api-updater.js"
)

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file"
    else
        echo "❌ $file (faltante)"
    fi
done

# Hacer scripts ejecutables
chmod +x update_stats.py
chmod +x proxy_server.py

echo ""
echo "🎯 =================================="
echo "🎉 ¡CONFIGURACIÓN COMPLETADA!"
echo "🎯 =================================="
echo ""

# Instrucciones de uso
cat << 'EOF'
📋 CÓMO USAR EL SISTEMA:

🟢 MODO AUTOMÁTICO (Recomendado):
   1️⃣  Abre una nueva terminal
   2️⃣  Ejecuta: python3 proxy_server.py
   3️⃣  Ve a http://localhost:8888 para verificar
   4️⃣  Abre tu proyecto web normalmente
   5️⃣  ¡Las estadísticas se actualizarán solas cada 30 minutos! 🎉

🟡 MODO MANUAL:
   • Para actualizar una vez: python3 update_stats.py once
   • Para auto-actualización: python3 update_stats.py auto 30

🔧 COMANDOS ÚTILES:
   • Ver estado del proxy: curl http://localhost:8888/api/stats
   • Forzar actualización: curl http://localhost:8888/api/update
   • En el navegador (F12 consola): window.checkMessiUpdates()

📊 CARACTERÍSTICAS:
   ✅ Actualización automática desde messi.com
   ✅ Sin edición manual de código HTML
   ✅ Notificaciones visuales de cambios
   ✅ Respaldo automático de datos
   ✅ Funciona completamente offline después de actualizar

🎯 PRÓXIMOS PASOS:
   1. Ejecuta: python3 proxy_server.py
   2. Abre index.html en tu navegador
   3. ¡Ya está funcionando automáticamente!

💡 Tip: Mantén la terminal del proxy abierta mientras uses el proyecto
EOF

echo ""
echo "🚀 ¿Quieres iniciar el servidor automáticamente? (y/n)"
read -r response
if [[ $response =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Iniciando servidor proxy..."
    echo "🌐 Ve a http://localhost:8888 para verificar el estado"
    echo "🛑 Presiona Ctrl+C para detener"
    echo ""
    python3 proxy_server.py
fi