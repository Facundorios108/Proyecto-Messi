# 📋 CURLS PARA POSTMAN - PROYECTO MESSI

## 🚀 PRINCIPALES ENDPOINTS

### 1. Estadísticas Completas
```
GET http://localhost:8888/api/stats
```

### 2. Solo Totales de Carrera
```
GET http://localhost:8888/api/stats
Headers: Accept: application/json
Filtro JQ: .career_totals
```

### 3. Por Equipos
```
GET http://localhost:8888/api/stats
Filtro JQ: .teams.barcelona
Filtro JQ: .teams.psg  
Filtro JQ: .teams.inter_miami
Filtro JQ: .teams.argentina
```

### 4. Health Check
```
GET http://localhost:8888/health
```

### 5. Última Actualización
```
GET http://localhost:8888/api/stats
Filtro JQ: .last_updated
```

## 📊 DATOS ESPERADOS (Octubre 2024)
- Partidos: 1090
- Goles: 858  
- Asistencias: 385
- Títulos: 47

## 🔧 TROUBLESHOOTING
- Si el servidor no responde: ejecutar `python3 proxy_server.py`
- Para actualizar stats: ejecutar `python3 update_stats.py once`
- Puerto por defecto: 8888
