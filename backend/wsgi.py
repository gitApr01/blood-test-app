from app import create_app, db
from app.models import User
import os

app = create_app()

# Create database tables if they do not exist
with app.app_context():
    if not os.path.exists("instance/database.db"):
        db.create_all()
        # Create default admin user
        admin = User(username="admin", password="admin123", role="admin")
        db.session.add(admin)
        db.session.commit()
