import sys, re, html
path, outp = sys.argv[1], sys.argv[2]
kw = sys.argv[3] if len(sys.argv)>3 else ""
s = open(path, encoding="utf-8", errors="replace").read()
if "\ufffd" in s[:3000] or s.count("\ufffd") > 50:
    s = open(path, encoding="cp1254", errors="replace").read()
s2 = re.sub(r"<script[\s\S]*?</script>", " ", s, flags=re.I)
s2 = re.sub(r"<style[\s\S]*?</style>", " ", s2, flags=re.I)
links = re.findall(r'<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)</a>', s2, flags=re.I)
lines=[]; seen=set()
for href, inner in links:
    text = re.sub(r"<[^>]+>", " ", inner)
    text = html.unescape(re.sub(r"\s+", " ", text)).strip()
    if not text or len(text) > 90: continue
    if kw and kw.lower() not in (text+" "+href).lower(): continue
    key=(text.lower(),href)
    if key in seen: continue
    seen.add(key)
    lines.append(f"{text}\t{href}")
lines.append(f"#TOTAL={len(lines)}")
open(outp,"w",encoding="utf-8").write("\n".join(lines))
print(len(lines))
