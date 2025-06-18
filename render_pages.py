from jinja2 import Environment, FileSystemLoader
import os
import re

# Caminhos
TEMPLATE_DIR = 'templates'
OUTPUT_DIR = 'public'
pages = ['index.html', 'processos.html', 'servicos.html', 'portfolio.html', 'contato.html']

# Configura Jinja
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

# Cria pasta public
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Função para remover/extrair url_for antes de processar
def preprocess_template(template_text):
    return re.sub(r"\{\{\s*url_for\('static',\s*filename='([^']+)'\)\s*\}\}", r"/static/\1", template_text)

# Renderiza cada página
for page in pages:
    with open(os.path.join(TEMPLATE_DIR, page), encoding='utf-8') as f:
        raw_template = f.read()
        raw_template = preprocess_template(raw_template)  # remove url_for

    template = env.from_string(raw_template)
    rendered = template.render()

    output_path = os.path.join(OUTPUT_DIR, page)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(rendered)
        print(f"[✔] Gerado: {output_path}")
