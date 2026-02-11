#!/usr/bin/env python3
"""
Messi Stats — Unified Server
Combines proxy + admin functionality in a single server.
Serves static files, API endpoints, and admin panel.

Usage: python3 server.py [port]
Default port: 8888
"""

import http.server
import json
import os
import re
from datetime import datetime
from urllib.parse import urlparse, parse_qs
import base64

# Handle PORT environment variable (Render may set it to empty string)
port_env = os.environ.get('PORT', '8888')
PORT = int(port_env) if port_env else 8888
ADMIN_USER = os.environ.get('ADMIN_USER', 'admin')
ADMIN_PASS = os.environ.get('ADMIN_PASS', 'messi10')
STATS_FILE = 'js/messi-stats.json'


class MasterHandler(http.server.SimpleHTTPRequestHandler):
    """Unified handler for all requests."""

    def log_message(self, fmt, *args):
        """Custom logging — only log API calls and errors."""
        path = args[0].split()[1] if args else ''
        if '/api/' in str(path) or '404' in str(args):
            super().log_message(fmt, *args)

    # ── CORS ──────────────────────────────────────────────

    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    # ── Auth ──────────────────────────────────────────────

    def check_admin_auth(self):
        """Check HTTP Basic Auth for admin endpoints."""
        auth_header = self.headers.get('Authorization', '')
        if not auth_header.startswith('Basic '):
            return False
        try:
            decoded = base64.b64decode(auth_header[6:]).decode('utf-8')
            user, passwd = decoded.split(':', 1)
            return user == ADMIN_USER and passwd == ADMIN_PASS
        except Exception:
            return False

    def require_auth(self):
        """Send 401 if not authenticated."""
        self.send_response(401)
        self.send_header('WWW-Authenticate', 'Basic realm="Admin Panel"')
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'<html><body><h1>401 - Autenticacion requerida</h1></body></html>')

    # ── GET routes ────────────────────────────────────────

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # API endpoints
        if path == '/api/stats':
            return self.serve_stats()
        elif path == '/api/status':
            return self.serve_status()
        elif path == '/admin' or path == '/admin/':
            # Check auth for admin panel
            if not self.check_admin_auth():
                return self.require_auth()
            self.path = '/admin/index.html'
            return super().do_GET()
        else:
            # Serve static files
            return super().do_GET()

    def serve_stats(self):
        """Serve messi-stats.json via API."""
        try:
            with open(STATS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(data, ensure_ascii=False, indent=2).encode('utf-8'))
        except FileNotFoundError:
            self.send_error(404, 'Stats file not found')
        except Exception as e:
            self.send_error(500, str(e))

    def serve_status(self):
        """Serve server status."""
        try:
            with open(STATS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            status = {
                'status': 'online',
                'server': 'Messi Stats Unified Server',
                'port': PORT,
                'last_updated': data.get('last_updated', 'unknown'),
                'career_totals': data.get('career_totals', {}),
                'timestamp': datetime.now().isoformat()
            }
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(status, ensure_ascii=False, indent=2).encode('utf-8'))
        except Exception as e:
            self.send_error(500, str(e))

    # ── POST routes ───────────────────────────────────────

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == '/api/update':
            if not self.check_admin_auth():
                return self.require_auth()
            return self.update_stats()
        elif path == '/api/update-full':
            if not self.check_admin_auth():
                return self.require_auth()
            return self.update_stats_full()
        elif path == '/api/update-team':
            if not self.check_admin_auth():
                return self.require_auth()
            return self.update_team_stats()
        else:
            self.send_error(404, 'Endpoint not found')

    def read_post_body(self):
        """Read and parse JSON POST body."""
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        return json.loads(post_data.decode('utf-8'))

    def update_stats(self):
        """Update career totals only."""
        try:
            new_stats = self.read_post_body()

            required = ['matches', 'goals', 'assists', 'titles']
            for field in required:
                if field not in new_stats:
                    self.send_error(400, f'Missing field: {field}')
                    return

            with open(STATS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)

            data['career_totals']['matches'] = int(new_stats['matches'])
            data['career_totals']['goals'] = int(new_stats['goals'])
            data['career_totals']['assists'] = int(new_stats['assists'])
            data['career_totals']['titles'] = int(new_stats['titles'])
            data['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            with open(STATS_FILE, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            self.send_json_response({'success': True, 'message': 'Estadísticas actualizadas'})
            print(f'✅ Stats updated: {data["career_totals"]}')

        except Exception as e:
            self.send_error(500, str(e))
            print(f'❌ Error: {e}')

    def update_stats_full(self):
        """Full update — replace entire data structure."""
        try:
            new_data = self.read_post_body()

            # Preserve metadata
            new_data['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            with open(STATS_FILE, 'w', encoding='utf-8') as f:
                json.dump(new_data, f, indent=2, ensure_ascii=False)

            self.send_json_response({'success': True, 'message': 'Datos completos actualizados'})
            print(f'✅ Full data update completed')

        except Exception as e:
            self.send_error(500, str(e))
            print(f'❌ Error: {e}')

    def update_team_stats(self):
        """Update specific team stats and recalculate totals."""
        try:
            update_data = self.read_post_body()

            # Validate team name
            team = update_data.get('team')
            valid_teams = ['barcelona', 'psg', 'inter_miami', 'argentina']
            if team not in valid_teams:
                self.send_error(400, f'Invalid team. Must be one of: {valid_teams}')
                return

            # Validate required fields
            required = ['matches', 'goals', 'assists', 'titles']
            for field in required:
                if field not in update_data:
                    self.send_error(400, f'Missing field: {field}')
                    return

            # Load current data
            with open(STATS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Update team stats
            data['teams'][team]['matches'] = int(update_data['matches'])
            data['teams'][team]['goals'] = int(update_data['goals'])
            data['teams'][team]['assists'] = int(update_data['assists'])
            data['teams'][team]['titles'] = int(update_data['titles'])

            # Recalculate career totals from all teams
            totals = {'matches': 0, 'goals': 0, 'assists': 0, 'titles': 0}
            for team_key in valid_teams:
                if team_key in data['teams']:
                    team_data = data['teams'][team_key]
                    totals['matches'] += team_data.get('matches', 0)
                    totals['goals'] += team_data.get('goals', 0)
                    totals['assists'] += team_data.get('assists', 0)
                    totals['titles'] += team_data.get('titles', 0)

            # Update career totals
            data['career_totals'] = totals
            data['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            # Save
            with open(STATS_FILE, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            self.send_json_response({
                'success': True,
                'message': f'Estadísticas de {data["teams"][team]["name"]} actualizadas',
                'team_stats': data['teams'][team],
                'career_totals': data['career_totals']
            })
            print(f'✅ Team {team} updated: {data["teams"][team]["goals"]} goles')

        except Exception as e:
            self.send_error(500, str(e))
            print(f'❌ Error: {e}')

    def send_json_response(self, data, status=200):
        """Helper to send JSON response."""
        self.send_response(status)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))


def run():
    os.chdir(os.path.dirname(os.path.abspath(__file__)) or '.')
    server = http.server.HTTPServer(('', PORT), MasterHandler)
    print(f'''
╔══════════════════════════════════════════╗
║   ⚽ Messi Stats Server                  ║
║   http://localhost:{PORT}                  ║
║   Admin: http://localhost:{PORT}/admin      ║
║   API:   http://localhost:{PORT}/api/stats  ║
╚══════════════════════════════════════════╝
    ''')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n🛑 Server stopped.')
        server.server_close()


if __name__ == '__main__':
    run()
