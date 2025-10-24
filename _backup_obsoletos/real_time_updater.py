#!/usr/bin/env python3
"""
Sistema de Actualización en Tiempo Real de Estadísticas de Messi
Usa múltiples fuentes de datos públicas para obtener estadísticas actualizadas
"""

import requests
import json
from datetime import datetime
import time

class RealTimeMessiStats:
    def __init__(self):
        self.stats_file = "js/messi-stats.json"
        self.sources = {
            'api-football': {
                'name': 'API-Football (RapidAPI)',
                'endpoint': 'https://api-football-v1.p.rapidapi.com/v3/players',
                'requires_key': True,
                'free_tier': True
            },
            'fotmob': {
                'name': 'FotMob (público)',
                'endpoint': 'https://www.fotmob.com/api/playerData',
                'requires_key': False,
                'free_tier': True
            },
            'transfermarkt': {
                'name': 'Transfermarkt (scraping)',
                'endpoint': 'https://www.transfermarkt.com/lionel-messi/profil/spieler/28003',
                'requires_key': False,
                'free_tier': True
            },
            'sofascore': {
                'name': 'SofaScore API',
                'endpoint': 'https://api.sofascore.com/api/v1/player/70',
                'requires_key': False,
                'free_tier': True
            }
        }
    
    def fetch_from_sofascore(self):
        """
        SofaScore - API pública que funciona bien
        Messi ID: 70
        """
        print("🔍 Consultando SofaScore API...")
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
            
            # Obtener datos del jugador
            player_url = "https://api.sofascore.com/api/v1/player/70"
            response = requests.get(player_url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                player = data.get('player', {})
                
                print(f"✅ Datos obtenidos de SofaScore")
                print(f"   Nombre: {player.get('name', 'N/A')}")
                
                # Obtener estadísticas totales de carrera
                stats_url = f"https://api.sofascore.com/api/v1/player/70/statistics/career"
                stats_response = requests.get(stats_url, headers=headers, timeout=10)
                
                if stats_response.status_code == 200:
                    stats_data = stats_response.json()
                    return self.parse_sofascore_stats(stats_data)
                    
        except Exception as e:
            print(f"⚠️  Error con SofaScore: {e}")
        
        return None
    
    def parse_sofascore_stats(self, data):
        """Parsea las estadísticas de SofaScore"""
        try:
            career_stats = data.get('statistics', {})
            
            total_goals = 0
            total_assists = 0
            total_matches = 0
            
            # Sumar estadísticas de todas las temporadas
            for stat in career_stats:
                total_goals += stat.get('goals', 0)
                total_assists += stat.get('assists', 0)
                total_matches += stat.get('appearances', 0)
            
            return {
                'goals': total_goals,
                'assists': total_assists,
                'matches': total_matches,
                'source': 'SofaScore'
            }
            
        except Exception as e:
            print(f"⚠️  Error parseando SofaScore: {e}")
            return None
    
    def fetch_from_fotmob(self):
        """
        FotMob - API pública alternativa
        """
        print("🔍 Consultando FotMob API...")
        
        try:
            # ID de Messi en FotMob: 103363
            url = "https://www.fotmob.com/api/playerData?id=103363"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Datos obtenidos de FotMob")
                return self.parse_fotmob_stats(data)
                    
        except Exception as e:
            print(f"⚠️  Error con FotMob: {e}")
        
        return None
    
    def parse_fotmob_stats(self, data):
        """Parsea estadísticas de FotMob"""
        try:
            stats = data.get('careerStatistics', {})
            career = stats.get('careerItems', {}).get('total', {})
            
            return {
                'goals': career.get('goals', 0),
                'assists': career.get('assists', 0),
                'matches': career.get('appearances', 0),
                'source': 'FotMob'
            }
            
        except Exception as e:
            print(f"⚠️  Error parseando FotMob: {e}")
            return None
    
    def fetch_all_sources(self):
        """Intenta obtener datos de todas las fuentes disponibles"""
        print("\n" + "="*60)
        print("🔄 CONSULTANDO FUENTES DE DATOS EN TIEMPO REAL")
        print("="*60 + "\n")
        
        results = []
        
        # Intentar SofaScore
        sofascore_data = self.fetch_from_sofascore()
        if sofascore_data:
            results.append(sofascore_data)
            time.sleep(1)  # Respetar rate limits
        
        # Intentar FotMob
        fotmob_data = self.fetch_from_fotmob()
        if fotmob_data:
            results.append(fotmob_data)
        
        return results
    
    def get_best_stats(self, results):
        """Selecciona las mejores estadísticas de las fuentes disponibles"""
        if not results:
            return None
        
        # Por ahora, usar la primera fuente que funcione
        # En el futuro, podrías promediar o validar entre fuentes
        return results[0]
    
    def update_json_file(self, new_stats):
        """Actualiza el archivo JSON con las nuevas estadísticas"""
        try:
            with open(self.stats_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Actualizar totales de carrera
            data['career_totals']['matches'] = new_stats.get('matches', data['career_totals']['matches'])
            data['career_totals']['goals'] = new_stats.get('goals', data['career_totals']['goals'])
            data['career_totals']['assists'] = new_stats.get('assists', data['career_totals']['assists'])
            
            # Actualizar metadata
            data['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            data['source'] = new_stats.get('source', 'unknown')
            
            # Guardar
            with open(self.stats_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"\n✅ Archivo actualizado con datos de {new_stats.get('source')}")
            return True
            
        except Exception as e:
            print(f"❌ Error actualizando archivo: {e}")
            return False
    
    def run_update(self):
        """Ejecuta el proceso de actualización completo"""
        print(f"\n⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Obtener datos de todas las fuentes
        results = self.fetch_all_sources()
        
        if results:
            # Seleccionar mejores datos
            best_stats = self.get_best_stats(results)
            
            print("\n📊 ESTADÍSTICAS OBTENIDAS:")
            print(f"   Partidos: {best_stats.get('matches', 'N/A')}")
            print(f"   Goles: {best_stats.get('goals', 'N/A')}")
            print(f"   Asistencias: {best_stats.get('assists', 'N/A')}")
            print(f"   Fuente: {best_stats.get('source', 'N/A')}")
            
            # Actualizar archivo
            self.update_json_file(best_stats)
            
            return True
        else:
            print("\n❌ No se pudieron obtener estadísticas de ninguna fuente")
            return False

def main():
    updater = RealTimeMessiStats()
    updater.run_update()

if __name__ == "__main__":
    main()
