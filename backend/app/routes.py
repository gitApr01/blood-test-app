from flask import Blueprint, request, jsonify
from datetime import datetime
from app import db
from app.models import User, Patient, TestReport, TestCatalog
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy import func

main = Blueprint("main", __name__)


# -------------------- USER LOGIN --------------------
@main.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get("username")).first()

    if not user or not check_password_hash(user.password, data.get("password")):
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    return jsonify({
        "success": True,
        "username": user.username,
        "id": user.id,
        "role": user.role
    })


@main.route("/logout", methods=["POST"])
def logout():
    return jsonify({"success": True})


@main.route("/me")
def me():
    return jsonify({"user": None})


# -------------------- GET USERS --------------------
@main.route("/users")
def users():
    data = User.query.all()
    return jsonify([
        {"id": u.id, "username": u.username, "role": u.role}
        for u in data
    ])


# -------------------- TEST CATALOG GET --------------------
@main.route("/tests_catalog")
def tests_catalog():
    data = TestCatalog.query.order_by(TestCatalog.name.asc()).all()
    return jsonify([
        {"id": t.id, "name": t.name, "price": t.price}
        for t in data
    ])


# -------------------- TEST CATALOG SAVE --------------------
@main.route("/tests_catalog", methods=["POST"])
def tests_catalog_save():
    items = request.json.get("tests", [])

    # Clear catalog
    TestCatalog.query.delete()
    db.session.commit()

    for it in items:
        row = TestCatalog(name=it["name"], price=float(it["price"]))
        db.session.add(row)

    db.session.commit()
    return jsonify({"success": True})


# -------------------- ADD PATIENT + TEST --------------------
@main.route("/add_test", methods=["POST"])
def add_test():
    data = request.json

    # Create patient
    patient = Patient(
        name=data["patient_name"],
        age=data["age"],
        sex=data["sex"]
    )
    db.session.add(patient)
    db.session.commit()

    # Parse date
    date_str = data.get("date")
    created_date = datetime.strptime(date_str, "%Y-%m-%d") if date_str else datetime.utcnow()

    tests = data.get("tests", [])
    total = sum(float(t["price"]) for t in tests)
    advance = float(data.get("advance", 0))
    due = total - advance

    commission_due = round(total * 0.40, 2)

    report = TestReport(
        patient_id=patient.id,
        tests_json=tests,
        total=total,
        advance=advance,
        due=due,
        paid_to=data.get("paid_to", ""),
        collected_by=data.get("collected_by"),
        created_by=data.get("created_by"),
        test_by=data.get("test_by", ""),
        created_at=created_date,
        commission_due=commission_due,
        commission_paid=0.0,
        delivery_status="Not Delivered"
    )

    db.session.add(report)
    db.session.commit()

    return jsonify({"success": True})


# -------------------- GET ALL TESTS + FILTERS --------------------
@main.route("/all_tests")
def all_tests():
    q = request.args.get("q", "")
    status = request.args.get("status", "")
    test_by = request.args.get("test_by", "")
    collected_by = request.args.get("collected_by", "")
    sort = request.args.get("sort", "")
    from_date = request.args.get("from_date", "")
    to_date = request.args.get("to_date", "")

    query = TestReport.query.join(Patient)

    if q:
        query = query.filter(Patient.name.ilike(f"%{q}%"))

    if status:
        query = query.filter(TestReport.delivery_status == status)

    if test_by:
        query = query.filter(TestReport.test_by.ilike(f"%{test_by}%"))

    if collected_by:
        try:
            cid = int(collected_by)
            query = query.filter(TestReport.collected_by == cid)
        except:
            pass

    # Date Range
    if from_date:
        try:
            fd = datetime.strptime(from_date, "%Y-%m-%d")
            query = query.filter(TestReport.created_at >= fd)
        except:
            pass

    if to_date:
        try:
            td = datetime.strptime(to_date, "%Y-%m-%d")
            td = td.replace(hour=23, minute=59, second=59)
            query = query.filter(TestReport.created_at <= td)
        except:
            pass

    # Sorting
    if sort == "date_asc":
        query = query.order_by(TestReport.created_at.asc())
    elif sort == "name_asc":
        query = query.order_by(Patient.name.asc())
    elif sort == "name_desc":
        query = query.order_by(Patient.name.desc())
    elif sort == "lab_asc":
        query = query.order_by(TestReport.test_by.asc())
    else:
        query = query.order_by(TestReport.created_at.desc())

    rows = query.all()

    result = []
    for r in rows:
        result.append({
            "id": r.id,
            "patient_name": r.patient.name,
            "age": r.patient.age,
            "sex": r.patient.sex,
            "tests": r.tests_json,
            "total": r.total,
            "advance": r.advance,
            "due": r.due,
            "commission_due": r.commission_due,
            "commission_paid": r.commission_paid,
            "paid_to": r.paid_to,
            "collected_by": r.collected_by,
            "test_by": r.test_by,
            "delivery_status": r.delivery_status,
            "created_at": r.created_at.isoformat()
        })

    return jsonify(result)


# -------------------- UPDATE DELIVERY STATUS --------------------
@main.route("/update_status/<int:id>", methods=["PUT"])
def update_status(id):
    data = request.json
    row = TestReport.query.get(id)
    if not row:
        return jsonify({"success": False}), 404

    row.delivery_status = data.get("status")
    db.session.commit()
    return jsonify({"success": True})


# -------------------- UPDATE COMMISSION PAID --------------------
@main.route("/update_commission/<int:id>", methods=["PUT"])
def update_commission(id):
    data = request.json
    row = TestReport.query.get(id)
    if not row:
        return jsonify({"success": False}), 404

    row.commission_paid = float(data.get("commission_paid", 0))
    db.session.commit()
    return jsonify({"success": True})
