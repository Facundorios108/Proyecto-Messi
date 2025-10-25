# 📝 INSTRUCCIONES DE USO - Editor de Estadísticas Messi

## 🚀 Inicio Rápido

### 1. Iniciar el sistema
```bash
./start.sh
```

Esto abrirá automáticamente el **Editor Completo** en tu navegador.

---

## ✏️ Cómo Editar Estadísticas

### Opción 1: Editor Visual (RECOMENDADO)

1. **Ejecuta `./start.sh`** - Se abre el editor automáticamente
2. **Haz clic en las pestañas** para cambiar entre secciones:
   - 📊 Totales de Carrera
   - 🔴🔵 Barcelona
   - 🔴🔵 PSG
   - 🩷🖤 Inter Miami
   - 🇦🇷 Argentina

3. **Edita los números** que quieras cambiar
4. **Click en "Guardar"** 
5. **IMPORTANTE**: Haz clic en "Ver Página" y refresca con **Cmd+Shift+R** (Mac) o **Ctrl+Shift+R** (Windows/Linux)

### ✅ Los cambios se guardan automáticamente en:
- ✅ `js/messi-stats.json` (datos fuente)
- ✅ `professional_stats.html` (se actualiza al recargar)
- ✅ `index.html` (se actualiza al recargar)

---

## 🔄 Workflow Completo

```
1. Abrir Editor     → ./start.sh
2. Editar Datos     → Cambiar números en el formulario
3. Guardar          → Click en "💾 Guardar"
4. Ver Cambios      → Click en "🌐 Ver Página"
5. Refrescar        → Cmd+Shift+R en la página
```

---

## 🌐 URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Editor Completo** | http://localhost:9000/admin/editor.html | Editor visual con pestañas |
| **Página Principal** | http://localhost:9000/professional_stats.html | Página pública con stats |
| **Panel Simple** | http://localhost:9000/admin | Panel básico (solo totales) |
| **API de Datos** | http://localhost:9000/api/stats | JSON con todas las stats |

---

## 📱 Acceso desde Celular

1. En tu Mac, ejecuta:
```bash
ipconfig getifaddr en0
```

2. Obtén tu IP local (ejemplo: `192.168.0.243`)

3. En tu celular (conectado a la **misma WiFi**), abre:
```
http://TU_IP:9000/professional_stats.html
```

Ejemplo: `http://192.168.0.243:9000/professional_stats.html`

---

## 🛑 Detener el Sistema

```bash
./stop.sh
```

O presiona `Ctrl+C` en la terminal donde están corriendo los servidores.

---

## 🐛 Solución de Problemas

### ❌ "Los cambios no se ven en la página"

**Solución:**
1. Guarda los cambios en el editor
2. Ve a la página principal
3. Presiona **Cmd+Shift+R** (Mac) o **Ctrl+Shift+R** (Windows/Linux)
4. Si aún no se ven, cierra y vuelve a abrir la pestaña

### ❌ "Error al guardar"

**Solución:**
1. Verifica que los servidores estén corriendo
2. Ejecuta `./stop.sh` y luego `./start.sh`

### ❌ "La página carga pero sin datos"

**Solución:**
1. Abre las herramientas de desarrollador (F12)
2. Ve a la consola
3. Deberías ver: "✅ TODAS las estadísticas actualizadas desde la API"
4. Si ves errores, reinicia los servidores

---

## 📊 Estructura de Datos

Los datos se guardan en `js/messi-stats.json` con esta estructura:

```json
{
  "career_totals": {
    "matches": 1131,
    "goals": 890,
    "assists": 401,
    "titles": 47
  },
  "teams": {
    "barcelona": { "matches": 778, "goals": 672, ... },
    "psg": { "matches": 75, "goals": 32, ... },
    "inter_miami": { "matches": 83, "goals": 72, ... },
    "argentina": { "matches": 195, "goals": 114, ... }
  }
}
```

---

## ✨ Características del Sistema

✅ **Actualización en tiempo real** - Los cambios se reflejan inmediatamente  
✅ **Editor visual completo** - No necesitas tocar el JSON  
✅ **Persistencia automática** - Se guarda todo en archivos  
✅ **Acceso móvil** - Funciona desde cualquier dispositivo en tu red  
✅ **Cache inteligente** - Sistema optimizado de carga de datos  

---

## 📞 Soporte

Si algo no funciona:

1. Verifica que los servidores estén corriendo (`./start.sh`)
2. Revisa la consola del navegador (F12 → Console)
3. Reinicia el sistema (`./stop.sh` → `./start.sh`)
4. Limpia la cache del navegador (Cmd+Shift+R)

---

**Última actualización:** 24 de octubre de 2025
