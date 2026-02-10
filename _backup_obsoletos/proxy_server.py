#!/usr/bin/env python3
"""
Servidor Proxy para Messi Stats
Evita restricciones CORS y permite acceso desde el navegador
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.request
import urllib.parse
from urllib.error import URLError
import threading
import time
import os

class MessiProxyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.serve_status_page()
        elif self.path == '/api/stats':
            self.serve_messi_stats()
        elif self.path == '/api/bot-data':
            self.serve_bot_data()
        elif self.path == '/api/update':
            self.update_stats()
        else:
            self.send_error(404)
    
    def do_OPTIONS(self):
        """Manejar preflight requests de CORS"""
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
    
    def send_cors_headers(self):
        """Enviar headers CORS"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    
    def serve_status_page(self):
        """Página de estado del servidor"""
        html = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Messi Stats Proxy Server</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .status { padding: 15px; background: #2ecc71; color: white; border-radius: 5px; margin: 20px 0; }
                .endpoint { background: #ecf0f1; padding: 15px; margin: 10px 0; border-radius: 5px; font-family: monospace; }
                button { background: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 5px; }
                button:hover { background: #2980b9; }
                .log { background: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; font-family: monospace; max-height: 300px; overflow-y: auto; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 Messi Stats Proxy Server</h1>
                <div class="status">✅ Servidor funcionando correctamente</div>
                
                <h3>📡 Endpoints Disponibles:</h3>
                <div class="endpoint">GET /api/stats - Obtener estadísticas actuales</div>
                <div class="endpoint">GET /api/update - Forzar actualización desde messi.com</div>
                
                <h3>🎮 Pruebas Rápidas:</h3>
                <button onclick="testStats()">📊 Probar Stats</button>
                <button onclick="forceUpdate()">🔄 Forzar Actualización</button>
                <button onclick="clearLog()">🧹 Limpiar Log</button>
                
                <h3>📋 Log de Actividad:</h3>
                <div id="log" class="log">Esperando actividad...</div>
            </div>
            
            <script>
                function testStats() {
                    fetch('/api/stats')
                        .then(r => r.json())
                        .then(data => {
                            log('✅ Stats obtenidas: ' + JSON.stringify(data.career_totals));
                        })
                        .catch(e => log('❌ Error: ' + e));
                }
                
                function forceUpdate() {
                    log('🔄 Iniciando actualización...');
                    fetch('/api/update')
                        .then(r => r.json())
                        .then(data => {
                            log('✅ Actualización completada: ' + data.message);
                        })
                        .catch(e => log('❌ Error en actualización: ' + e));
                }
                
                function log(message) {
                    const logDiv = document.getElementById('log');
                    const time = new Date().toLocaleTimeString();
                    logDiv.innerHTML += '<div>[' + time + '] ' + message + '</div>';
                    logDiv.scrollTop = logDiv.scrollHeight;
                }
                
                function clearLog() {
                    document.getElementById('log').innerHTML = 'Log limpiado...';
                }
            </script>
        </body>
        </html>
        """
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(html.encode())
    
    def serve_messi_stats(self):
        """Servir estadísticas actuales"""
        try:
            # Leer archivo JSON local
            stats_file = 'js/messi-stats.json'
            if os.path.exists(stats_file):
                with open(stats_file, 'r', encoding='utf-8') as f:
                    stats = json.load(f)
            else:
                stats = {"error": "Archivo de estadísticas no encontrado"}
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(stats, ensure_ascii=False).encode())
            
        except Exception as e:
            self.send_error(500, f"Error al leer estadísticas: {str(e)}")
    
    def serve_bot_data(self):
        """Servir datos optimizados para el bot"""
        try:
            # Leer archivo JSON optimizado para el bot
            bot_file = 'js/messi-bot-data.json'
            if os.path.exists(bot_file):
                with open(bot_file, 'r', encoding='utf-8') as f:
                    bot_data = json.load(f)
            else:
                bot_data = {"error": "Archivo de datos del bot no encontrado"}
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(bot_data, ensure_ascii=False).encode())
            
        except Exception as e:
            self.send_error(500, f"Error al leer datos del bot: {str(e)}")
    
    def update_stats(self):
        """Forzar actualización de estadísticas"""
        try:
            # Ejecutar el script de actualización
            import subprocess
            result = subprocess.run(['python3', 'update_stats.py', 'once'], 
                                  capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                response = {
                    "success": True,
                    "message": "Estadísticas actualizadas exitosamente",
                    "output": result.stdout
                }
            else:
                response = {
                    "success": False,
                    "message": "Error al actualizar estadísticas",
                    "error": result.stderr
                }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode())
            
        except Exception as e:
            self.send_error(500, f"Error en actualización: {str(e)}")
    
    def log_message(self, format, *args):
        """Personalizar logs del servidor"""
        print(f"[{time.strftime('%H:%M:%S')}] {format % args}")

class MessiProxyServer:
    def __init__(self, port=8888):
        self.port = port
        self.server = None
        self.thread = None
    
    def start(self):
        """Iniciar el servidor"""
        try:
            self.server = HTTPServer(('localhost', self.port), MessiProxyHandler)
            self.thread = threading.Thread(target=self.server.serve_forever)
            self.thread.daemon = True
            self.thread.start()
            
            print(f"🚀 Servidor proxy iniciado en http://localhost:{self.port}")
            print(f"📊 API Stats: http://localhost:{self.port}/api/stats")
            print(f"🔄 API Update: http://localhost:{self.port}/api/update")
            print("🛑 Presiona Ctrl+C para detener")
            
            return True
        except Exception as e:
            print(f"❌ Error al iniciar servidor: {e}")
            return False
    
    def stop(self):
        """Detener el servidor"""
        if self.server:
            self.server.shutdown()
            print("🛑 Servidor detenido")

def main():
    server = MessiProxyServer()
    
    if server.start():
        try:
            # Mantener el servidor corriendo
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            server.stop()

if __name__ == "__main__":
    main()