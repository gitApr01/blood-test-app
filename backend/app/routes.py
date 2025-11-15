from flask import Blueprint, request, jsonify
from flask import current_app
from app import db
from app.models import User, Patient, TestReport
from werkzeug.security import generate_password_hash, check_password_hash

main = Blueprint("main", __name__)

# -------------------- USER LOGIN --------------------
@main.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    return jsonify({
        "success": True,
        "username": user.username,
        "role": user.role
    })


# -------------------- ADD PATIENT + TEST --------------------
@main.route("/add_test", methods=["POST"])
def add_test():
    data = request.json

    # (1) Create patient
    patient = Patient(
        name=data["patient_name"],
        age=data["age"],
        sex=data["sex"]
    )
    db.session.add(patient)
    db.session.commit()

    # (2) Create test report
    report = TestReport(
        patient_id=patient.id,
        tests_selected=",".join(data["tests"]),
        total=data["total"],
        advance=data["advance"],
        due=data["due"],
        paid_to=data["paid_to"],
        collected_by=data["collected_by"],
        test_by=data["test_by"],
        delivery_status="Not Delivered"
    )

    db.session.add(report)
    db.session.commit()

    return jsonify({"success": True, "message": "Test created"})


# -------------------- GET ALL TESTS --------------------
@main.route("/all_tests", methods=["GET"])
def all_tests():
    reports = TestReport.query.order_by(TestReport.created_at.desc()).all()

    result = []
    for r in reports:
        result.append({
            "id": r.id,
            "patient_name": r.patient.name,
            "age": r.patient.age,
            "sex": r.patient.sex,
            "tests": r.tests_selected.split(","),
            "total": r.total,
            "advance": r.advance,
            "due": r.due,
            "paid_to": r.paid_to,
            "collected_by": r.collected_by,
            "test_by": r.test_by,
            "delivery_status": r.delivery_status,
            "created_at": r.created_at
        })

    return jsonify(result)


# -------------------- UPDATE DELIVERY STATUS --------------------
@main.route("/update_status/<int:id>", methods=["PUT"])
def update_status(id):
    data = request.json
    report = TestReport.query.get(id)

    if not report:
        return jsonify({"success": False, "message": "Not found"}), 404

    report.delivery_status = data["status"]
    db.session.commit()

    return jsonify({"success": True, "message": "Updated"})


# -------------------- EDIT TEST (allowed for all users) --------------------
@main.route("/edit_test/<int:id>", methods=["PUT"])
def edit_test(id):
    data = request.json
    report = TestReport.query.get(id)

    if not report:
        return jsonify({"success": False, "message": "Test not found"}), 404

    report.tests_selected = ",".join(data["tests"])
    report.total = data["total"]
    report.advance = data["advance"]
    report.due = data["due"]
    report.paid_to = data["paid_to"]
    report.collected_by = data["collected_by"]
    report.test_by = data["test_by"]

    db.session.commit()
    return jsonify({"success": True, "message": "Updated"})
