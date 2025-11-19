from app import create_app, db
from app.models import User, TestCatalog
from werkzeug.security import generate_password_hash
from sqlalchemy import select

app = create_app()

with app.app_context():
    db.create_all()

    # Admin user
    admin = db.session.execute(select(User).where(User.username == "admin")).first()
    if not admin:
        user = User(
            username="admin",
            password=generate_password_hash("admin123"),
            role="admin"
        )
        db.session.add(user)
        db.session.commit()

    # Load default catalog if empty
    if TestCatalog.query.count() == 0:
        default_tests = [
            ("TC", 150), ("DC", 150), ("ESR", 120), ("Hb%", 120),
            ("BSR", 100), ("BSF", 100), ("BSPP", 120), ("LFT", 600),
            ("LIPID PROFILE", 600), ("UREA", 150), ("CREATININE", 150),
            ("CALCIUM", 250), ("FSH", 450), ("RA FACTOR", 350),
            ("CRP", 350), ("ASO", 350)
        ]
        for name, price in default_tests:
            db.session.add(TestCatalog(name=name, price=price))
        db.session.commit()
