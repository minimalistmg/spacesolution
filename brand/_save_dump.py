"""Write a base64 PNG returned through CDP out to a file."""
from __future__ import annotations

import base64
import json
import sys
from pathlib import Path

raw = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
while isinstance(raw, dict):
    raw = raw.get("result", raw.get("value"))
out = Path(sys.argv[2])
out.write_bytes(base64.b64decode(raw))
print(f"wrote {out}")
