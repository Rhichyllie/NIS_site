from flask import Flask, render_template

app = Flask(__name__, template_folder="templates", static_folder="static")

# Home
@app.route('/')
def home():
    return render_template('home.html')

# Página de Serviços
@app.route('/servicos')
def servicos():
    return render_template('servicos.html')

# Página de Produto Específico
@app.route('/produto/<int:produto_id>')
def produto(produto_id):
    produtos = {
        1: {
            "nome": "Consultoria Sob Medida",
            "descricao": "Projetos personalizados, análise detalhada e soluções integradas."
        },
        2: {
            "nome": "Gestão de Mídias Sociais",
            "descricao": "Criação e gerenciamento de perfis e estratégias de conteúdo."
        },
        # Adicione mais produtos conforme necessidade
    }
    produto = produtos.get(produto_id, {"nome": "Produto não encontrado", "descricao": ""})
    return render_template('produto.html', produto=produto)

# Página de Portfolio
@app.route('/portfolio')
def portfolio():
    itens = [
        {
            "titulo": "Projeto Banco XYZ",
            "descricao": "Automação de processos e análise de dados para eficiência operacional.",
            "imagem": "imgs/portfolio1.jpg"
        },
        {
            "titulo": "Digitalização no Setor Público",
            "descricao": "Solução integrada para gestão de dados governamentais.",
            "imagem": "imgs/portfolio2.jpg"
        },
        # Adicione mais itens conforme necessidade
    ]
    return render_template('portfolio.html', itens=itens)

# Página de Contato
@app.route('/contato')
def contato():
    return render_template('contato.html')

# Main
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
