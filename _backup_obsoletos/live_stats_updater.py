#!/usr/bin/env python3
"""
Sistema REAL de actualización en tiempo real
Usa múltiples fuentes confiables que permiten acceso
"""

import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import re

class LiveMessiStats:
    def __init__(self):
        self.stats_file = "js/messi-stats.json"
        
    def fetch_from_wikipedia(self):
        """Wikipedia tiene estadísticas actualizadas y permite scraping"""
        print("🔍 Consultando Wikipedia...")
        
        try:
            url = "https://es.wikipedia.org/wiki/Lionel_Messi"
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=15)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Buscar la tabla de estadísticas
                stats = self.parse_wikipedia_stats(soup)
                
                if stats:
                    print("✅ Datos obtenidos de Wikipedia")
                    return stats
                    
        except Exception as e:
            print(f"⚠️  Error con Wikipedia: {e}")
        
        return None
    
    def parse_wikipedia_stats(self, soup):
        """Extrae estadísticas de la página de Wikipedia"""
        try:
            # Buscar en el texto números relevantes
            text = soup.get_text()
            
            stats = {}
            
            # Buscar patrones comunes en Wikipedia
            # Ejemplo: "Ha disputado más de 1000 partidos"
            matches_pattern = re.search(r'(\d{3,4})\s*(?:partidos|encuentros)', text, re.IGNORECASE)
            if matches_pattern:
                stats['matches'] = int(matches_pattern.group(1))
            
            # Buscar goles
            goals_pattern = re.search(r'(\d{3,4})\s*(?:goles|tantos)', text, re.IGNORECASE)
            if goals_pattern:
                stats['goals'] = int(goals_pattern.group(1))
            
            # Buscar asistencias  
            assists_pattern = re.search(r'(\d{2,3})\s*(?:asistencias)', text, re.IGNORECASE)
            if assists_pattern:
                stats['assists'] = int(assists_pattern.group(1))
            
            # Buscar títulos
            titles_pattern = re.search(r'(\d{2})\s*(?:títulos|trofeos)', text, re.IGNORECASE)
            if titles_pattern:
                stats['titles'] = int(titles_pattern.group(1))
            
            if stats:
                stats['source'] = 'Wikipedia'
                return stats
                
        except Exception as e:
            print(f"⚠️  Error parseando Wikipedia: {e}")
        
        return None
    
    def fetch_from_transfermarkt(self):
        """Transfermarkt - sitio confiable con estadísticas actualizadas"""
        print("🔍 Consultando Transfermarkt...")
        
        try:
            url = "https://www.transfermarkt.com/lionel-messi/profil/spieler/28003"
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=15)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                stats = self.parse_transfermarkt_stats(soup)
                
                if stats:
                    print("✅ Datos obtenidos de Transfermarkt")
                    return stats
                    
        except Exception as e:
            print(f"⚠️  Error con Transfermarkt: {e}")
        
        return None
    
    def parse_transfermarkt_stats(self, soup):
        """Parsea estadísticas de Transfermarkt"""
        try:
            stats = {}
            
            # Buscar tablas de estadísticas
            tables = soup.find_all('table', class_='items')
            
            for table in tables:
                rows = table.find_all('tr')
                for row in rows:
                    cells = row.find_all('td')
                    if len(cells) >= 3:
                        # Buscar goles y asistencias
                        text = row.get_text()
                        numbers = re.findall(r'\d+', text)
                        if numbers:
                            if 'goal' in text.lower() or 'gol' in text.lower():
                                stats['goals'] = sum(map(int, numbers))
                            if 'assist' in text.lower():
                                stats['assists'] = sum(map(int, numbers))
            
            if stats:
                stats['source'] = 'Transfermarkt'
                return stats
                
        except Exception as e:
            print(f"⚠️  Error parseando Transfermarkt: {e}")
        
        return None
    
    def fetch_from_fbref(self):
        """FBref - estadísticas detalladas de fútbol"""
        print("🔍 Consultando FBref...")
        
        try:
            url = "https://fbref.com/en/players/d70ce98e/Lionel-Messi"
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=15)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                stats = self.parse_fbref_stats(soup)
                
                if stats:
                    print("✅ Datos obtenidos de FBref")
                    return stats
                    
        except Exception as e:
            print(f"⚠️  Error con FBref: {e}")
        
        return None
    
    def parse_fbref_stats(self, soup):
        """Parsea estadísticas de FBref"""
        try:
            stats = {}
            
            # FBref tiene tablas muy bien estructuradas
            # Buscar tabla de estadísticas de carrera
            career_table = soup.find('table', {'id': 'stats_standard_dom_lg'})
            
            if career_table:
                # Buscar la fila de totales
                tfoot = career_table.find('tfoot')
                if tfoot:
                    cells = tfoot.find_all('td')
                    # Extraer datos de las celdas correspondientes
                    for cell in cells:
                        if cell.get('data-stat') == 'games':
                            stats['matches'] = int(cell.get_text().strip())
                        elif cell.get('data-stat') == 'goals':
                            stats['goals'] = int(cell.get_text().strip())
                        elif cell.get('data-stat') == 'assists':
                            stats['assists'] = int(cell.get_text().strip())
            
            if stats:
                stats['source'] = 'FBref'
                return stats
                
        except Exception as e:
            print(f"⚠️  Error parseando FBref: {e}")
        
        return None
    
    def get_current_stats(self):
        """Obtiene las estadísticas actuales del archivo"""
        try:
            with open(self.stats_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('career_totals', {})
        except:
            return {}
    
    def update_stats(self):
        """Proceso principal de actualización"""
        print("\n" + "="*60)
        print(f"🔄 ACTUALIZACIÓN EN TIEMPO REAL")
        print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*60 + "\n")
        
        current_stats = self.get_current_stats()
        print("📊 Estadísticas actuales:")
        print(f"   Partidos: {current_stats.get('matches', 'N/A')}")
        print(f"   Goles: {current_stats.get('goals', 'N/A')}")
        print(f"   Asistencias: {current_stats.get('assists', 'N/A')}")
        print()
        
        # Intentar cada fuente
        new_stats = None
        
        # Fuente 1: Wikipedia (más confiable y actualizado)
        new_stats = self.fetch_from_wikipedia()
        
        # Fuente 2: Transfermarkt
        if not new_stats:
            new_stats = self.fetch_from_transfermarkt()
        
        # Fuente 3: FBref
        if not new_stats:
            new_stats = self.fetch_from_fbref()
        
        if new_stats:
            print("\n📊 NUEVAS ESTADÍSTICAS ENCONTRADAS:")
            print(f"   Partidos: {new_stats.get('matches', current_stats.get('matches'))}")
            print(f"   Goles: {new_stats.get('goals', current_stats.get('goals'))}")
            print(f"   Asistencias: {new_stats.get('assists', current_stats.get('assists'))}")
            print(f"   Fuente: {new_stats.get('source', 'N/A')}")
            
            # Detectar cambios
            has_changes = False
            for key in ['matches', 'goals', 'assists']:
                if new_stats.get(key) and new_stats[key] != current_stats.get(key):
                    has_changes = True
                    break
            
            if has_changes:
                print("\n🎉 ¡CAMBIOS DETECTADOS! Actualizando...")
                self.save_stats(new_stats)
            else:
                print("\n✅ No hay cambios - Estadísticas al día")
        else:
            print("\n❌ No se pudieron obtener estadísticas nuevas")
            print("💡 Usando valores actuales conocidos...")
            # Usar valores de messi.com como fallback
            self.save_stats({
                'matches': 1130,
                'goals': 889,
                'assists': 401,
                'titles': 46,
                'source': 'messi.com (manual)'
            })
    
    def save_stats(self, new_stats):
        """Guarda las estadísticas en el archivo JSON"""
        try:
            with open(self.stats_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Actualizar solo si hay valores nuevos
            if 'matches' in new_stats:
                data['career_totals']['matches'] = new_stats['matches']
            if 'goals' in new_stats:
                data['career_totals']['goals'] = new_stats['goals']
            if 'assists' in new_stats:
                data['career_totals']['assists'] = new_stats['assists']
            if 'titles' in new_stats:
                data['career_totals']['titles'] = new_stats['titles']
            
            data['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            data['source'] = new_stats.get('source', 'unknown')
            
            with open(self.stats_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print("✅ Archivo actualizado correctamente")
            
        except Exception as e:
            print(f"❌ Error guardando estadísticas: {e}")

def main():
    updater = LiveMessiStats()
    updater.update_stats()

if __name__ == "__main__":
    main()
