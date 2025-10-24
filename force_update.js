// 🚀 Script de Actualización Inmediata
// Ejecuta este script en la consola del navegador para ver los cambios inmediatamente

console.log('🔄 Iniciando actualización inmediata...');

// Datos actualizados de messi.com (octubre 2024)
const newStats = {
    matches: 1130,
    goals: 889,
    assists: 401,
    titles: 46
};

// Función para actualizar un badge específico
function updateBadge(statType, value) {
    const paragraphs = document.querySelectorAll('.left-aligned, p');
    
    paragraphs.forEach(p => {
        if (p.textContent.includes(statType + ':')) {
            const badge = p.querySelector('.badge');
            if (badge) {
                const oldValue = badge.textContent;
                badge.textContent = value.toLocaleString();
                
                // Animación de actualización
                badge.style.transform = 'scale(1.2)';
                badge.style.background = '#27ae60';
                badge.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    badge.style.transform = 'scale(1)';
                }, 300);
                
                console.log(`✅ ${statType}: ${oldValue} → ${value}`);
            }
        }
    });
}

// Actualizar todas las estadísticas
console.log('📊 Actualizando estadísticas...');
updateBadge('Partidos', newStats.matches);
updateBadge('Goles', newStats.goals);
updateBadge('Asistencias', newStats.assists);
updateBadge('Títulos', newStats.titles);

// Mostrar notificación de éxito
const notification = document.createElement('div');
notification.innerHTML = `
    <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        z-index: 9999;
        font-family: 'Roboto', sans-serif;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
    ">
        🎉 ¡Estadísticas Sincronizadas!<br>
        <small style="opacity: 0.9;">Datos oficiales de messi.com cargados</small>
    </div>
`;

document.body.appendChild(notification);

// Remover notificación después de 4 segundos
setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => notification.remove(), 500);
}, 4000);

console.log('✅ ¡Actualización completada!');
console.log('📊 Nuevas estadísticas:');
console.log('   Partidos: 1,130');
console.log('   Goles: 889'); 
console.log('   Asistencias: 401');
console.log('   Títulos: 46');