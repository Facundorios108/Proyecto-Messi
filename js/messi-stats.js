/**
 * Messi Stats Manager - Sistema de estadísticas dinámicas
 * Carga y actualiza automáticamente las estadísticas de Lionel Messi
 */

class MessiStatsManager {
    constructor() {
        this.stats = null;
        this.init();
    }

    /**
     * Inicializa el sistema de estadísticas
     */
    async init() {
        try {
            await this.loadStats();
            this.updateUI();
            this.addLastUpdatedInfo();
        } catch (error) {
            console.error('Error al cargar las estadísticas:', error);
            this.showError();
        }
    }

    /**
     * Carga las estadísticas desde el archivo JSON o servidor proxy
     */
    async loadStats() {
        try {
            // Intentar cargar desde el servidor proxy primero
            const proxyResponse = await fetch('http://localhost:8888/api/stats');
            if (proxyResponse.ok) {
                this.stats = await proxyResponse.json();
                console.log('📊 Estadísticas cargadas desde servidor proxy');
                return;
            }
        } catch (error) {
            console.log('⚠️  Servidor proxy no disponible, usando archivo local');
        }
        
        // Cargar desde archivo local con cache busting
        const timestamp = Date.now();
        const response = await fetch(`./js/messi-stats.json?v=${timestamp}`, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        this.stats = await response.json();
        console.log('📊 Estadísticas cargadas desde archivo local (sin caché)', this.stats.career_totals);
    }

    /**
     * Actualiza la interfaz con las estadísticas cargadas
     */
    updateUI() {
        // Detectar en qué página estamos
        const currentPage = this.detectCurrentPage();
        
        if (currentPage === 'index') {
            this.updateIndexPage();
        } else if (currentPage in this.stats.teams) {
            this.updateTeamPage(currentPage);
        }
    }

    /**
     * Detecta la página actual basándose en la URL y elementos
     */
    detectCurrentPage() {
        const path = window.location.pathname;
        
        if (path.includes('messi_page4.html')) return 'argentina';
        if (path.includes('messi_page3.html')) return 'inter_miami';
        if (path.includes('messi_page2.html')) return 'psg';
        if (path.includes('messi_page.html')) return 'barcelona';
        
        return 'index'; // Página principal
    }

    /**
     * Actualiza la página principal (index.html)
     */
    updateIndexPage() {
        const totals = this.stats.career_totals;
        
        this.updateBadge('Partidos', totals.matches);
        this.updateBadge('Goles', totals.goals);
        this.updateBadge('Asistencias', totals.assists);
        this.updateBadge('Títulos', totals.titles);
    }

    /**
     * Actualiza las páginas de equipos específicos
     */
    updateTeamPage(teamKey) {
        const team = this.stats.teams[teamKey];
        
        this.updateBadge('Partidos', team.matches);
        this.updateBadge('Goles', team.goals);
        this.updateBadge('Asistencias', team.assists);
        this.updateBadge('Títulos', team.titles);

        // Actualizar el título si existe
        const titleElement = document.querySelector('h2');
        if (titleElement && team.name && team.period) {
            titleElement.textContent = `${team.name} (${team.period})`;
        }
    }

    /**
     * Actualiza un badge específico
     */
    updateBadge(statType, value) {
        // Buscar el párrafo que contiene el tipo de estadística
        const paragraphs = document.querySelectorAll('.left-aligned');
        
        paragraphs.forEach(p => {
            if (p.textContent.includes(statType + ':')) {
                const badge = p.querySelector('.badge');
                if (badge) {
                    badge.textContent = value.toLocaleString();
                    this.animateBadgeUpdate(badge);
                }
            }
        });
    }

    /**
     * Añade animación cuando se actualiza un badge
     */
    animateBadgeUpdate(badge) {
        badge.style.transform = 'scale(1.1)';
        badge.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 300);
    }

    /**
     * Añade información de última actualización
     */
    addLastUpdatedInfo() {
        const container = document.querySelector('.container');
        if (container && this.stats.last_updated) {
            const updateInfo = document.createElement('p');
            updateInfo.className = 'last-updated';
            updateInfo.innerHTML = `
                <small style="color: #666; font-size: 12px;">
                    📊 Estadísticas actualizadas: ${this.formatDate(this.stats.last_updated)}
                </small>
            `;
            container.appendChild(updateInfo);
        }
    }

    /**
     * Formatea la fecha de última actualización
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Muestra un error si las estadísticas no se pueden cargar
     */
    showError() {
        const container = document.querySelector('.container');
        if (container) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'stats-error';
            errorMsg.innerHTML = `
                <p style="color: #e74c3c; font-size: 14px; text-align: center;">
                    ⚠️ No se pudieron cargar las estadísticas actualizadas
                </p>
            `;
            container.insertBefore(errorMsg, container.firstChild);
        }
    }

    /**
     * Método público para actualizar manualmente las estadísticas
     */
    async refresh() {
        console.log('🔄 Forzando actualización de estadísticas...');
        await this.loadStats();
        this.updateUI();
        this.showUpdateNotification();
        console.log('✅ Estadísticas actualizadas');
    }

    /**
     * Mostrar notificación de actualización
     */
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                z-index: 9999;
                font-family: 'Roboto', sans-serif;
                animation: slideIn 0.5s ease;
            ">
                📊 ¡Estadísticas Actualizadas!<br>
                <small>Datos sincronizados con messi.com</small>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Obtener estadísticas de un equipo específico
     */
    getTeamStats(teamKey) {
        return this.stats?.teams[teamKey] || null;
    }

    /**
     * Obtener totales de carrera
     */
    getCareerTotals() {
        return this.stats?.career_totals || null;
    }
}

// Inicializar el sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.messiStats = new MessiStatsManager();
    
    // Agregar función global para actualizar desde la consola
    window.updateMessiStats = () => {
        if (window.messiStats) {
            window.messiStats.refresh();
        }
    };
});

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessiStatsManager;
}