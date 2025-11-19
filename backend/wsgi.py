from app import create_app, db
from app.models import User
from sqlalchemy import select

app = create_app()

# Ensure database and admin user exist
with app.app_context():

    # Create tables if missing
    db.create_all()

    # Check if admin exists
    existing = db.session.execute(
        select(User).where(User.username == "admin")
    ).first()

    # Create admin if missing
    if not existing:
        admin = User(username="admin", password="admin123", role="admin")
        db.session.add(admin)
        db.session.commit()
