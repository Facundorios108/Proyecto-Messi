"""
Script de ejemplo para integrar el bot de Messi
Este script muestra cómo consumir los datos estructurados
"""

import requests
import json
import re

class MessiBot:
    def __init__(self, api_url="http://localhost:8888/api/bot-data"):
        self.api_url = api_url
        self.bot_data = self.cargar_datos()
    
    def cargar_datos(self):
        """Carga los datos del bot desde la API"""
        try:
            response = requests.get(self.api_url)
            return response.json()
        except Exception as e:
            print(f"Error al cargar datos: {e}")
            return {}
    
    def detectar_intencion(self, pregunta):
        """Detecta la intención de la pregunta"""
        pregunta_lower = pregunta.lower()
        
        # Normalizar texto
        pregunta_norm = pregunta_lower.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
        
        # Patrones de detección
        patrones = {
            'goles_totales': r'cuantos goles|total.*goles|goles.*carrera|goles.*marcaste',
            'goles_barcelona': r'goles.*barcelona|barcelona.*goles',
            'goles_psg': r'goles.*psg|psg.*goles',
            'goles_inter': r'goles.*inter|inter.*goles|goles.*miami',
            'goles_argentina': r'goles.*argentina|argentina.*goles|goles.*seleccion',
            'titulos_totales': r'cuantos titulos|total.*titulos|titulos.*carrera|titulos.*ganaste',
            'champions': r'champions|champions league|copas de europa',
            'mundial': r'mundial|copa del mundo|world cup',
            'copa_america': r'copa america|copas america',
            'balones_oro': r'balon.*oro|balones.*oro|ballons?.*or',
            'partidos': r'cuantos partidos|partidos.*jugaste',
            'asistencias': r'cuantas asistencias|asistencias',
            'equipo_actual': r'donde juegas|equipo actual|juegas ahora',
            'edad': r'cuantos anos|edad.*tienes|que edad',
        }
        
        for intencion, patron in patrones.items():
            if re.search(patron, pregunta_norm):
                return intencion
        
        return 'desconocido'
    
    def responder(self, pregunta):
        """Genera una respuesta basada en la pregunta"""
        intencion = self.detectar_intencion(pregunta)
        
        respuestas = {
            'goles_totales': self.bot_data['quick_answers']['total_goals'],
            'goles_barcelona': self.bot_data['career_summary']['by_team']['barcelona']['summary'],
            'goles_psg': self.bot_data['career_summary']['by_team']['psg']['summary'],
            'goles_inter': self.bot_data['career_summary']['by_team']['inter_miami']['summary'],
            'goles_argentina': self.bot_data['career_summary']['by_team']['argentina']['summary'],
            'titulos_totales': self.bot_data['quick_answers']['total_titles'],
            'champions': self.bot_data['titles_detail']['by_competition']['champions_league']['answer'],
            'mundial': self.bot_data['titles_detail']['by_competition']['copa_mundial']['answer'],
            'copa_america': self.bot_data['titles_detail']['by_competition']['copa_america']['answer'],
            'balones_oro': self.bot_data['individual_awards']['balon_oro']['answer'],
            'partidos': self.bot_data['quick_answers']['total_matches'],
            'asistencias': self.bot_data['quick_answers']['total_assists'],
            'equipo_actual': self.bot_data['quick_answers']['current_team'],
            'edad': self.bot_data['quick_answers']['age'],
        }
        
        return respuestas.get(intencion, "Lo siento, no entendí tu pregunta. Puedes preguntarme sobre mis goles, títulos, equipos y premios individuales.")
    
    def chat(self):
        """Inicia una sesión de chat interactiva"""
        print("🤖 Bot de Messi activado")
        print("Escribe 'salir' para terminar\n")
        
        while True:
            pregunta = input("Tú: ")
            
            if pregunta.lower() in ['salir', 'exit', 'quit']:
                print("👋 ¡Hasta luego!")
                break
            
            respuesta = self.responder(pregunta)
            print(f"Messi: {respuesta}\n")


# Función principal para pruebas
def main():
    # Crear instancia del bot
    bot = MessiBot()
    
    # Ejemplos de preguntas
    print("=== EJEMPLOS DE PREGUNTAS Y RESPUESTAS ===\n")
    
    ejemplos = [
        "¿Cuántos goles has marcado?",
        "¿Cuántos títulos ganaste en tu carrera?",
        "¿Cuántas Champions League ganaste?",
        "¿Ganaste el Mundial?",
        "¿Cuántos Balones de Oro tienes?",
        "¿Cuántos goles marcaste en el Barcelona?",
        "¿Dónde juegas ahora?",
        "¿Cuántas Copas América ganaste?",
    ]
    
    for pregunta in ejemplos:
        respuesta = bot.responder(pregunta)
        print(f"❓ {pregunta}")
        print(f"✅ {respuesta}\n")
    
    # Modo interactivo (descomentar para usar)
    # bot.chat()


if __name__ == "__main__":
    main()
