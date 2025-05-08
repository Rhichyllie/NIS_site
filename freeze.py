# freeze.py  —  execute:  python freeze.py
from pathlib import Path
from flask import Flask, render_template        # ← request/redirect não são mais necessários
from flask_frozen import Freezer

BASE_DIR = Path(__file__).resolve().parent

app = Flask(
    __name__,
    template_folder=BASE_DIR / "templates",
    static_folder=BASE_DIR / "static"
)

# ---------- Rotas “puras” ----------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/servicos")
def servicos():
    return render_template("servicos.html")

@app.route("/portfolio")
def portfolio():
    return render_template("portfolio.html")

@app.route("/contato")
def contato():
    return render_template("contato.html")

@app.route("/processos")
def processos():
    return render_template("processos.html")

# ---------- Freezer ----------
app.config["FREEZER_DESTINATION"]   = BASE_DIR / "build"   # output ./build
app.config["FREEZER_RELATIVE_URLS"] = True                 # URLs relativas
app.config["FREEZER_IGNORE_URLS"]   = [                    # nada dinâmico
    "/newsletter-subscribe"
]

freezer = Freezer(app)

if __name__ == "__main__":
    freezer.freeze()          # gera ./build  → commit / deploy na Vercel
