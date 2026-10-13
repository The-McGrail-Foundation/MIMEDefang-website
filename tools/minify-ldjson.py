#!/usr/bin/env python3
"""
Minify a JSON-LD file and print it ready to paste as a Pelican front matter field.

Usage:
    python3 tools/minify-ldjson.py schema.json
    python3 tools/minify-ldjson.py < schema.json
"""
import json
import sys


def minify(source: str) -> str:
    return json.dumps(json.loads(source), separators=(",", ":"), ensure_ascii=False)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1]) as f:
            data = f.read()
    else:
        data = sys.stdin.read()

    result = minify(data)
    print(f"ld_json: {result}")
