#!/bin/bash
# Script rápido para actualizar estadísticas de Messi

echo "🔄 ACTUALIZADOR RÁPIDO DE ESTADÍSTICAS DE MESSI"
echo "================================================"
echo ""

# Función para actualizar un valor
update_stat() {
    local key=$1
    local prompt=$2
    local current=$3
    
    echo -n "$prompt (actual: $current): "
    read value
    
    if [ -z "$value" ]; then
        echo "$current"
    else
        echo "$value"
    fi
}

# Leer valores actuales
echo "📊 Valores actuales:"
cat js/messi-stats.json | jq '.career_totals'
echo ""

# Pedir nuevos valores
echo "✏️  Ingresa los nuevos valores (Enter para mantener el actual):"
echo ""

matches=$(update_stat "matches" "Partidos" "1130")
goals=$(update_stat "goals" "Goles" "889")
assists=$(update_stat "assists" "Asistencias" "401")
titles=$(update_stat "titles" "Títulos" "46")

# Confirmar
echo ""
echo "📝 NUEVOS VALORES:"
echo "  Partidos: $matches"
echo "  Goles: $goals"
echo "  Asistencias: $assists"
echo "  Títulos: $titles"
echo ""
echo -n "¿Confirmar actualización? (s/n): "
read confirm

if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
    # Crear backup
    cp js/messi-stats.json js/messi-stats.json.backup
    
    # Actualizar JSON usando jq
    cat js/messi-stats.json | jq \
        --arg matches "$matches" \
        --arg goals "$goals" \
        --arg assists "$assists" \
        --arg titles "$titles" \
        --arg date "$(date +%Y-%m-%d)" \
        '.career_totals.matches = ($matches | tonumber) |
         .career_totals.goals = ($goals | tonumber) |
         .career_totals.assists = ($assists | tonumber) |
         .career_totals.titles = ($titles | tonumber) |
         .last_updated = $date |
         .source = "manual"' > js/messi-stats.json.tmp
    
    mv js/messi-stats.json.tmp js/messi-stats.json
    
    echo ""
    echo "✅ ¡Estadísticas actualizadas!"
    echo "📁 Backup guardado en: js/messi-stats.json.backup"
    echo ""
    
    # Actualizar HTML principal
    echo "🔄 Actualizando archivos HTML..."
    
    # Actualizar professional_stats.html
    sed -i.bak "s/<div class=\"stat-number\" id=\"matches\">[0-9]*<\/div>/<div class=\"stat-number\" id=\"matches\">$matches<\/div>/g" professional_stats.html
    sed -i.bak "s/<div class=\"stat-number\" id=\"goals\">[0-9]*<\/div>/<div class=\"stat-number\" id=\"goals\">$goals<\/div>/g" professional_stats.html
    sed -i.bak "s/<div class=\"stat-number\" id=\"assists\">[0-9]*<\/div>/<div class=\"stat-number\" id=\"assists\">$assists<\/div>/g" professional_stats.html
    sed -i.bak "s/<div class=\"stat-number\" id=\"titles\">[0-9]*<\/div>/<div class=\"stat-number\" id=\"titles\">$titles<\/div>/g" professional_stats.html
    
    # Actualizar index.html
    sed -i.bak "s/Partidos: <span class=\"badge\">[0-9]*<\/span>/Partidos: <span class=\"badge\">$matches<\/span>/g" index.html
    sed -i.bak "s/Goles: <span class=\"badge\">[0-9]*<\/span>/Goles: <span class=\"badge\">$goals<\/span>/g" index.html
    sed -i.bak "s/Asistencias: <span class=\"badge\">[0-9]*<\/span>/Asistencias: <span class=\"badge\">$assists<\/span>/g" index.html
    sed -i.bak "s/Títulos: <span class=\"badge\">[0-9]*<\/span>/Títulos: <span class=\"badge\">$titles<\/span>/g" index.html
    
    # Limpiar archivos backup de sed
    rm -f professional_stats.html.bak index.html.bak
    
    echo "✅ HTML actualizado"
    echo ""
    
    # Reiniciar servidor si está corriendo
    if pgrep -f "proxy_server.py" > /dev/null; then
        echo "🔄 Reiniciando servidor..."
        pkill -f proxy_server.py
        sleep 1
        python3 proxy_server.py &
        echo "✅ Servidor reiniciado"
    fi
    
    echo ""
    echo "🎉 ¡TODO LISTO!"
    echo "📄 Abre professional_stats.html para ver los cambios"
    echo ""
    
else
    echo "❌ Actualización cancelada"
fi
