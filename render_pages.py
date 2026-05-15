from pathlib import Path
import shutil

from jinja2 import Environment, FileSystemLoader

TEMPLATE_DIR = Path("templates")
OUTPUT_DIR = Path("public")
STATIC_DIR = Path("static")
PUBLIC_STATIC_DIR = OUTPUT_DIR / "static"

PAGES = [
    "index.html",
    "servicos.html",
    "processos.html",
    "contato.html",
]

OUTPUT_DIR.mkdir(exist_ok=True)

env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))


def fake_url_for(endpoint, filename=""):
    if endpoint == "static":
        return f"/static/{filename}"
    return ""


env.globals["url_for"] = fake_url_for

for stale_page in OUTPUT_DIR.glob("*.html"):
    if stale_page.name not in PAGES:
        stale_page.unlink()
        print(f"[OK] Removido HTML obsoleto: {stale_page.name}")

for page in PAGES:
    template = env.get_template(page)
    html = template.render()
    with (OUTPUT_DIR / page).open("w", encoding="utf-8") as f:
        f.write(html)
        print(f"[OK] Gerado: {page}")

if PUBLIC_STATIC_DIR.exists():
    shutil.rmtree(PUBLIC_STATIC_DIR)

shutil.copytree(STATIC_DIR, PUBLIC_STATIC_DIR)
print(f"[OK] Gerado: {PUBLIC_STATIC_DIR}")

favicon_source = STATIC_DIR / "favicon.ico"
if favicon_source.exists():
    favicon_target = OUTPUT_DIR / "favicon.ico"
    shutil.copy2(favicon_source, favicon_target)
    print(f"[OK] Gerado: {favicon_target}")
