#!/usr/bin/env python3
"""
Local dev server cho ClimaNexus landing.
Giả lập Caddyfile rule: /demo → /demo.html

Usage:
    cd C:\\Users\\WELCOME\\Climanexus-landing
    python serve.py

Mặc định port 8080. Đổi bằng: python serve.py 9000
"""
import http.server
import os
import sys
from urllib.parse import urlparse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

class CaddyLikeHandler(http.server.SimpleHTTPRequestHandler):
    """Mirrors Caddyfile rules: rewrite /demo → /demo.html"""

    REWRITES = {
        '/demo': '/demo.html',
    }

    def do_GET(self):
        # Parse path (strip query string for matching)
        parsed = urlparse(self.path)
        clean_path = parsed.path

        if clean_path in self.REWRITES:
            new_path = self.REWRITES[clean_path]
            if parsed.query:
                new_path += '?' + parsed.query
            self.path = new_path

        return super().do_GET()

    def log_message(self, fmt, *args):
        # Quieter log
        sys.stderr.write(f"[{self.address_string()}] {fmt % args}\n")


def main():
    # Run from script's own directory so paths resolve correctly
    os.chdir(os.path.dirname(os.path.abspath(__file__)) or '.')

    server = http.server.ThreadingHTTPServer(('', PORT), CaddyLikeHandler)
    print(f"\nClimaNexus dev server")
    print(f"  → http://localhost:{PORT}/")
    print(f"  → http://localhost:{PORT}/demo (rewrites to /demo.html)")
    print(f"\nServing from: {os.getcwd()}")
    print(f"Press Ctrl+C to stop.\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == '__main__':
    main()
