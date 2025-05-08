# arquivo server.py
import http.server
import socketserver
import os

class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        if self.path in ('/servicos', '/contato', '/portfolio', '/contato'):
            self.send_header('Content-Type', 'text/html; charset=utf-8')
        super().end_headers()

PORT = 8000
os.chdir('build')
with socketserver.TCPServer(("", PORT), SPARequestHandler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
