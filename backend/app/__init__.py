from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # SQLite config — stored in instance folder
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = "yoursecretkey"

    db.init_app(app)

    # Import models so tables register
    from app import models

    # Register routes
    from app.routes import main
    app.register_blueprint(main)

    return app
