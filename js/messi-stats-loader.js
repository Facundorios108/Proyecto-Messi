// Messi Stats Loader - Carga datos verificados desde JSON
async function loadMessiStats() {
    try {
        const response = await fetch('../js/messi-stats.json');
        const data = await response.json();
        
        // Actualizar estadísticas de Barcelona si estamos en esa página
        if (document.getElementById('barcelona-matches')) {
            document.getElementById('barcelona-matches').textContent = data.teams.barcelona.matches;
            document.getElementById('barcelona-goals').textContent = data.teams.barcelona.goals;
            document.getElementById('barcelona-assists').textContent = data.teams.barcelona.assists;
            document.getElementById('barcelona-titles').textContent = data.teams.barcelona.titles;
        }
        
        // Actualizar estadísticas de PSG si estamos en esa página
        if (document.getElementById('psg-matches')) {
            document.getElementById('psg-matches').textContent = data.teams.psg.matches;
            document.getElementById('psg-goals').textContent = data.teams.psg.goals;
            document.getElementById('psg-assists').textContent = data.teams.psg.assists;
            document.getElementById('psg-titles').textContent = data.teams.psg.titles;
        }
        
        // Actualizar estadísticas de Inter Miami si estamos en esa página
        if (document.getElementById('miami-matches')) {
            document.getElementById('miami-matches').textContent = data.teams.inter_miami.matches;
            document.getElementById('miami-goals').textContent = data.teams.inter_miami.goals;
            document.getElementById('miami-assists').textContent = data.teams.inter_miami.assists;
            document.getElementById('miami-titles').textContent = data.teams.inter_miami.titles;
        }
        
        // Actualizar estadísticas de Argentina si estamos en esa página
        if (document.getElementById('argentina-matches')) {
            document.getElementById('argentina-matches').textContent = data.teams.argentina.matches;
            document.getElementById('argentina-goals').textContent = data.teams.argentina.goals;
            document.getElementById('argentina-assists').textContent = data.teams.argentina.assists;
            document.getElementById('argentina-titles').textContent = data.teams.argentina.titles;
        }
        
        // Mostrar fecha de última actualización
        const lastUpdated = document.getElementById('last-updated');
        if (lastUpdated && data.verification) {
            lastUpdated.textContent = `Datos verificados: ${data.verification.verified_date}`;
        }
        
        console.log('✅ Estadísticas de Messi cargadas correctamente desde:', data.data_source);
        
    } catch (error) {
        console.error('❌ Error al cargar estadísticas de Messi:', error);
        // Mantener los valores predeterminados del HTML si hay error
    }
}

// Cargar estadísticas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadMessiStats);

// También exportar la función para uso manual
window.loadMessiStats = loadMessiStats;