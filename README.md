# 🐐 Proyecto Messi - El Mejor Jugador de la Historia

Un sitio web interactivo dedicado a la carrera de **Lionel Andrés Messi**, explorando su trayectoria a través de sus equipos más emblemáticos.

## 🏆 Descripción

Este proyecto presenta una navegación visual e interactiva por la carrera de Messi, incluyendo:

- **FC Barcelona (2004-2021)** - Su etapa dorada
- **Paris Saint-Germain (2021-2023)** - Los años de transición  
- **Inter Miami CF (2023-presente)** - Su nuevo renacer
- **Selección Argentina (2005-presente)** - El sueño cumplido

## 📁 Estructura del Proyecto

```
Proyecto-Messi/
├── 📄 index.html                 # Página principal con navegación
├── 📁 css/
│   └── styles.css               # Estilos unificados del proyecto
├── 📁 js/
│   └── (espacio para JavaScript futuro)
├── 📁 images/                   # Todas las imágenes del proyecto
│   ├── 000_334P84K-1024x683.jpg
│   ├── EscudoAFA.png
│   ├── EscudoBar.png
│   ├── EscudoInt.png
│   ├── EscudoInter.png
│   ├── EscudoPSG.png
│   ├── MessiBarcelona.jpg
│   ├── MessiPSG.jpg
│   ├── MessiSeleccion.jpg
│   ├── messi-messi-inter-de-miami.gif
│   └── psg.png
├── 📁 pages/                    # Páginas individuales por equipo
│   ├── messi_page.html         # FC Barcelona
│   ├── messi_page2.html        # Paris Saint-Germain
│   ├── messi_page3.html        # Inter Miami CF
│   └── messi_page4.html        # Selección Argentina
└── 📄 README.md                # Documentación del proyecto
```

## 🚀 Cómo Usar

### Opción 1: Navegador Directo
1. Abre el archivo `index.html` en tu navegador favorito
2. Navega usando los botones circulares de los escudos
3. Explora las estadísticas y regresa al inicio cuando gustes

### Opción 2: Desde Terminal (macOS)
```bash
cd "/ruta/al/proyecto/Proyecto Messi"
open index.html
```

### Opción 3: Live Server (Recomendado para desarrollo)
1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

## 🎨 Características

### ✨ Diseño y UX
- **Diseño responsive** - Funciona en desktop, tablet y móvil
- **Animaciones fluidas** - Efectos fade-in y hover elegantes
- **Navegación intuitiva** - Botones circulares con escudos de equipos
- **Paleta consistente** - Colores representativos de cada equipo

### 📊 Contenido
- **Estadísticas actualizadas** por equipo
- **Imágenes de alta calidad** de cada etapa
- **Información contextual** sobre cada período
- **Badges personalizados** para cada equipo

### 🛠️ Técnico
- **CSS modular y organizado**
- **Código semántico HTML5**
- **Estructura escalable**
- **Optimizado para SEO**

## 🎯 Estadísticas Destacadas

| Equipo | Partidos | Goles | Asistencias | Títulos |
|--------|----------|-------|-------------|---------|
| **Total Carrera** | 1,086 | 852 | 382 | 46 |
| FC Barcelona | 778 | 672 | 269 | 35 |
| Selección Argentina | 190 | 111 | 59 | 6 |
| Paris Saint-Germain | 75 | 32 | 34 | 3 |
| Inter Miami CF | 43 | 37 | 20 | 2 |

## � Sistema de Actualización Automática

### ✅ **¡YA IMPLEMENTADO!**
- [x] **Actualización automática** desde messi.com
- [x] **Web scraping** en tiempo real
- [x] **Servidor proxy** para evitar CORS
- [x] **Notificaciones visuales** de cambios
- [x] **Detección automática** de nuevas estadísticas
- [x] **Respaldo automático** de datos

### 🎮 **Cómo Activar la Magia Automática**

#### **Opción 1: Instalador Automático (Súper Fácil)**
```bash
./setup.sh
```

#### **Opción 2: Manual**
```bash
# 1. Instalar dependencias
pip3 install -r requirements.txt

# 2. Iniciar servidor de actualización
python3 proxy_server.py

# 3. Abrir proyecto normalmente
open index.html
```

### 🎯 **¿Qué Hace Automáticamente?**
1. **Cada 30 minutos** obtiene datos de messi.com
2. **Detecta cambios** en goles, partidos, asistencias, títulos
3. **Actualiza automáticamente** todas las páginas
4. **Muestra notificaciones** cuando hay nuevas estadísticas
5. **Hace backup** de los datos anteriores

### 🔄 **Estados del Sistema**
- 🟢 **Verde**: Auto-actualización activa
- 🟡 **Amarillo**: Modo manual (necesitas activar proxy)
- 🔴 **Rojo**: Error (revisar conexión)

## �🔧 Mejoras Futuras

### 📈 Funcionalidades Planeadas
- [ ] Gráficos interactivos con Chart.js
- [ ] Timeline de la carrera de Messi
- [ ] Galería de imágenes ampliable
- [ ] Sección de videos destacados
- [ ] Quiz sobre la carrera de Messi
- [ ] Comparador de estadísticas
- [ ] Modo oscuro/claro
- [ ] PWA con notificaciones push

### 🏗️ Mejoras Técnicas
- [x] ~~Implementación de JavaScript para interactividad~~
- [x] ~~Sistema de actualización automática~~
- [ ] Sistema de routing para URLs amigables
- [ ] Optimización de imágenes (WebP, lazy loading)
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (ES/EN)

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos, animaciones y responsive design
- **Google Fonts** - Tipografía Roboto
- **Flexbox & Grid** - Layout moderno
- **CSS Animations** - Efectos visuales

## 📝 Notas de Desarrollo

### 🔄 Reorganización Completada
- ✅ Estructura de carpetas profesional implementada
- ✅ CSS unificado y modular
- ✅ Rutas de imágenes actualizadas
- ✅ Navegación mejorada con títulos descriptivos
- ✅ SEO mejorado con meta descriptions
- ✅ Consistencia visual en todas las páginas

### 🎨 Sistema de Colores por Equipo
- **Barcelona**: `#cd122d` (granate) y `#154284` (azul)
- **PSG**: `#1a2434` (azul marino)
- **Inter Miami**: `#F5B6CD` (rosa)
- **Argentina**: `#73c7e3` (celeste)

## 📄 Licencia

Este proyecto es de uso educativo y de demostración. Todas las imágenes son utilizadas bajo fair use para fines educativos.

## 👨‍💻 Autor

**Facundo Ríos** - Desarrollador Full Stack

---

### 🌟 "El fútbol me ha dado todo en la vida, y espero poder devolver aunque sea una pequeña parte de todo lo que me ha dado." - Lionel Messi

*Última actualización: Octubre 2025*