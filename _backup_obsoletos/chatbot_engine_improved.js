// ===== MOTOR NLP AVANZADO PARA EL BOT DE MESSI =====
// Este código debe reemplazar las funciones del chatbot en professional_stats.html

function normalizeText(text) {
    return text.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
        .replace(/[¿?¡!]/g, '') // Quitar signos de puntuación
        .trim();
}

function extractNumbers(text) {
    const numbers = text.match(/\d+/g);
    return numbers ? numbers.map(n => parseInt(n)) : [];
}

function extractYear(text) {
    const yearMatch = text.match(/\b(19\d{2}|20\d{2})\b/);
    return yearMatch ? parseInt(yearMatch[0]) : null;
}

function analyzeQuestion(question) {
    const normalized = normalizeText(question);
    const numbers = extractNumbers(normalized);
    const year = extractYear(normalized);
    
    // Detectar intenciones principales con MÚLTIPLES variaciones
    const intents = {
        // Goles - TODAS LAS VARIACIONES POSIBLES
        goalsTotal: /(cuantos? gol|total.*gol|gol.*total|gol.*carrera|gol.*marcaste|marcaste.*gol|gol.*hiciste|hiciste.*gol|metiste.*gol|gol.*metiste)/i,
        goalsTeam: /(gol.*en|gol.*con|gol.*barcelona|gol.*psg|gol.*miami|gol.*argentina|en.*gol|con.*gol)/i,
        goalsYear: year !== null && /gol/i.test(normalized),
        
        // Títulos - TODAS LAS VARIACIONES
        titlesTotal: /(cuantos? titulo|titulo.*total|titulo.*carrera|titulo.*ganaste|ganaste.*titulo|campeonato|trofeo)/i,
        titlesSpecific: /(champions|mundial|copa.*america|liga|ligue|champion|uefa)/i,
        wonWorldCup: /(ganaste.*mundial|mundo.*ganaste|mundial.*ganaste|campeon.*mundo|copa.*mundo|world.*cup|sos.*campeon.*mundo|fuiste.*campeon)/i,
        
        // Premios - MÁS VARIACIONES
        balonOro: /(balon.*oro|oro.*balon|cuantos? balon|balones.*oro|pallone|golden.*ball|pelota.*oro)/i,
        botaOro: /(bota.*oro|oro.*bota|golden.*boot|zapato.*oro)/i,
        pichichi: /pichichi/i,
        theBest: /(the best|fifa.*best|mejor.*fifa)/i,
        
        // Equipos
        currentTeam: /(donde.*juegas|juegas.*donde|equipo.*actual|ahora.*juegas|en.*que.*equipo|actualmente|jugando.*ahora)/i,
        teamsPlayed: /(equipos.*jugaste|en.*que.*equipos|cuantos? equipo|todos.*equipos)/i,
        
        // Estadísticas
        assists: /(asistencia|pase.*gol|cuantas? asistencia)/i,
        matches: /(partido|encuentro|juego|cuantos? partido)/i,
        
        // Personal
        age: /(edad|anos|viejo|cuantos? anos|que.*edad|anos.*tenes)/i,
        nationality: /(nacionalidad|de.*donde.*eres|pais|argentino|de.*donde.*sos)/i,
        
        // Comparaciones y específicos
        bestYear: /(mejor.*ano|ano.*mejor|mas.*gol.*ano|ano.*mas.*gol)/i,
        records: /(record|marca|logro|mejor.*jugador)/i
    };
    
    // Detectar equipos mencionados con MÁS VARIACIONES
    const teams = {
        barcelona: /(barcelona|barca|barça|fc barcelona|cule|blaugrana)/i.test(normalized),
        psg: /(psg|paris|saint.germain|parc.*princes)/i.test(normalized),
        interMiami: /(inter.*miami|miami|mls|estados.*unidos)/i.test(normalized),
        argentina: /(argentina|seleccion|albiceleste|nacional)/i.test(normalized)
    };
    
    // Detectar competiciones con MÁS VARIACIONES
    const competitions = {
        champions: /(champions|uefa|copa.*europa|orejona)/i.test(normalized),
        mundial: /(mundial|world.*cup|copa.*mundo|qatar|rusia|brasil)/i.test(normalized),
        copaAmerica: /(copa.*america)/i.test(normalized),
        laLiga: /(la.*liga|liga.*espana|liga.*española)/i.test(normalized),
        ligue1: /(ligue.*1|liga.*francia|liga.*francesa)/i.test(normalized),
        leaguesCup: /(leagues.*cup|copa.*leagues)/i.test(normalized),
        supportersShield: /(supporters.*shield|shield)/i.test(normalized)
    };
    
    return { 
        normalized, 
        original: question,
        intents, 
        teams, 
        competitions,
        numbers,
        year
    };
}

