# 🤖 Guía de Configuración del Bot de Messi

## 📋 Problema Resuelto

Antes el bot respondía con toda la información sin importar la pregunta específica. Ahora tiene datos estructurados para responder preguntas concretas.

## 🔧 Nuevo Endpoint para el Bot

### URL del Endpoint
```
http://localhost:8888/api/bot-data
```

### Cómo Usar

El bot debe consumir este endpoint en lugar de `/api/stats` para obtener respuestas estructuradas.

## 📝 Estructura de Respuestas

### 1. Respuestas Rápidas (`quick_answers`)
Para preguntas directas:
- **"¿Cuántos goles has marcado?"** → `quick_answers.total_goals`
- **"¿Cuántos partidos jugaste?"** → `quick_answers.total_matches`
- **"¿Cuántos títulos ganaste?"** → `quick_answers.total_titles`
- **"¿En qué equipo juegas?"** → `quick_answers.current_team`

### 2. Preguntas por Equipo (`career_summary.by_team`)
- **"¿Cuántos goles marcaste en el Barcelona?"** → `career_summary.by_team.barcelona.goals`
- **"¿Cuántos títulos ganaste en Inter Miami?"** → `career_summary.by_team.inter_miami.titles`

### 3. Detalles de Títulos (`titles_detail`)
- **"¿Cuántas Champions ganaste?"** → `titles_detail.by_competition.champions_league.answer`
- **"¿Cuántas Copas América ganaste?"** → `titles_detail.by_competition.copa_america.answer`
- **"¿Ganaste el Mundial?"** → `titles_detail.by_competition.copa_mundial.answer`

### 4. Premios Individuales (`individual_awards`)
- **"¿Cuántos Balones de Oro tienes?"** → `individual_awards.balon_oro.answer`
- **"¿Cuántas Botas de Oro ganaste?"** → `individual_awards.bota_oro.answer`

## 🎯 Ejemplo de Implementación

### Configuración del Bot (pseudo-código)

```python
import requests

# Obtener datos del bot
bot_data = requests.get('http://localhost:8888/api/bot-data').json()

# Función para responder preguntas
def responder_pregunta(pregunta):
    pregunta_lower = pregunta.lower()
    
    # Detectar tipo de pregunta
    if 'cuántos goles' in pregunta_lower or 'cuantos goles' in pregunta_lower:
        if 'barcelona' in pregunta_lower:
            return bot_data['career_summary']['by_team']['barcelona']['summary']
        elif 'inter miami' in pregunta_lower:
            return bot_data['career_summary']['by_team']['inter_miami']['summary']
        else:
            return bot_data['quick_answers']['total_goals']
    
    elif 'cuántos títulos' in pregunta_lower or 'cuantos titulos' in pregunta_lower:
        if 'carrera' in pregunta_lower or 'total' in pregunta_lower:
            return bot_data['quick_answers']['total_titles']
        elif 'champions' in pregunta_lower:
            return bot_data['titles_detail']['by_competition']['champions_league']['answer']
        elif 'copa américa' in pregunta_lower or 'copa america' in pregunta_lower:
            return bot_data['titles_detail']['by_competition']['copa_america']['answer']
    
    elif 'balón de oro' in pregunta_lower or 'balon de oro' in pregunta_lower:
        return bot_data['individual_awards']['balon_oro']['answer']
    
    elif 'mundial' in pregunta_lower:
        return bot_data['titles_detail']['by_competition']['copa_mundial']['answer']
    
    # Respuesta por defecto
    return "Puedes preguntarme sobre mis goles, títulos, equipos y premios individuales."

# Ejemplos de uso
print(responder_pregunta("¿Cuántos goles marcaste?"))
# → "896 goles en toda mi carrera profesional"

print(responder_pregunta("¿Cuántos títulos ganaste en tu carrera?"))
# → "47 títulos ganados en mi carrera"

print(responder_pregunta("¿Cuántas Champions League ganaste?"))
# → "Gané 4 Champions League con el Barcelona en 2006, 2009, 2011 y 2015"
```

## 🔄 Actualización Automática

Cuando actualices las estadísticas desde el panel admin, también debes actualizar el archivo `messi-bot-data.json` para mantener las respuestas sincronizadas.

### Script de Actualización Automática

Puedes crear un script que sincronice ambos archivos:

```python
import json

# Leer stats actuales
with open('js/messi-stats.json', 'r') as f:
    stats = json.load(f)

# Actualizar bot-data
with open('js/messi-bot-data.json', 'r') as f:
    bot_data = json.load(f)

# Actualizar valores
bot_data['quick_answers']['total_goals'] = f"{stats['career_totals']['goals']} goles en toda mi carrera profesional"
bot_data['quick_answers']['total_matches'] = f"{stats['career_totals']['matches']} partidos jugados"
bot_data['quick_answers']['total_assists'] = f"{stats['career_totals']['assists']} asistencias"
bot_data['quick_answers']['total_titles'] = f"{stats['career_totals']['titles']} títulos ganados en mi carrera"

# Guardar cambios
with open('js/messi-bot-data.json', 'w') as f:
    json.dump(bot_data, f, indent=2, ensure_ascii=False)
```

## 📊 Endpoints Disponibles

1. **`/api/stats`** - Estadísticas completas (para la web)
2. **`/api/bot-data`** - Respuestas estructuradas (para el bot) ✨ NUEVO
3. **`/api/update`** - Actualizar estadísticas

## ✅ Ventajas del Nuevo Sistema

1. **Respuestas específicas**: El bot responde exactamente lo que se pregunta
2. **Respuestas naturales**: Textos preparados para conversación
3. **Fácil mantenimiento**: Un solo archivo para actualizar
4. **Flexible**: Puedes agregar más patrones de respuesta fácilmente

## 🎯 Próximos Pasos

1. Configurar tu bot para que use el endpoint `/api/bot-data`
2. Implementar lógica de detección de preguntas (NLP básico o regex)
3. Mapear las preguntas del usuario a las claves del JSON
4. Retornar las respuestas preparadas

## 💡 Ejemplos de Patrones de Preguntas

```
"¿Cuántos goles?" → quick_answers.total_goals
"¿Cuántos títulos?" → quick_answers.total_titles
"¿Dónde juegas?" → quick_answers.current_team
"¿Goles en Barcelona?" → career_summary.by_team.barcelona.goals
"¿Champions League?" → titles_detail.by_competition.champions_league.answer
"¿Balones de Oro?" → individual_awards.balon_oro.answer
```

---

**Última actualización**: 30 de noviembre de 2025
**Versión**: 2.0
