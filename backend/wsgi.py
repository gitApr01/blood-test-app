from app import create_app, db
from app.models import User
from werkzeug.security import generate_password_hash
from sqlalchemy import select

app = create_app()

with app.app_context():
    # Create tables if missing
    db.create_all()

    # Check for admin
    existing = db.session.execute(
        select(User).where(User.username == "admin")
    ).first()

    # Create admin if missing
    if not existing:
        admin = User(
            username="admin",
            password=generate_password_hash("admin123"),
            role="admin"
        )
        db.session.add(admin)
        db.session.commit()
