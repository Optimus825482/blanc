import sys, re, html, collections
path = sys.argv[1]
kw = sys.argv[2] if len(sys.argv)>2 else ""
with open(path, encoding="utf-8", errors="ignore") as f:
    s = f.read()
# strip scripts/styles
s2 = re.sub(r"<script[\s\S]*?</script>", " ", s, flags=re.I)
s2 = re.sub(r"<style[\s\S]*?</style>", " ", s2, flags=re.I)
links = re.findall(r'<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)</a>', s2, flags=re.I)
out = []
seen = set()
for href, inner in links:
    text = re.sub(r"<[^>]+>", " ", inner)
    text = html.unescape(re.sub(r"\s+", " ", text)).strip()
    if not text or len(text) > 80: 
        continue
    if kw and kw.lower() not in (text+" "+href).lower():
        continue
    key = (text.lower(), href)
    if key in seen: continue
    seen.add(key)
    out.append((text, href))
for t,h in out:
    print(f"{t}\t{h}")
print(f"#TOTAL={len(out)}")
