"""Keeps the Node MindDo key helper on the server side."""

import atexit
import json
import os
import subprocess
import threading
from pathlib import Path


ROOT = Path(__file__).resolve().parent
KEYGEN_PROCESS = None
KEYGEN_LOCK = threading.Lock()


class KeygenError(RuntimeError):
    def __init__(self, message, fix=""):
        super().__init__(message)
        self.message = message
        self.fix = fix


def _node_command():
    local_node = ROOT / ".tools" / "node" / "bin" / "node"
    return str(local_node) if local_node.exists() else os.environ.get("NODE_BINARY", "node")


def _process():
    global KEYGEN_PROCESS
    if KEYGEN_PROCESS is None or KEYGEN_PROCESS.poll() is not None:
        try:
            KEYGEN_PROCESS = subprocess.Popen(
                [_node_command(), str(ROOT / "keygen.js")],
                cwd=ROOT,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                text=True,
                bufsize=1,
            )
        except OSError as error:
            raise KeygenError("The MindDo key helper is not available.", "Install Node.js or restart the project after Node.js is installed.") from error
    return KEYGEN_PROCESS


def get_key(force_refresh=False):
    with KEYGEN_LOCK:
        process = _process()
        request = {"action": "refresh" if force_refresh else "get"}
        try:
            process.stdin.write(json.dumps(request) + "\n")
            process.stdin.flush()
            response_line = process.stdout.readline()
        except OSError as error:
            raise KeygenError("The MindDo key helper stopped.", "Restart the project server and try again.") from error

        if not response_line:
            raise KeygenError("The MindDo key helper stopped.", "Restart the project server and try again.")

        try:
            response = json.loads(response_line)
        except json.JSONDecodeError as error:
            raise KeygenError("The MindDo key helper returned an invalid response.", "Restart the project server and check the MindDo settings.") from error

        if not response.get("ok"):
            problem = response.get("error") or {}
            raise KeygenError(
                problem.get("message", "The MindDo connection failed."),
                problem.get("fix", "Check the MindDo settings in .env."),
            )
        return response["apiKey"]


@atexit.register
def _close_process():
    if KEYGEN_PROCESS is not None and KEYGEN_PROCESS.poll() is None:
        KEYGEN_PROCESS.terminate()
