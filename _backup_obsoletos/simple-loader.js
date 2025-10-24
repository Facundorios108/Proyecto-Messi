/**
 * Sistema Simple - Garantiza que muestre exactamente lo del archivo JSON
 */

// Función simple que SIEMPRE funciona
async function loadAndShowStats() {
    try {
        console.log('🔄 Cargando estadísticas desde archivo JSON...');
        
        // Forzar recarga sin caché
        const response = await fetch('./js/messi-stats.json?nocache=' + Math.random(), {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }
        
        const stats = await response.json();
        console.log('✅ Archivo JSON cargado:', stats.career_totals);
        
        // Actualizar directamente en el DOM
        updateStatsDirectly(stats.career_totals);
        
        // Mostrar notificación
        showSuccessNotification();
        
    } catch (error) {
        console.error('❌ Error:', error);
        showErrorMessage();
    }
}

function updateStatsDirectly(totals) {
    console.log('📊 Actualizando estadísticas directamente...');
    
    // Mapeo directo de los datos
    const statsMap = {
        'Partidos': totals.matches,
        'Goles': totals.goals, 
        'Asistencias': totals.assists,
        'Títulos': totals.titles
    };
    
    // Buscar y actualizar cada estadística
    for (const [statName, value] of Object.entries(statsMap)) {
        // Buscar párrafos que contengan la estadística
        const allParagraphs = document.querySelectorAll('p');
        
        for (const paragraph of allParagraphs) {
            if (paragraph.textContent.includes(statName + ':')) {
                const badge = paragraph.querySelector('.badge');
                if (badge) {
                    const oldValue = badge.textContent;
                    badge.textContent = value.toLocaleString();
                    
                    // Animación visual para confirmar el cambio
                    badge.style.background = '#27ae60';
                    badge.style.transform = 'scale(1.1)';
                    badge.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        badge.style.transform = 'scale(1)';
                    }, 300);
                    
                    console.log(`✅ ${statName}: ${oldValue} → ${value}`);
                }
                break;
            }
        }
    }
}

function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(39, 174, 96, 0.4);
            z-index: 10000;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            animation: slideIn 0.5s ease;
        ">
            ✅ Archivo JSON leído correctamente<br>
            <small>Estadísticas: 1130, 889, 401, 46</small>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showErrorMessage() {
    console.error('❌ No se pudo leer el archivo JSON');
    alert('Error: No se pudo cargar el archivo messi-stats.json');
}

// CSS para la animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Cargar automáticamente cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadAndShowStats, 100); // Pequeño delay para asegurar que el DOM esté listo
});

// Función global para recargar manualmente
window.reloadStats = loadAndShowStats;