// ===== MOTOR DE RESPUESTAS INTELIGENTE Y COMPLETO =====
function calculateAnswer(analysis) {
    if (!botData) {
        return {
            answer: '⏳ Cargando datos actualizados...',
            type: 'loading'
        };
    }
    
    const { intents, teams, competitions, year, normalized } = analysis;
    
    try {
        // ========== BALÓN DE ORO (Alta prioridad) ==========
        if (intents.balonOro.test(normalized)) {
            return {
                answer: `✨ **${botData.individual_awards.balon_oro.answer}**\n\n` +
                       `🏆 **Años:** ${botData.individual_awards.balon_oro.years.join(', ')}\n\n` +
                       `📊 **Desglose:**\n` +
                       `• 2009-2012: 4 consecutivos con Barcelona\n` +
                       `• 2015, 2019: 2 más con Barcelona\n` +
                       `• 2021: 1 con el PSG\n` +
                       `• 2023: 1 con Inter Miami\n\n` +
                       `¡Récord mundial absoluto! Nadie ha ganado más Balones de Oro. 💪`,
                type: 'award'
            };
        }
        
        // ========== BOTA DE ORO ==========
        if (intents.botaOro.test(normalized)) {
            return {
                answer: `⚽ **${botData.individual_awards.bota_oro.answer}**\n\n` +
                       `🏆 ¡Máximo goleador de Europa en 6 temporadas diferentes!\n\n` +
                       `Todas las gané con el Barcelona siendo el máximo artillero de Europa. 🔥`,
                type: 'award'
            };
        }
        
        // ========== PICHICHI ==========
        if (intents.pichichi.test(normalized)) {
            return {
                answer: `🇪🇸 **${botData.individual_awards.pichichi.answer}**\n\n` +
                       `¡Máximo goleador de La Liga en 8 temporadas!\n\n` +
                       `Un récord en el fútbol español. 💙❤️`,
                type: 'award'
            };
        }
        
        // ========== THE BEST ==========
        if (intents.theBest.test(normalized)) {
            return {
                answer: `🌟 **${botData.individual_awards.the_best.answer}**\n\n` +
                       `📅 **Años:** ${botData.individual_awards.the_best.years.join(', ')}\n\n` +
                       `El premio de la FIFA al mejor jugador del año. 🏆`,
                type: 'award'
            };
        }
        
        // ========== MUNDIAL (MUY ALTA PRIORIDAD) ==========
        if (intents.wonWorldCup.test(normalized) || (competitions.mundial && /(ganaste|campeon|titulo|sos|fuiste)/i.test(normalized))) {
            return {
                answer: `🏆⭐ **¡SÍ! ${botData.titles_detail.by_competition.copa_mundial.answer}**\n\n` +
                       `🇦🇷 ¡El sueño de mi vida hecho realidad! Fue en **Qatar 2022**.\n\n` +
                       `📊 **Mis números en ese Mundial:**\n` +
                       `• ⚽ 7 goles marcados\n` +
                       `• 🎯 3 asistencias\n` +
                       `• 🏆 Mejor jugador del torneo (Golden Ball)\n` +
                       `• ⭐ ¡CAMPEÓN DEL MUNDO!\n\n` +
                       `Después de 4 intentos (2006, 2010, 2014, 2018), finalmente alcancé la gloria máxima.\n\n` +
                       `¡El momento más especial de toda mi carrera! 💙🤍💙✨`,
                type: 'title_specific'
            };
        }
        
        // ========== CHAMPIONS LEAGUE ==========
        if (competitions.champions || /orejona/i.test(normalized)) {
            return {
                answer: `🏆 **${botData.titles_detail.by_competition.champions_league.answer}**\n\n` +
                       `📅 **Años:** ${botData.titles_detail.by_competition.champions_league.years.join(', ')}\n\n` +
                       `¡Todas con el FC Barcelona! 💙❤️\n\n` +
                       `Momentos inolvidables en la competición más prestigiosa de clubes. 🌟`,
                type: 'title_specific'
            };
        }
        
        // ========== COPA AMÉRICA ==========
        if (competitions.copaAmerica) {
            return {
                answer: `🏆 **${botData.titles_detail.by_competition.copa_america.answer}**\n\n` +
                       `📅 **Años:** ${botData.titles_detail.by_competition.copa_america.years.join(', ')}\n\n` +
                       `🇦🇷 ¡Títulos muy especiales con la Selección!\n\n` +
                       `La primera en 2021 rompió la sequía de 28 años sin títulos con Argentina. 💙`,
                type: 'title_specific'
            };
        }
        
        // ========== LA LIGA ==========
        if (competitions.laLiga) {
            return {
                answer: `🏆 **${botData.titles_detail.by_competition.la_liga.answer}**\n\n` +
                       `📅 **Años:** ${botData.titles_detail.by_competition.la_liga.years.join(', ')}\n\n` +
                       `¡Una década de dominio en España con el Barcelona! 💙❤️\n\n` +
                       `10 ligas en 17 temporadas. Increíble. 🔥`,
                type: 'title_specific'
            };
        }
        
        // ========== LIGUE 1 ==========
        if (competitions.ligue1) {
            return {
                answer: `🏆 **${botData.titles_detail.by_competition.ligue1.answer}**\n\n` +
                       `📅 **Años:** ${botData.titles_detail.by_competition.ligue1.years.join(', ')}\n\n` +
                       `¡Parte de mi aventura en París! 🗼`,
                type: 'title_specific'
            };
        }
        
        // ========== LEAGUES CUP ==========
        if (competitions.leaguesCup) {
            return {
                answer: `🏆 **${botData.titles_detail.by_competition.leagues_cup.answer}**\n\n` +
                       `¡Mi primer título con Inter Miami! 🌴\n\n` +
                       `Fue especial empezar así mi aventura en la MLS. 🇺🇸`,
                type: 'title_specific'
            };
        }
        
        // ========== SUPPORTERS SHIELD ==========
        if (competitions.supportersShield) {
            return {
                answer: `🏆 **${botData.titles_detail.by_competition.supporters_shield.answer}**\n\n` +
                       `¡El título al mejor equipo de la temporada regular de la MLS! 🌴\n\n` +
                       `Un logro importante con Inter Miami. 🇺🇸`,
                type: 'title_specific'
            };
        }
        
        // ========== TÍTULOS TOTALES ==========
        if (intents.titlesTotal.test(normalized) && !teams.barcelona && !teams.argentina && !teams.psg && !teams.interMiami) {
            return {
                answer: `🏆 **${botData.quick_answers.total_titles}**\n\n` +
                       `📊 **Desglose por equipos:**\n` +
                       `• Barcelona: ${botData.career_summary.by_team.barcelona.titles} títulos 💙❤️\n` +
                       `• Argentina: ${botData.career_summary.by_team.argentina.titles} títulos 🇦🇷\n` +
                       `• PSG: ${botData.career_summary.by_team.psg.titles} títulos 🗼\n` +
                       `• Inter Miami: ${botData.career_summary.by_team.inter_miami.titles} títulos 🌴\n\n` +
                       `🌟 **Títulos destacados:**\n` +
                       `• 1 Copa del Mundo ⭐\n` +
                       `• 4 Champions League\n` +
                       `• 10 La Liga\n` +
                       `• 2 Copas América\n\n` +
                       `${botData.titles_detail.major_titles_summary}`,
                type: 'career_stat'
            };
        }
        
        // ========== GOLES POR EQUIPO ==========
        if (/gol/i.test(normalized)) {
            // Barcelona
            if (teams.barcelona) {
                return {
                    answer: `⚽ **${botData.career_summary.by_team.barcelona.summary}**\n\n` +
                           `📈 **Mi mejor etapa:**\n` +
                           `• Periodo: ${botData.career_summary.by_team.barcelona.period}\n` +
                           `• Promedio: ${(botData.career_summary.by_team.barcelona.goals / botData.career_summary.by_team.barcelona.matches).toFixed(2)} goles por partido\n` +
                           `• Máximo goleador histórico del club\n\n` +
                           `💙❤️ **Mi casa, mi historia, mi vida.**\n\n` +
                           `¡La etapa más prolífica de mi carrera! 17 temporadas inolvidables. 🔥`,
                    type: 'team_specific'
                };
            }
            
            // Argentina
            if (teams.argentina) {
                return {
                    answer: `⚽ **${botData.career_summary.by_team.argentina.summary}**\n\n` +
                           `🇦🇷 **Con la albiceleste:**\n` +
                           `• Periodo: ${botData.career_summary.by_team.argentina.period}\n` +
                           `• Máximo goleador histórico\n` +
                           `• Campeón del Mundo 2022 ⭐\n` +
                           `• 2 Copas América (2021, 2024)\n\n` +
                           `¡El orgullo más grande de mi vida!\n\n` +
                           `Representar a mi país siempre fue lo más especial. 💙`,
                    type: 'team_specific'
                };
            }
            
            // PSG
            if (teams.psg) {
                return {
                    answer: `⚽ **${botData.career_summary.by_team.psg.summary}**\n\n` +
                           `🗼 **En París:**\n` +
                           `• Periodo: ${botData.career_summary.by_team.psg.period}\n` +
                           `• 2 temporadas en el fútbol francés\n` +
                           `• 2 Ligue 1 ganadas\n` +
                           `• Grandes compañeros (Neymar, Mbappé)\n\n` +
                           `¡Disfruté mi tiempo en Francia! Una experiencia diferente. 🇫🇷`,
                    type: 'team_specific'
                };
            }
            
            // Inter Miami
            if (teams.interMiami) {
                return {
                    answer: `⚽ **${botData.career_summary.by_team.inter_miami.summary}**\n\n` +
                           `🌴 **En Miami:**\n` +
                           `• Periodo: ${botData.career_summary.by_team.inter_miami.period}\n` +
                           `• ¡Números increíbles desde mi llegada!\n` +
                           `• Promedio: ${(botData.career_summary.by_team.inter_miami.goals / botData.career_summary.by_team.inter_miami.matches).toFixed(2)} goles por partido\n` +
                           `• Ya gané ${botData.career_summary.by_team.inter_miami.titles} títulos\n\n` +
                           `¡Una nueva aventura en Estados Unidos! Disfrutando cada momento. 🇺🇸⚽`,
                    type: 'team_specific'
                };
            }
            
            // Goles totales (si no especifica equipo)
            if (/total|carrera|cuantos|todos|hiciste|marcaste/i.test(normalized)) {
                return {
                    answer: `⚽ **${botData.quick_answers.total_goals}**\n\n` +
                           `📊 **Desglose por equipos:**\n` +
                           `• FC Barcelona: ${botData.career_summary.by_team.barcelona.goals} goles ⚽\n` +
                           `• Argentina: ${botData.career_summary.by_team.argentina.goals} goles 🇦🇷\n` +
                           `• Inter Miami: ${botData.career_summary.by_team.inter_miami.goals} goles 🌴\n` +
                           `• PSG: ${botData.career_summary.by_team.psg.goals} goles 🗼\n\n` +
                           `🔥 **¡Y sigo sumando en cada partido!**\n\n` +
                           `Más de 20 años marcando goles al más alto nivel. ✨`,
                    type: 'career_stat'
                };
            }
        }
        
        // ========== PARTIDOS ==========
        if (intents.matches.test(normalized) && /(cuanto|total|todos|jugaste)/i.test(normalized)) {
            return {
                answer: `🏟️ **${botData.quick_answers.total_matches}**\n\n` +
                       `📊 **Por equipos:**\n` +
                       `• Barcelona: ${botData.career_summary.by_team.barcelona.matches} partidos 💙❤️\n` +
                       `• Argentina: ${botData.career_summary.by_team.argentina.matches} partidos 🇦🇷\n` +
                       `• Inter Miami: ${botData.career_summary.by_team.inter_miami.matches} partidos 🌴\n` +
                       `• PSG: ${botData.career_summary.by_team.psg.matches} partidos 🗼\n\n` +
                       `⚽ ¡Más de 20 años de trayectoria profesional!\n\n` +
                       `Cada partido fue especial. ✨`,
                type: 'career_stat'
            };
        }
        
        // ========== ASISTENCIAS ==========
        if (intents.assists.test(normalized)) {
            return {
                answer: `🎯 **${botData.quick_answers.total_assists}**\n\n` +
                       `📊 **Por equipos:**\n` +
                       `• Barcelona: ${botData.career_summary.by_team.barcelona.assists} asistencias 💙❤️\n` +
                       `• Argentina: ${botData.career_summary.by_team.argentina.assists} asistencias 🇦🇷\n` +
                       `• Inter Miami: ${botData.career_summary.by_team.inter_miami.assists} asistencias 🌴\n` +
                       `• PSG: ${botData.career_summary.by_team.psg.assists} asistencias 🗼\n\n` +
                       `¡Me encanta dar pases de gol! 🤝\n\n` +
                       `No solo marcar, sino crear para mis compañeros. ⚽`,
                type: 'career_stat'
            };
        }
        
        // ========== EQUIPO ACTUAL ==========
        if (intents.currentTeam.test(normalized)) {
            return {
                answer: `🏟️ **${botData.quick_answers.current_team}**\n\n` +
                       `🌴 **Mis números en Inter Miami:**\n` +
                       `• ${botData.career_summary.by_team.inter_miami.goals} goles en ${botData.career_summary.by_team.inter_miami.matches} partidos\n` +
                       `• ${botData.career_summary.by_team.inter_miami.assists} asistencias\n` +
                       `• ${botData.career_summary.by_team.inter_miami.titles} títulos ganados\n\n` +
                       `¡Disfrutando cada partido en la MLS! ⚽🇺🇸`,
                type: 'current'
            };
        }
        
        // ========== EQUIPOS JUGADOS ==========
        if (intents.teamsPlayed.test(normalized)) {
            return {
                answer: `⚽ **He jugado en 3 equipos de clubes:**\n\n` +
                       `1️⃣ **FC Barcelona** (2004-2021)\n` +
                       `   • ${botData.career_summary.by_team.barcelona.goals} goles, ${botData.career_summary.by_team.barcelona.titles} títulos\n` +
                       `   • Mi casa, mi historia 💙❤️\n\n` +
                       `2️⃣ **Paris Saint-Germain** (2021-2023)\n` +
                       `   • ${botData.career_summary.by_team.psg.goals} goles, ${botData.career_summary.by_team.psg.titles} títulos\n` +
                       `   • Experiencia en Francia 🗼\n\n` +
                       `3️⃣ **Inter Miami** (2023-presente)\n` +
                       `   • ${botData.career_summary.by_team.inter_miami.goals} goles, ${botData.career_summary.by_team.inter_miami.titles} títulos\n` +
                       `   • Nueva aventura en USA 🌴\n\n` +
                       `🇦🇷 **Y siempre con la Selección Argentina** (2005-presente)\n` +
                       `   • ${botData.career_summary.by_team.argentina.goals} goles, ${botData.career_summary.by_team.argentina.titles} títulos\n` +
                       `   • ¡Campeón del Mundo! ⭐`,
                type: 'career'
            };
        }
        
        // ========== EDAD ==========
        if (intents.age.test(normalized)) {
            return {
                answer: `👤 **${botData.quick_answers.age}**\n\n` +
                       `¡Y sigo jugando al más alto nivel! 💪⚽\n\n` +
                       `La edad es solo un número cuando amas lo que haces. 🌟`,
                type: 'personal'
            };
        }
        
        // ========== NACIONALIDAD ==========
        if (intents.nationality.test(normalized)) {
            return {
                answer: `🇦🇷 **${botData.quick_answers.nationality}**\n\n` +
                       `De Rosario, Argentina. 🏙️\n\n` +
                       `¡Orgulloso de representar a mi país en cada momento! 💙`,
                type: 'personal'
            };
        }
        
        // ========== MEJOR AÑO ==========
        if (intents.bestYear.test(normalized)) {
            return {
                answer: `🔥 **Mi mejor año en goles fue 2012 con 91 goles** ⚽\n\n` +
                       `¡Un récord que nadie ha superado!\n\n` +
                       `Pero en términos de logros, **2022 fue el más especial**: ¡Gané el Mundial! 🏆⭐\n\n` +
                       `Y también 2009 cuando ganamos el sextete con el Barcelona. 💙❤️`,
                type: 'record'
            };
        }
        
        // ========== RÉCORDS ==========
        if (intents.records.test(normalized)) {
            return {
                answer: `🏆 **Algunos de mis récords:**\n\n` +
                       `• ${botData.records.most_ballon_dor}\n` +
                       `• ${botData.records.most_goals_barcelona}\n` +
                       `• ${botData.records.most_goals_argentina}\n` +
                       `• ${botData.records.most_la_liga_titles}\n` +
                       `• Único en ganar Balón de Oro con 3 equipos diferentes\n` +
                       `• 91 goles en un año calendario (2012)\n\n` +
                       `¡Y muchos más! 💪✨`,
                type: 'record'
            };
        }
        
        return null;
        
    } catch (error) {
        console.error('Error en calculateAnswer:', error);
        return null;
    }
}

