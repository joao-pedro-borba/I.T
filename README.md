# Sistema Template Flask - IENH Dev Sistemas II 2025

Template completo de aplicação web com Flask, SQLAlchemy e autenticação de usuários para uso em projetos acadêmicos.

## Características

- Sistema de autenticação completo (login, logout, registro)
- Proteção de rotas com `@login_required`
- Banco de dados SQLite com SQLAlchemy ORM
- Interface moderna e responsiva com CSS
- Validações de formulário
- Sistema de mensagens flash
- Estrutura organizada seguindo boas práticas
- Hash seguro de senhas com Werkzeug

## Estrutura do Projeto

```
ProjetoFinal/
├── app/
│   ├── __init__.py          # Configuração da aplicação Flask
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py          # Modelo de usuário
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py          # Rotas de autenticação
│   │   └── main.py          # Rotas principais
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css    # Estilos CSS
│   │   └── js/
│   │       └── main.js      # Scripts JavaScript
│   └── templates/
│       ├── base.html        # Template base
│       ├── login.html       # Página de login
│       ├── register.html    # Página de registro
│       ├── index.html       # Página inicial
│       └── dashboard.html   # Dashboard
├── run.py                   # Arquivo principal para executar o servidor
├── requirements.txt         # Dependências do projeto
├── .gitignore              # Arquivos ignorados pelo Git
└── README.md               # Este arquivo
```

## Instalação e Configuração

### 1. Clone ou baixe este template

```bash
cd ProjetoFinal
```

### 2. Crie um ambiente virtual Python

```bash
# No macOS/Linux:
python3 -m venv venv
source venv/bin/activate

# No Windows:
python -m venv venv
venv\Scripts\activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Execute a aplicação

```bash
python run.py
```

A aplicação estará disponível em: `http://localhost:5000`

## Criando o Primeiro Usuário

### Opção 1: Via Interface Web

1. Acesse `http://localhost:5000/auth/login`
2. Clique em "Cadastrar"
3. Preencha os dados do formulário
4. Faça login com suas credenciais

### Opção 2: Via Console Python (Recomendado para Admin)

```bash
python
```

```python
from app import create_app, db
from app.models.user import User

app = create_app()

with app.app_context():
    # Criar um novo usuário
    user = User(username='admin', email='admin@exemplo.com')
    user.set_password('senha123')
    
    db.session.add(user)
    db.session.commit()
    print(f'Usuário {user.username} criado com sucesso!')
```

Pressione `Ctrl+D` (macOS/Linux) ou `Ctrl+Z` (Windows) para sair.

## Funcionalidades de Autenticação

### Login

- Rota: `/auth/login`
- Valida credenciais contra o banco de dados
- Suporta "Lembrar-me"
- Redireciona para a página solicitada após login

### Registro

- Rota: `/auth/register`
- Validação de dados
- Verificação de usuário/email existente
- Hash seguro de senhas

### Logout

- Rota: `/auth/logout`
- Encerra a sessão do usuário
- Redireciona para a página de login

### Rotas Protegidas

- `/` - Página inicial (requer login)
- `/dashboard` - Dashboard (requer login)

## Personalizando o Template

### Alterando Cores e Estilos

Edite o arquivo `app/static/css/style.css` e modifique as variáveis CSS:

```css
:root {
    --primary-color: #4f46e5;  /* Cor principal */
    --secondary-color: #64748b; /* Cor secundária */
    /* ... outras variáveis */
}
```

### Adicionando Novas Rotas

1. Crie uma nova função em `app/routes/main.py`:

```python
@main_bp.route('/minha-pagina')
@login_required
def minha_pagina():
    return render_template('minha_pagina.html')
```

2. Crie o template `app/templates/minha_pagina.html`:

```html
{% extends "base.html" %}

{% block content %}
<div class="container">
    <h1>Minha Nova Página</h1>
</div>
{% endblock %}
```

### Adicionando Novos Modelos

Crie um novo arquivo em `app/models/`, por exemplo `produto.py`:

```python
from app import db
from datetime import datetime

class Produto(db.Model):
    __tablename__ = 'produtos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    preco = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Produto {self.nome}>'
```

Não esqueça de importar no `app/models/__init__.py`:

```python
from app.models.produto import Produto
```

## Banco de Dados

O projeto usa SQLite por padrão. O arquivo do banco de dados (`database.db`) é criado automaticamente ao executar a aplicação pela primeira vez.

### Resetar o Banco de Dados

Para resetar o banco de dados, delete o arquivo `database.db` e execute novamente a aplicação:

```bash
rm database.db  # No macOS/Linux
del database.db # No Windows
python run.py
```

### Migrações (Opcional)

Para projetos mais complexos, considere usar Flask-Migrate:

```bash
pip install Flask-Migrate
```

## Configurações Importantes

### Chave Secreta

**IMPORTANTE**: Antes de usar em produção, altere a `SECRET_KEY` em `app/__init__.py`:

```python
app.config['SECRET_KEY'] = 'sua-chave-super-secreta-e-aleatoria-aqui'
```

### Modo Debug

Em produção, certifique-se de desabilitar o modo debug em `run.py`:

```python
app.run(debug=False)
```

## Testando a Aplicação

1. Acesse `http://localhost:5000/auth/register`
2. Crie uma conta de teste
3. Faça login com as credenciais criadas
4. Explore as páginas protegidas (index, dashboard)
5. Teste o logout

## Recursos Adicionais

- [Documentação do Flask](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Flask-Login](https://flask-login.readthedocs.io/)

## Solução de Problemas

### Erro: "ModuleNotFoundError: No module named 'flask'"

Certifique-se de que o ambiente virtual está ativado e as dependências instaladas:

```bash
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

### Erro: "Attempted to access a database that does not exist"

Delete o arquivo `database.db` e reinicie a aplicação.

### Erro de importação circular

Certifique-se de que os imports estão na ordem correta e usando o factory pattern do Flask.

## Licença

Este template é livre para uso educacional. Sinta-se à vontade para modificá-lo conforme suas necessidades.
