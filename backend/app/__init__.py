from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Ensure instance folder exists (where SQLite DB lives)
    try:
        os.makedirs(os.path.join(app.root_path, "..", "instance"), exist_ok=True)
    except:
        pass

    # Database configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///../instance/database.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Enable CORS for all routes
    CORS(app)

    # Initialize database
    db.init_app(app)

    # Import and register routes
    from .routes import main
    app.register_blueprint(main)

    return app
