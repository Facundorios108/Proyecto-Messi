/**
 * Sistema Simple de Estadísticas de Messi
 * 1. Intenta obtener datos de messi.com
 * 2. Si falla, usa el cache local (JSON)
 * 3. Muestra los datos en la página
 */

class SimpleMessiStats {
    constructor() {
        this.init();
    }

    async init() {
        const stats = await this.getStats();
        this.showStats(stats);
    }

    async getStats() {
        try {
            // 1. Intentar obtener datos actualizados de messi.com
            console.log('🔄 Obteniendo datos de messi.com...');
            const updatedStats = await this.fetchFromMessiCom();
            
            if (updatedStats) {
                console.log('✅ Datos obtenidos de messi.com');
                this.saveToCache(updatedStats);
                return updatedStats;
            }
        } catch (error) {
            console.log('⚠️ messi.com no disponible, usando cache');
        }

        // 2. Usar cache local si falla la conexión
        return this.loadFromCache();
    }

    async fetchFromMessiCom() {
        try {
            const response = await fetch('http://localhost:8888/api/update');
            if (response.ok) {
                const statsResponse = await fetch('http://localhost:8888/api/stats');
                if (statsResponse.ok) {
                    return await statsResponse.json();
                }
            }
            return null;
        } catch {
            return null;
        }
    }

    async loadFromCache() {
        console.log('📁 Cargando desde cache local...');
        const response = await fetch('./js/messi-stats.json?t=' + Date.now());
        return await response.json();
    }

    saveToCache(stats) {
        // En un entorno real, esto se haría en el servidor
        console.log('💾 Cache actualizado con nuevos datos');
    }

    showStats(stats) {
        console.log('📊 Mostrando estadísticas:', stats.career_totals);
        
        const totals = stats.career_totals;
        
        // Actualizar cada estadística en la página
        this.updateBadge('Partidos', totals.matches);
        this.updateBadge('Goles', totals.goals);
        this.updateBadge('Asistencias', totals.assists);
        this.updateBadge('Títulos', totals.titles);

        // Mostrar indicador de fuente
        this.showSource(stats.source || 'cache');
    }

    updateBadge(name, value) {
        const paragraphs = document.querySelectorAll('p');
        for (const p of paragraphs) {
            if (p.textContent.includes(name + ':')) {
                const badge = p.querySelector('.badge');
                if (badge) {
                    badge.textContent = value.toLocaleString();
                    console.log(`✅ ${name}: ${value}`);
                }
                break;
            }
        }
    }

    showSource(source) {
        const indicator = document.createElement('div');
        indicator.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: ${source.includes('messi.com') ? '#27ae60' : '#f39c12'};
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 12px;
                z-index: 1000;
            ">
                ${source.includes('messi.com') ? '🟢 Datos actualizados' : '🟡 Usando cache'}
            </div>
        `;
        
        // Remover indicador anterior
        const existing = document.querySelector('[data-source-indicator]');
        if (existing) existing.remove();
        
        indicator.setAttribute('data-source-indicator', 'true');
        document.body.appendChild(indicator);
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new SimpleMessiStats();
});

// Función global para actualizar manualmente
window.updateStats = () => new SimpleMessiStats();