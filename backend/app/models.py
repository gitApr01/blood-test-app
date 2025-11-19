from app import db
from datetime import datetime
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.dialects.sqlite import JSON

# User table (admin + normal users)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default="user")  # admin/user

    def __repr__(self):
        return f"<User {self.username}>"


# Test catalog table (test name + price)
class TestCatalog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), unique=True)
    price = db.Column(db.Float)

    def __repr__(self):
        return f"<Test {self.name}>"


# Patient table
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    age = db.Column(db.Integer)
    sex = db.Column(db.String(10))

    tests = db.relationship("TestReport", backref="patient", lazy=True)


# Test Report table
class TestReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    patient_id = db.Column(db.Integer, db.ForeignKey("patient.id"), nullable=False)

    tests_json = db.Column(JSON, default=list)   # list of {name, price}
    total = db.Column(db.Float)
    advance = db.Column(db.Float)
    due = db.Column(db.Float)

    paid_to = db.Column(db.String(100))
    collected_by = db.Column(db.Integer, db.ForeignKey("user.id"))
    created_by = db.Column(db.Integer)

    test_by = db.Column(db.String(200))
    delivery_status = db.Column(db.String(30), default="Not Delivered")

    commission_due = db.Column(db.Float, default=0.0)
    commission_paid = db.Column(db.Float, default=0.0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<TestReport {self.id}>"
