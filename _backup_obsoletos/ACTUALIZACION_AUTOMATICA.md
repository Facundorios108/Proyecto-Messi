# 📊 SISTEMA DE ACTUALIZACIÓN AUTOMÁTICA - PROYECTO MESSI

## 🎯 ¿CÓMO FUNCIONA LA ACTUALIZACIÓN?

Actualmente tienes **3 opciones** para actualizar las estadísticas:

---

## ✅ OPCIÓN 1: ACTUALIZACIÓN MANUAL (RECOMENDADA ACTUALMENTE)

### Cuando necesites actualizar:
```bash
# Ejecutar el script de actualización una vez
python3 auto_update_messi.py once
```

### ¿Cuándo usarlo?
- Después de un partido de Messi
- Cuando veas que messi.com tiene números nuevos
- Cada vez que quieras verificar cambios

---

## 🔄 OPCIÓN 2: ACTUALIZACIÓN AUTOMÁTICA CADA X HORAS

### Iniciar monitor automático (cada 6 horas):
```bash
python3 auto_update_messi.py continuous 6
```

### Personalizar el intervalo:
```bash
# Cada 12 horas
python3 auto_update_messi.py continuous 12

# Cada 3 horas
python3 auto_update_messi.py continuous 3

# Cada 24 horas (1 vez al día)
python3 auto_update_messi.py continuous 24
```

### ⚠️ IMPORTANTE:
- Deja la terminal abierta mientras el monitor esté corriendo
- Presiona `Ctrl+C` para detener el monitor
- El script verificará messi.com automáticamente en los intervalos configurados

---

## 🤖 OPCIÓN 3: ACTUALIZACIÓN CON CRON (macOS/Linux)

### Para que se ejecute automáticamente sin que tengas que hacer nada:

1. **Abrir configuración de cron:**
   ```bash
   crontab -e
   ```

2. **Agregar estas líneas** (actualiza cada 6 horas):
   ```bash
   # Actualizar estadísticas de Messi cada 6 horas
   0 */6 * * * cd /Users/facundorios/Documents/Facundo/Programacion/Proyectos/Proyecto\ Messi && /usr/bin/python3 auto_update_messi.py once >> logs/auto_update.log 2>&1
   ```

3. **Guardar y salir:**
   - En `nano`: presiona `Ctrl+X`, luego `Y`, luego `Enter`
   - En `vim`: presiona `Esc`, escribe `:wq`, presiona `Enter`

### Crear carpeta de logs:
```bash
mkdir -p logs
```

### Ver el log de actualizaciones:
```bash
tail -f logs/auto_update.log
```

---

## 📝 ACTUALIZACIÓN MANUAL DIRECTA DEL JSON

Si necesitas actualizar manualmente y sabes los números exactos:

```bash
# Edita el archivo:
nano js/messi-stats.json

# O usa VS Code:
code js/messi-stats.json
```

Luego actualiza los números en la sección `career_totals`:
```json
{
  "career_totals": {
    "matches": 1130,
    "goals": 889,
    "assists": 401,
    "titles": 46
  }
}
```

---

## 🔍 VERIFICAR ESTADO ACTUAL

### Ver estadísticas actuales:
```bash
cat js/messi-stats.json | jq '.career_totals'
```

### Verificar servidor API:
```bash
curl -s http://localhost:8888/api/stats | jq '.career_totals'
```

---

## ⚡ REINICIAR SERVIDOR CON NUEVOS DATOS

Después de actualizar el JSON, reinicia el servidor:

```bash
# 1. Matar proceso anterior
pkill -f proxy_server.py

# 2. Iniciar servidor nuevo
python3 proxy_server.py &
```

---

## 🎮 COMANDOS RÁPIDOS

### Actualización completa (datos + servidor):
```bash
# 1. Actualizar datos
python3 auto_update_messi.py once

# 2. Reiniciar servidor
pkill -f proxy_server.py && python3 proxy_server.py &

# 3. Abrir página actualizada
open professional_stats.html
```

---

## 📊 FLUJO RECOMENDADO

### Cuando Messi juega:
1. **Espera 1-2 horas** después del partido (para que messi.com actualice)
2. **Ejecuta:** `python3 auto_update_messi.py once`
3. **Recarga** la página en el navegador (`Cmd+Shift+R` para forzar)

### Para actualización diaria automática:
- **Usa cron** para que se ejecute 1 vez al día a las 8 AM:
  ```bash
  0 8 * * * cd /Users/facundorios/Documents/Facundo/Programacion/Proyectos/Proyecto\ Messi && /usr/bin/python3 auto_update_messi.py once
  ```

---

## 🚨 LIMITACIÓN ACTUAL

**Messi.com bloquea acceso automático (Error 403)**

Por eso el script usa un "fallback" con los últimos datos conocidos. Para solucionar esto puedes:

1. **Actualizar manualmente** cuando veas cambios en messi.com
2. **Usar una API de terceros** (si encuentras una)
3. **Implementar un scraper más sofisticado** con proxies/headless browser

---

## 💡 PRÓXIMOS PASOS SUGERIDOS

1. ✅ **Crear tarea cron** para actualización diaria
2. ⚡ **Configurar notificaciones** (email/Telegram) cuando haya cambios
3. 🔍 **Explorar APIs alternativas** para obtener datos de Messi
4. 🌐 **Agregar webhook** para actualizar desde Postman/otros servicios

---

## 📞 SOPORTE

Si tienes dudas:
- Revisa el archivo `README.md`
- Ejecuta `python3 auto_update_messi.py` para ver opciones
- Los logs están en `logs/auto_update.log`
