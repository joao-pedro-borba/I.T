from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os

# Inicializar as extensões do Flask
# SQLAlchemy para gerenciamento do banco de dados
db = SQLAlchemy()
# LoginManager para gerenciamento de sessões de usuários
login_manager = LoginManager()

def create_app():
    """
    Factory function para criar e configurar a aplicação Flask.
    Este padrão permite criar múltiplas instâncias da aplicação com diferentes configurações.
    
    Returns:
        app: Instância configurada da aplicação Flask
    """
    # Criar a instância da aplicação Flask
    app = Flask(__name__)
    
    # Configurações da aplicação
    # SECRET_KEY: Chave secreta para criptografia de sessões (MUDE EM PRODUÇÃO!)
    app.config['SECRET_KEY'] = 'sua-chave-secreta-aqui-mude-em-producao'
    # SQLALCHEMY_DATABASE_URI: Localização do banco de dados SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    # SQLALCHEMY_TRACK_MODIFICATIONS: Desabilitar rastreamento de modificações (economia de memória)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializar as extensões com a instância da aplicação
    db.init_app(app)
    login_manager.init_app(app)
    
    # Configurar o comportamento do LoginManager
    # login_view: Rota para redirecionar usuários não autenticados
    login_manager.login_view = 'auth.login'
    # login_message: Mensagem exibida quando usuário tenta acessar rota protegida
    login_manager.login_message = 'Por favor, faça login para acessar esta página.'
    # login_message_category: Categoria da mensagem flash (usado para estilização)
    login_manager.login_message_category = 'info'
    
    # Registrar blueprints (módulos) da aplicação
    # Blueprints permitem organizar a aplicação em componentes modulares
    from app.routes.auth import auth_bp
    from app.routes.main import main_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    
    # Criar todas as tabelas no banco de dados se ainda não existirem
    # app_context() garante que temos acesso ao contexto da aplicação
    with app.app_context():
        db.create_all()
    
    return app
