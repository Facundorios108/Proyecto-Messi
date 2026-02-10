/**
 * Messi Chatbot — Unified chatbot engine
 * Reads data from window.messiData (loaded by messi-data-loader.js)
 */

(function () {
    'use strict';

    let botData = null;

    function getData() {
        if (botData) return botData;
        botData = window.messiData || null;
        return botData;
    }

    /** Normalize text for matching */
    function normalizeText(text) {
        return text
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[¿?¡!.,;:]/g, '')
            .trim();
    }

    /** Extract numbers from text */
    function extractNumbers(text) {
        const nums = text.match(/\d+/g);
        return nums ? nums.map(Number) : [];
    }

    /** Extract a 4-digit year from text */
    function extractYear(text) {
        const match = text.match(/\b(19|20)\d{2}\b/);
        return match ? parseInt(match[0]) : null;
    }

    /** Analyze question to extract intent */
    function analyzeQuestion(question) {
        const normalized = normalizeText(question);
        const year = extractYear(normalized);

        const intents = {
            goalsTotal: /(cuantos? gol|total.*gol|gol.*total|gol.*carrera|gol.*marcaste)/i,
            goalsTeam: /(gol.*en|gol.*con|gol.*barcelona|gol.*psg|gol.*miami|gol.*argentina)/i,
            titlesTotal: /(cuantos? titulo|titulo.*total|titulo.*carrera|campeonato|trofeo)/i,
            titlesSpecific: /(champions|mundial|copa.*america|liga|ligue)/i,
            wonWorldCup: /(ganaste.*mundial|mundial.*ganaste|campeon.*mundo|copa.*mundo|world.*cup)/i,
            balonOro: /(balon.*oro|oro.*balon|cuantos? balon|balones.*oro)/i,
            botaOro: /(bota.*oro|golden.*boot)/i,
            pichichi: /pichichi/i,
            theBest: /(the best|fifa.*best|mejor.*fifa)/i,
            currentTeam: /(donde.*juegas|equipo.*actual|ahora.*juegas|en.*que.*equipo|actualmente)/i,
            teamsPlayed: /(equipos.*jugaste|en.*que.*equipos|cuantos? equipo|todos.*equipos)/i,
            assists: /(asistencia|pase.*gol|cuantas? asistencia)/i,
            matches: /(partido|encuentro|cuantos? partido)/i,
            age: /(edad|anos|viejo|cuantos? anos)/i,
            nationality: /(nacionalidad|de.*donde|pais|argentino)/i,
            bestYear: /(mejor.*ano|ano.*mejor|mas.*gol.*ano)/i,
            records: /(record|marca|logro|mejor.*jugador)/i,
            greeting: /(hola|buenas|hey|que tal|como estas|saludos)/i,
            thanks: /(gracias|gracia|thx|thank)/i,
            goodbye: /(chau|adios|bye|hasta luego|nos vemos)/i,
            help: /(ayuda|help|que puedo preguntar|que sabes)/i
        };

        // Detect team mentions
        const teams = {
            barcelona: /(barcelona|barca|barsa)/i,
            psg: /(psg|paris|saint.germain)/i,
            inter_miami: /(miami|inter miami|mls)/i,
            argentina: /(argentina|seleccion|albiceleste)/i
        };

        let detectedIntent = null;
        let detectedTeam = null;

        for (const [intent, regex] of Object.entries(intents)) {
            if (typeof regex === 'object' && regex.test(normalized)) {
                detectedIntent = intent;
                break;
            }
        }

        for (const [team, regex] of Object.entries(teams)) {
            if (regex.test(normalized)) {
                detectedTeam = team;
                break;
            }
        }

        return { intent: detectedIntent, team: detectedTeam, year, normalized };
    }

    /** Build response based on intent */
    function buildResponse(analysis) {
        const data = getData();
        if (!data) return '⚠️ No pude cargar mis datos. Intentá recargar la página.';

        const { intent, team, year } = analysis;

        // Greetings
        if (intent === 'greeting') {
            const greetings = data.conversation_patterns?.greetings || ['¡Hola! Preguntame lo que quieras.'];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        if (intent === 'thanks') return '¡De nada! ¿Querés saber algo más? ⚽';
        if (intent === 'goodbye') return '¡Hasta luego! Fue un placer charlar. 👋⚽';

        if (intent === 'help') {
            return '📋 Podés preguntarme sobre:\n• Goles y estadísticas por equipo\n• Títulos y logros\n• Balón de Oro y premios\n• Récords\n• Equipos donde jugué\n• ¡Y mucho más!';
        }

        // Goals
        if (intent === 'goalsTotal') {
            return `⚽ Llevo ${data.career_totals.goals} goles en toda mi carrera profesional (${data.career_totals.matches} partidos). ¡Un promedio de ${(data.career_totals.goals / data.career_totals.matches).toFixed(2)} goles por partido!`;
        }

        if (intent === 'goalsTeam' && team) {
            const t = data.teams[team];
            if (t) return `⚽ En ${t.name} marqué ${t.goals} goles en ${t.matches} partidos (${t.period}).`;
        }

        // Titles
        if (intent === 'titlesTotal') {
            return `🏆 He ganado ${data.career_totals.titles} títulos en mi carrera. ${data.titles_detail?.major_titles_summary || ''}`;
        }

        if (intent === 'wonWorldCup') {
            return '🏆⭐ ¡Sí! Gané la Copa Mundial FIFA 2022 con Argentina en Qatar. Fue el sueño de toda mi vida hecho realidad. También fui elegido como el Mejor Jugador del Mundial.';
        }

        if (intent === 'titlesSpecific') {
            const details = data.titles_detail?.by_competition;
            if (details) {
                // Try to match which competition
                const norm = analysis.normalized;
                if (/champions/i.test(norm) && details.champions_league) return `🏆 ${details.champions_league.answer}`;
                if (/mundial|world/i.test(norm) && details.copa_mundial) return `🏆 ${details.copa_mundial.answer}`;
                if (/copa.*america/i.test(norm) && details.copa_america) return `🏆 ${details.copa_america.answer}`;
                if (/liga(?!.*ligue)/i.test(norm) && details.la_liga) return `🏆 ${details.la_liga.answer}`;
                if (/ligue/i.test(norm) && details.ligue1) return `🏆 ${details.ligue1.answer}`;
            }
        }

        // Awards
        if (intent === 'balonOro') {
            const award = data.individual_awards?.balon_oro;
            return award ? `🏅 ${award.answer}. ¡Es un récord mundial!` : 'Gané 8 Balones de Oro.';
        }

        if (intent === 'botaOro') {
            const award = data.individual_awards?.bota_oro;
            return award ? `👟 ${award.answer}` : 'Gané 6 Botas de Oro.';
        }

        if (intent === 'pichichi') {
            const award = data.individual_awards?.pichichi;
            return award ? `🎯 ${award.answer}` : 'Gané 8 Trofeos Pichichi.';
        }

        if (intent === 'theBest') {
            const award = data.individual_awards?.the_best;
            return award ? `🌟 ${award.answer}` : 'Gané 3 premios The Best FIFA.';
        }

        // Team info
        if (intent === 'currentTeam') {
            return `⚽ Actualmente juego en ${data.personal_info?.current_team || 'Inter Miami CF'} desde 2023.`;
        }

        if (intent === 'teamsPlayed') {
            const teamNames = Object.values(data.teams).map(t => `${t.name} (${t.period})`);
            return `🏟️ Jugué en ${teamNames.length} equipos:\n• ${teamNames.join('\n• ')}`;
        }

        // Stats
        if (intent === 'assists') {
            if (team && data.teams[team]) {
                return `🎯 En ${data.teams[team].name} di ${data.teams[team].assists} asistencias.`;
            }
            return `🎯 Llevo ${data.career_totals.assists} asistencias en toda mi carrera.`;
        }

        if (intent === 'matches') {
            if (team && data.teams[team]) {
                return `📊 En ${data.teams[team].name} jugué ${data.teams[team].matches} partidos.`;
            }
            return `📊 Jugué ${data.career_totals.matches} partidos en toda mi carrera.`;
        }

        // Personal
        if (intent === 'age') {
            const birth = new Date(data.personal_info?.birth_date || '1987-06-24');
            const age = Math.floor((Date.now() - birth) / (365.25 * 24 * 60 * 60 * 1000));
            return `🎂 Tengo ${age} años. Nací el 24 de junio de 1987 en Rosario, Argentina.`;
        }

        if (intent === 'nationality') {
            return '🇦🇷 Soy argentino, nacido en Rosario, Santa Fe, Argentina.';
        }

        // Records
        if (intent === 'records') {
            if (data.records) {
                const recs = Object.values(data.records);
                return `📈 Algunos de mis récords:\n• ${recs.join('\n• ')}`;
            }
        }

        if (intent === 'bestYear') {
            return '📊 Mi mejor año fue 2012, marqué 91 goles en total (club + selección). ¡Un récord histórico!';
        }

        // Team-specific queries without clear intent
        if (team && data.teams[team]) {
            const t = data.teams[team];
            return `📊 En ${t.name} (${t.period}):\n⚽ ${t.goals} goles\n📋 ${t.matches} partidos\n🎯 ${t.assists} asistencias\n🏆 ${t.titles} títulos`;
        }

        // Fallback
        return '🤔 No estoy seguro de entender tu pregunta. Probá preguntarme sobre mis goles, títulos, equipos, premios o récords. ¡También podés usar los botones rápidos!';
    }

    /** Send message from user and get bot response */
    function processMessage(userMessage) {
        const analysis = analyzeQuestion(userMessage);
        return buildResponse(analysis);
    }

    /** Initialize chatbot UI */
    function initChatbot() {
        const container = document.getElementById('chat-container');
        if (!container) return;

        // Build chatbot HTML
        container.innerHTML = `
      <button class="chat-toggle" id="chat-toggle" aria-label="Abrir chat">
        <i class="fas fa-comments"></i>
        <span class="badge-dot"></span>
      </button>
      <div class="chat-window" id="chat-window">
        <div class="chat-header">
          <div class="chat-header-avatar">⚽</div>
          <div class="chat-header-info">
            <h4>Messi Bot</h4>
            <span>🟢 En línea</span>
          </div>
          <button class="chat-close" id="chat-close" aria-label="Cerrar chat">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="chat-messages" id="chat-messages">
          <div class="chat-bubble bot">¡Hola! Soy el bot de Messi ⚽ Preguntame lo que quieras sobre mi carrera.</div>
        </div>
        <div class="chat-quick-buttons" id="quick-buttons">
          <button class="quick-btn" data-q="¿Cuántos goles marcaste?">⚽ Goles</button>
          <button class="quick-btn" data-q="¿Cuántos títulos ganaste?">🏆 Títulos</button>
          <button class="quick-btn" data-q="¿Cuántos Balones de Oro tenés?">🏅 Balón de Oro</button>
          <button class="quick-btn" data-q="¿Ganaste el Mundial?">🌟 Mundial</button>
          <button class="quick-btn" data-q="¿En qué equipos jugaste?">🏟️ Equipos</button>
          <button class="quick-btn" data-q="¿Cuáles son tus récords?">📈 Récords</button>
        </div>
        <div class="chat-input-area">
          <input type="text" id="chat-input" placeholder="Escribí tu pregunta..." autocomplete="off">
          <button id="chat-send" aria-label="Enviar"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    `;

        // Event listeners
        const toggle = document.getElementById('chat-toggle');
        const chatWindow = document.getElementById('chat-window');
        const closeBtn = document.getElementById('chat-close');
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send');
        const messages = document.getElementById('chat-messages');

        toggle.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
            toggle.style.display = chatWindow.classList.contains('open') ? 'none' : 'flex';
        });

        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('open');
            toggle.style.display = 'flex';
        });

        function addMessage(text, type) {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${type}`;
            bubble.textContent = text;
            messages.appendChild(bubble);
            messages.scrollTop = messages.scrollHeight;
        }

        function handleSend() {
            const text = input.value.trim();
            if (!text) return;
            addMessage(text, 'user');
            input.value = '';

            // Typing indicator
            const typing = document.createElement('div');
            typing.className = 'typing-indicator';
            typing.innerHTML = '<span></span><span></span><span></span>';
            messages.appendChild(typing);
            messages.scrollTop = messages.scrollHeight;

            setTimeout(() => {
                typing.remove();
                const response = processMessage(text);
                addMessage(response, 'bot');
            }, 600 + Math.random() * 400);
        }

        sendBtn.addEventListener('click', handleSend);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });

        // Quick buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const q = btn.getAttribute('data-q');
                input.value = q;
                handleSend();
            });
        });
    }

    // Init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();