// ===== RESPUESTAS DE FALLBACK MEJORADAS =====
function getFallbackResponse(question) {
    const normalized = normalizeText(question);
    
    // Sugerencias específicas basadas en palabras clave
    if (/gol/i.test(normalized)) {
        return `🎯 **¿Sobre qué goles quieres saber?**\n\n` +
               `Ejemplos de preguntas:\n` +
               `• "¿Cuántos goles marcaste en total?"\n` +
               `• "¿Cuántos goles en Barcelona?"\n` +
               `• "Goles con Argentina"\n` +
               `• "¿Cuántos goles hiciste en 2012?"\n` +
               `• "Goles en el PSG"\n` +
               `• "Goles en Inter Miami"\n\n` +
               `💡 ¡Respondo con datos actualizados!`;
    }
    
    if (/balon|ballon|premio|bota|oro|award/i.test(normalized)) {
        return `🏆 **¿Qué premios te interesan?**\n\n` +
               `Puedes preguntarme:\n` +
               `• "¿Cuántos Balones de Oro ganaste?"\n` +
               `• "Botas de Oro"\n` +
               `• "Trofeos Pichichi"\n` +
               `• "The Best FIFA"\n\n` +
               `💡 ¡Te daré todos los detalles!`;
    }
    
    if (/titulo|copa|campeon|ganaste/i.test(normalized)) {
        return `🏆 **¿Sobre qué títulos quieres saber?**\n\n` +
               `Pregúntame cosas como:\n` +
               `• "¿Cuántos títulos ganaste?"\n` +
               `• "¿Ganaste el Mundial?"\n` +
               `• "¿Cuántas Champions League ganaste?"\n` +
               `• "Copas América"\n` +
               `• "Títulos con Barcelona"\n\n` +
               `💡 ¡Pregunta lo que quieras!`;
    }
    
    if (/mundial|world.*cup|qatar/i.test(normalized)) {
        return `⭐ **¿Quieres saber sobre el Mundial?**\n\n` +
               `Pregúntame:\n` +
               `• "¿Ganaste un Mundial?"\n` +
               `• "¿Eres campeón del mundo?"\n` +
               `• "Mundial 2022"\n` +
               `• "Goles en el Mundial"\n\n` +
               `💡 ¡Fue el sueño de mi vida!`;
    }
    
    // Respuestas generales más útiles
    const fallbacks = [
        "🤔 **Pregúntame cosas como:**\n• ¿Cuántos goles marcaste?\n• ¿Ganaste el Mundial?\n• ¿Cuántos Balones de Oro tienes?\n• ¿Dónde juegas ahora?\n\n💡 ¡Sé específico y te daré todos los detalles!",
        "⚽ **Puedo hablarte sobre:**\n• Mis estadísticas (goles, asistencias, partidos)\n• Títulos y trofeos\n• Premios individuales\n• Equipos donde jugué\n\n💡 ¡Hazme una pregunta concreta!",
        "🏆 **Tengo información sobre:**\n• Barcelona, PSG, Inter Miami y Argentina\n• Balones de Oro y premios\n• Champions League, Mundiales y más\n• Récords y logros\n\n💡 ¡Pregúntame lo que quieras!",
        "✨ **Respondo preguntas como:**\n• ¿Cuántos goles en [equipo]?\n• ¿Ganaste [torneo]?\n• ¿Cuántos [premio] tienes?\n• ¿Dónde juegas?\n\n💡 ¡Tengo datos actualizados de toda mi carrera!"
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
