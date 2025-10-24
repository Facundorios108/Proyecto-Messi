# 📁 ESTRUCTURA DEL PROYECTO MESSI

## 🎯 Archivos Principales

### 📄 HTML
- `index.html` - Página principal con navegación
- `professional_stats.html` - Página profesional de estadísticas
- `admin/index.html` - Panel de administración

### 🐍 Python (Servidores)
- `proxy_server.py` - Servidor API principal (puerto 8888)
- `admin_server.py` - Servidor del panel de admin (puerto 9000)

### 📊 Datos
- `js/messi-stats.json` - Base de datos central con todas las estadísticas

### 🎨 Estilos
- `css/styles.css` - Estilos unificados para todas las páginas

### 🖼️ Recursos
- `images/` - Escudos e imágenes de equipos
- `pages/` - Páginas individuales por equipo (Barcelona, PSG, Inter Miami, Argentina)

### 📚 Documentación
- `README.md` - Documentación general del proyecto
- `SISTEMA_ACTUALIZACION.md` - Guía de actualización
- `postman_collection.json` - Colección de Postman para testing

### ⚙️ Configuración
- `requirements.txt` - Dependencias Python
- `setup.sh` - Script de configuración inicial

## 🗑️ Carpeta de Backup
- `_backup_obsoletos/` - Archivos antiguos y duplicados (no borrar aún)

## 🚀 Comandos Principales

### Iniciar Servidores:
```bash
python3 proxy_server.py &
python3 admin_server.py &
```

### Abrir Panel de Admin:
```bash
open http://localhost:9000/admin
```

### Ver Página Principal:
```bash
open professional_stats.html
```

## 📝 Archivos que YA NO se usan (están en backup):
- auto_update_messi.py
- live_stats_updater.py
- real_time_updater.py
- sportsdb_updater.py
- sync_official.py
- update_stats.py
- admin_panel.html (duplicado)
- force_update.js
- actualizar_manual.sh
- Archivos JS antiguos

