#!/usr/bin/env python3
"""
Backend para el Panel de Administración
Permite actualizar las estadísticas desde la interfaz web
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
from datetime import datetime
from urllib.parse import urlparse, parse_qs

class AdminPanelHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Maneja peticiones GET"""
        # Remover query string del path
        path = self.path.split('?')[0]
        
        if path == '/api/stats':
            self.send_stats()
        elif path == '/' or path == '/admin':
            self.serve_admin_panel()
        elif path.startswith('/js/'):
            self.serve_file(path[1:], 'application/json')
        elif path.endswith('.html'):
            self.serve_file(path[1:], 'text/html')
        elif path.endswith('.css'):
            self.serve_file(path[1:], 'text/css')
        elif path.endswith('.js'):
            self.serve_file(path[1:], 'text/javascript')
        else:
            self.send_error(404)
    
    def serve_admin_panel(self):
        """Sirve el panel de administración"""
        try:
            with open('admin/index.html', 'r', encoding='utf-8') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(content.encode('utf-8'))
        except Exception as e:
            self.send_error(500, str(e))
    
    def serve_file(self, filepath, content_type):
        """Sirve un archivo estático"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-type', content_type + '; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(content.encode('utf-8'))
        except Exception as e:
            self.send_error(404, f"File not found: {filepath}")
    
    def do_POST(self):
        """Maneja peticiones POST para actualizar estadísticas"""
        if self.path == '/api/update':
            self.update_stats()
        else:
            self.send_error(404)
    
    def send_stats(self):
        """Envía las estadísticas actuales"""
        try:
            with open('js/messi-stats.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
            
        except Exception as e:
            self.send_error(500, str(e))
    
    def update_stats(self):
        """Actualiza las estadísticas desde la petición POST"""
        try:
            # Leer datos del cuerpo de la petición
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            new_stats = json.loads(post_data.decode('utf-8'))
            
            # Validar datos
            required_fields = ['matches', 'goals', 'assists', 'titles']
            for field in required_fields:
                if field not in new_stats:
                    self.send_error(400, f"Missing field: {field}")
                    return
            
            # Leer archivo actual
            with open('js/messi-stats.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Actualizar estadísticas
            data['career_totals']['matches'] = int(new_stats['matches'])
            data['career_totals']['goals'] = int(new_stats['goals'])
            data['career_totals']['assists'] = int(new_stats['assists'])
            data['career_totals']['titles'] = int(new_stats['titles'])
            data['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            data['source'] = 'admin panel'
            
            # Guardar archivo actualizado
            with open('js/messi-stats.json', 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            # Actualizar archivos HTML
            self.update_html_files(data['career_totals'])
            
            # Enviar respuesta exitosa
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {'success': True, 'message': 'Estadísticas actualizadas correctamente'}
            self.wfile.write(json.dumps(response).encode())
            
            print(f"\n✅ Estadísticas actualizadas: {data['career_totals']}")
            
        except Exception as e:
            self.send_error(500, str(e))
            print(f"❌ Error: {e}")
    
    def update_html_files(self, stats):
        """Actualiza los archivos HTML con las nuevas estadísticas"""
        try:
            # Actualizar professional_stats.html
            self.update_professional_stats(stats)
            # Actualizar index.html
            self.update_index_html(stats)
            print("✅ Archivos HTML actualizados")
        except Exception as e:
            print(f"⚠️  Error actualizando HTML: {e}")
    
    def update_professional_stats(self, stats):
        """Actualiza professional_stats.html"""
        try:
            with open('professional_stats.html', 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Reemplazar valores en los divs
            import re
            content = re.sub(
                r'<div class="stat-number" id="matches">\d+</div>',
                f'<div class="stat-number" id="matches">{stats["matches"]}</div>',
                content
            )
            content = re.sub(
                r'<div class="stat-number" id="goals">\d+</div>',
                f'<div class="stat-number" id="goals">{stats["goals"]}</div>',
                content
            )
            content = re.sub(
                r'<div class="stat-number" id="assists">\d+</div>',
                f'<div class="stat-number" id="assists">{stats["assists"]}</div>',
                content
            )
            content = re.sub(
                r'<div class="stat-number" id="titles">\d+</div>',
                f'<div class="stat-number" id="titles">{stats["titles"]}</div>',
                content
            )
            
            with open('professional_stats.html', 'w', encoding='utf-8') as f:
                f.write(content)
                
        except Exception as e:
            print(f"⚠️  Error actualizando professional_stats.html: {e}")
    
    def update_index_html(self, stats):
        """Actualiza index.html"""
        try:
            with open('index.html', 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Reemplazar valores en los badges
            import re
            content = re.sub(
                r'Partidos: <span class="badge">\d+</span>',
                f'Partidos: <span class="badge">{stats["matches"]}</span>',
                content
            )
            content = re.sub(
                r'Goles: <span class="badge">\d+</span>',
                f'Goles: <span class="badge">{stats["goals"]}</span>',
                content
            )
            content = re.sub(
                r'Asistencias: <span class="badge">\d+</span>',
                f'Asistencias: <span class="badge">{stats["assists"]}</span>',
                content
            )
            content = re.sub(
                r'Títulos: <span class="badge">\d+</span>',
                f'Títulos: <span class="badge">{stats["titles"]}</span>',
                content
            )
            
            with open('index.html', 'w', encoding='utf-8') as f:
                f.write(content)
                
        except Exception as e:
            print(f"⚠️  Error actualizando index.html: {e}")
    
    def do_OPTIONS(self):
        """Maneja peticiones OPTIONS para CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Personalizar logs"""
        return  # Silenciar logs por defecto

def run_admin_server(port=9000):
    """Inicia el servidor del panel de administración"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, AdminPanelHandler)
    
    print("="*60)
    print("🔧 SERVIDOR DEL PANEL DE ADMINISTRACIÓN")
    print("="*60)
    print(f"🌐 Panel Admin: http://localhost:{port}/admin/")
    print(f"📊 API Stats: http://localhost:{port}/api/stats")
    print(f"🔄 API Update: http://localhost:{port}/api/update")
    print("🛑 Presiona Ctrl+C para detener")
    print("="*60 + "\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n🛑 Servidor detenido")

if __name__ == "__main__":
    run_admin_server()
