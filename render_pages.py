from jinja2 import Environment, FileSystemLoader
from pathlib import Path
import os
import shutil

TEMPLATE_DIR = "templates"
OUTPUT_DIR   = "public"
STATIC_DIR   = "static"
PUBLIC_STATIC_DIR = os.path.join(OUTPUT_DIR, "static")
PAGES = [
    "index.html",
    "processos.html",
    "servicos.html",
    "portfolio.html",
    "contato.html",      # novo arquivo
]

# cria pasta de saída
os.makedirs(OUTPUT_DIR, exist_ok=True)

# configura Jinja
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

# ✨ stub simples de url_for só para 'static'
def fake_url_for(endpoint, filename=""):
    if endpoint == "static":
        return f"/static/{filename}"
    return ""

env.globals["url_for"] = fake_url_for   # <-- aqui está o segredo

# renderiza todas as páginas
for page in PAGES:
    template = env.get_template(page)
    html = template.render()          # pode passar context aqui se precisar
    with open(os.path.join(OUTPUT_DIR, page), "w", encoding="utf-8") as f:
        f.write(html)
        print(f"[✔] Gerado: {page}")

# recria os assets estáticos para preview local em /public
if os.path.exists(PUBLIC_STATIC_DIR):
    shutil.rmtree(PUBLIC_STATIC_DIR)

shutil.copytree(STATIC_DIR, PUBLIC_STATIC_DIR)
print(f"[✔] Gerado: {PUBLIC_STATIC_DIR}")

# mantém favicon de fallback no root do preview local
favicon_source = Path(STATIC_DIR) / "favicon.ico"
if favicon_source.exists():
    shutil.copy2(favicon_source, Path(OUTPUT_DIR) / "favicon.ico")
    print(f"[✔] Gerado: {Path(OUTPUT_DIR) / 'favicon.ico'}")
