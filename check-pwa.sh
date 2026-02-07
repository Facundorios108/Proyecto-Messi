#!/bin/bash

# 🚀 Script de Verificación Pre-Deploy para Netlify
# Verifica que todos los archivos necesarios estén listos

echo "🔍 Verificando PWA de Messi Stats..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
PASS=0
FAIL=0
WARN=0

# Función para verificar archivos
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        ((PASS++))
        return 0
    else
        echo -e "${RED}❌${NC} $1 - FALTA"
        ((FAIL++))
        return 1
    fi
}

# Función para verificar archivos opcionales
check_optional() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠️${NC}  $1 - OPCIONAL (no crítico)"
        ((WARN++))
    fi
}

echo "📱 === ARCHIVOS PRINCIPALES PWA ==="
check_file "manifest.json"
check_file "service-worker.js"
check_file "index.html"
check_file "netlify.toml"
echo ""

echo "🖼️  === ICONOS PWA (8 necesarios) ==="
check_file "images/icon-72x72.png"
check_file "images/icon-96x96.png"
check_file "images/icon-128x128.png"
check_file "images/icon-144x144.png"
check_file "images/icon-152x152.png"
check_file "images/icon-192x192.png"
check_file "images/icon-384x384.png"
check_file "images/icon-512x512.png"
echo ""

echo "📄 === PÁGINAS PRINCIPALES ==="
check_optional "pages/messi_page.html"
check_optional "pages/messi_page2.html"
check_optional "pages/messi_page3.html"
check_optional "pages/messi_page4.html"
echo ""

echo "🎨 === RECURSOS ==="
check_optional "css/styles.css"
check_optional "js/messi-stats.json"
check_optional "chatbot_engine_improved.js"
echo ""

echo "🛠️  === ARCHIVOS AUXILIARES ==="
check_optional "images/EscudoBar.png"
check_optional "images/EscudoPSG.png"
check_optional "images/EscudoInt.png"
check_optional "images/EscudoAFA.png"
echo ""

# Verificar sintaxis de JSON
echo "🔍 === VALIDACIÓN DE JSON ==="
if command -v python3 &> /dev/null; then
    if python3 -m json.tool manifest.json > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} manifest.json - Sintaxis válida"
        ((PASS++))
    else
        echo -e "${RED}❌${NC} manifest.json - Error de sintaxis"
        ((FAIL++))
    fi
    
    if [ -f "js/messi-stats.json" ]; then
        if python3 -m json.tool js/messi-stats.json > /dev/null 2>&1; then
            echo -e "${GREEN}✅${NC} messi-stats.json - Sintaxis válida"
            ((PASS++))
        else
            echo -e "${YELLOW}⚠️${NC}  messi-stats.json - Error de sintaxis (no crítico)"
            ((WARN++))
        fi
    fi
else
    echo -e "${YELLOW}⚠️${NC}  Python3 no disponible - omitiendo validación JSON"
fi
echo ""

# Verificar tamaño de iconos
echo "📐 === VERIFICACIÓN DE TAMAÑOS ==="
if command -v file &> /dev/null; then
    for size in 72 96 128 144 152 192 384 512; do
        icon="images/icon-${size}x${size}.png"
        if [ -f "$icon" ]; then
            filesize=$(ls -lh "$icon" | awk '{print $5}')
            echo -e "${BLUE}ℹ️${NC}  icon-${size}x${size}.png - Tamaño: $filesize"
        fi
    done
fi
echo ""

# Resumen
echo "════════════════════════════════════════"
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "════════════════════════════════════════"
echo -e "${GREEN}✅ Pasadas:${NC}      $PASS"
echo -e "${RED}❌ Fallidas:${NC}     $FAIL"
echo -e "${YELLOW}⚠️  Advertencias:${NC} $WARN"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡TODO LISTO PARA SUBIR A NETLIFY!${NC}"
    echo ""
    echo "🚀 Próximos pasos:"
    echo "   1. Ve a https://app.netlify.com/drop"
    echo "   2. Arrastra toda la carpeta del proyecto"
    echo "   3. ¡Tu PWA estará en línea en segundos!"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  HAY ERRORES QUE CORREGIR${NC}"
    echo ""
    echo "Por favor, verifica los archivos marcados como ❌"
    echo ""
    exit 1
fi
