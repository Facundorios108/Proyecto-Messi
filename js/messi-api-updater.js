/**
 * Messi API Updater - Sistema de actualización completamente automática
 * Conecta con el servidor proxy local para obtener datos reales de messi.com
 */

class MessiAPIUpdater {
    constructor() {
        this.proxyUrl = 'http://localhost:8888';
        this.updateInterval = null;
        this.isUpdating = false;
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando sistema de actualización automática...');
        
        // Verificar si el servidor proxy está disponible
        const proxyAvailable = await this.checkProxyServer();
        
        if (proxyAvailable) {
            console.log('✅ Servidor proxy conectado');
            this.startAutoUpdates();
        } else {
            console.log('⚠️  Servidor proxy no disponible - usando modo manual');
            this.showProxyInstructions();
        }
    }

    async checkProxyServer() {
        try {
            const response = await fetch(`${this.proxyUrl}/api/stats`, {
                method: 'GET',
                mode: 'cors'
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtener estadísticas reales desde messi.com a través del proxy
     */
    async fetchFromOfficialSite() {
        console.log('🔄 Obteniendo estadísticas reales de messi.com...');
        
        try {
            // Forzar actualización en el servidor
            const updateResponse = await fetch(`${this.proxyUrl}/api/update`, {
                method: 'GET',
                mode: 'cors'
            });
            
            if (updateResponse.ok) {
                const updateResult = await updateResponse.json();
                console.log('� Resultado de actualización:', updateResult.message);
                
                // Obtener las estadísticas actualizadas
                const statsResponse = await fetch(`${this.proxyUrl}/api/stats`, {
                    method: 'GET',
                    mode: 'cors'
                });
                
                if (statsResponse.ok) {
                    const stats = await statsResponse.json();
                    console.log('✅ Estadísticas obtenidas desde messi.com');
                    return stats;
                }
            }
            
            throw new Error('No se pudo actualizar desde el servidor');
            
        } catch (error) {
            console.error('❌ Error al obtener datos oficiales:', error);
            return null;
        }
    }

    /**
     * Simular respuesta de API para demostración
     */
    simulateAPIResponse() {
        return {
            last_updated: new Date().toISOString().split('T')[0],
            career_totals: {
                matches: 1090, // Simulando datos actualizados
                goals: 858,
                assists: 385,
                titles: 47
            },
            teams: {
                inter_miami: {
                    matches: 47, // Datos actualizados
                    goals: 41,
                    assists: 23,
                    titles: 2
                }
                // ... otros equipos
            }
        };
    }

    /**
     * Actualizar archivo JSON local con nuevos datos
     */
    async updateLocalStats(newStats) {
        // En un entorno real, esto requiere un backend
        console.log('📝 Nuevas estadísticas a actualizar:', newStats);
        
        // Mostrar notificación visual de actualización
        this.showUpdateNotification(newStats);
    }

    /**
     * Mostrar notificación de actualización
     */
    showUpdateNotification(stats) {
        const notification = document.createElement('div');
        notification.className = 'stats-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #2ecc71;
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 1000;
                animation: slideIn 0.5s ease;
            ">
                <strong>📊 Estadísticas Actualizadas</strong><br>
                <small>Goles totales: ${stats.career_totals?.goals || 'N/A'}</small>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Verificar si hay actualizaciones disponibles
     */
    async checkForUpdates() {
        console.log('🔍 Verificando actualizaciones...');
        
        try {
            const newStats = await this.fetchFromOfficialSite();
            
            if (newStats) {
                // Comparar con stats locales
                const currentStats = window.messiStats?.getCareerTotals();
                
                if (this.hasChanges(currentStats, newStats.career_totals)) {
                    console.log('✅ Se encontraron actualizaciones!');
                    await this.updateLocalStats(newStats);
                    
                    // Recargar stats en la UI
                    if (window.messiStats) {
                        window.messiStats.refresh();
                    }
                } else {
                    console.log('📋 Las estadísticas están actualizadas');
                }
            }
        } catch (error) {
            console.error('❌ Error al verificar actualizaciones:', error);
        }
    }

    /**
     * Comparar estadísticas para detectar cambios
     */
    hasChanges(current, updated) {
        if (!current || !updated) return true;
        
        return current.goals !== updated.goals ||
               current.assists !== updated.assists ||
               current.matches !== updated.matches ||
               current.titles !== updated.titles;
    }

    /**
     * Iniciar actualizaciones automáticas cada 30 minutos
     */
    startAutoUpdates() {
        console.log('⏰ Iniciando actualizaciones automáticas cada 30 minutos');
        
        // Verificar inmediatamente
        this.checkForUpdates();
        
        // Configurar actualizaciones automáticas
        this.updateInterval = setInterval(() => {
            this.checkForUpdates();
        }, 30 * 60 * 1000); // 30 minutos
        
        // Mostrar indicador visual
        this.showAutoUpdateIndicator();
    }

    /**
     * Detener actualizaciones automáticas
     */
    stopAutoUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            console.log('🛑 Actualizaciones automáticas detenidas');
        }
    }

    /**
     * Mostrar indicador de actualizaciones automáticas
     */
    showAutoUpdateIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'auto-update-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(46, 204, 113, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 25px;
                font-size: 12px;
                font-family: 'Roboto', sans-serif;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 1000;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                🔄 Auto-actualización ON
                <div style="font-size: 10px; opacity: 0.8;">Cada 30min</div>
            </div>
        `;
        
        // Remover indicador previo si existe
        const existing = document.getElementById('auto-update-indicator');
        if (existing) existing.remove();
        
        document.body.appendChild(indicator);
        
        // Click para detener/iniciar
        indicator.addEventListener('click', () => {
            if (this.updateInterval) {
                this.stopAutoUpdates();
                indicator.innerHTML = `
                    <div style="background: rgba(231, 76, 60, 0.9); padding: 10px 15px; border-radius: 25px;">
                        ⏸️ Auto-actualización OFF
                        <div style="font-size: 10px; opacity: 0.8;">Click para reactivar</div>
                    </div>
                `;
            } else {
                this.startAutoUpdates();
            }
        });
    }

    /**
     * Mostrar instrucciones del servidor proxy
     */
    showProxyInstructions() {
        const instructions = document.createElement('div');
        instructions.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 20px;
                right: 20px;
                background: #f39c12;
                color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 1000;
                font-family: 'Roboto', sans-serif;
            ">
                <h4 style="margin: 0 0 10px 0;">🚀 Activar Actualización Automática</h4>
                <p style="margin: 5px 0; font-size: 14px;">
                    Para que las estadísticas se actualicen solas desde messi.com:
                </p>
                <ol style="font-size: 12px; margin: 10px 0;">
                    <li>Abre Terminal y ve a la carpeta del proyecto</li>
                    <li>Ejecuta: <code style="background: rgba(0,0,0,0.2); padding: 2px 5px; border-radius: 3px;">python3 proxy_server.py</code></li>
                    <li>Recarga esta página</li>
                </ol>
                <button onclick="this.parentElement.remove()" style="
                    background: rgba(0,0,0,0.2);
                    border: none;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    float: right;
                ">Cerrar</button>
            </div>
        `;
        
        document.body.appendChild(instructions);
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            if (instructions.parentElement) {
                instructions.remove();
            }
        }, 10000);
    }
}

// CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .stats-notification {
        font-family: 'Roboto', sans-serif;
    }
`;
document.head.appendChild(style);

// Inicializar sistema de actualizaciones
document.addEventListener('DOMContentLoaded', () => {
    window.messiAPIUpdater = new MessiAPIUpdater();
    
    // Función global para verificar actualizaciones manualmente
    window.checkMessiUpdates = () => {
        if (window.messiAPIUpdater) {
            window.messiAPIUpdater.checkForUpdates();
        }
    };
    
    // Función para simular actualización (para testing)
    window.simulateUpdate = () => {
        if (window.messiAPIUpdater) {
            const fakeStats = window.messiAPIUpdater.simulateAPIResponse();
            window.messiAPIUpdater.updateLocalStats(fakeStats);
        }
    };
});

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessiAPIUpdater;
}