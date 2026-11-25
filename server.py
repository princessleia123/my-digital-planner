"""Small local server for My Digital Planner."""

import json
import mimetypes
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

from ask_ai import ask_ai
from keygen_client import KeygenError


ROOT = Path(__file__).resolve().parent
PORT = 8000
PUBLIC_FILES = {
    "/": "index.html",
    "/index.html": "index.html",
    "/app.js": "app.js",
    "/storage.js": "storage.js",
    "/styles.css": "styles.css"
}


class PlannerHandler(BaseHTTPRequestHandler):
    def log_message(self, format_string, *args):
        # Keep student data and API errors out of the terminal log.
        return

    def send_json(self, status, body):
        encoded = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def do_GET(self):
        path = urlsplit(self.path).path
        filename = PUBLIC_FILES.get(path)
        if not filename:
            self.send_error(404)
            return

        file_path = ROOT / filename
        content = file_path.read_bytes()
        content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", content_type + "; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_POST(self):
        if urlsplit(self.path).path != "/api/plan":
            self.send_error(404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 50000:
                raise ValueError("invalid request size")
            request_data = json.loads(self.rfile.read(length).decode("utf-8"))
            answer = ask_ai(request_data)
            self.send_json(200, {"answer": answer})
        except KeygenError as error:
            if error.fix:
                print(error.fix, file=sys.stderr)
            self.send_json(502, {"error": error.message})
        except Exception:
            self.send_json(502, {
                "error": "I couldn't reach the AI. Please check the key and internet connection."
            })


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), PlannerHandler)
    print("My Digital Planner is running at http://127.0.0.1:%d" % PORT)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
