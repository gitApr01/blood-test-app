const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("render.com")
        ? { rejectUnauthorized: false }
        : false
});

app.use(
    session({
        store: new pgSession({
            pool: pool,
            tableName: "session_store",
        }),
        secret: process.env.SESSION_SECRET || "supersecret",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
    })
);

function requireLogin(req, res, next) {
    if (!req.session.user) return res.status(401).json({ error: "Not logged in" });
    next();
}

async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user'
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS tests (
            id SERIAL PRIMARY KEY,
            patient_name TEXT,
            age INT,
            sex TEXT,
            tests TEXT[],
            total NUMERIC,
            advance NUMERIC,
            due NUMERIC,
            paid_to TEXT,
            collected_by TEXT,
            test_by TEXT,
            delivery_status TEXT DEFAULT 'Not Delivered',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `);

    const adminUser = process.env.ADMIN_USER || "admin";
    const adminPass = process.env.ADMIN_PASS || "admin123";

    const check = await pool.query("SELECT * FROM users WHERE username=$1", [adminUser]);

    if (check.rows.length === 0) {
        const hash = await bcrypt.hash(adminPass, 10);
        await pool.query(
            "INSERT INTO users (username, password, role) VALUES ($1, $2, 'admin')",
            [adminUser, hash]
        );
        console.log("Admin created:", adminUser, adminPass);
    }
}

initDB();

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    if (user.rows.length === 0)
        return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.rows[0].password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    req.session.user = {
        id: user.rows[0].id,
        username,
        role: user.rows[0].role
    };

    res.json({ message: "Logged in", user: req.session.user });
});

// Logout
app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out" });
    });
});

// Add test
app.post("/tests", requireLogin, async (req, res) => {
    const {
        patient_name,
        age,
        sex,
        tests,
        total,
        advance,
        paid_to,
        collected_by,
        test_by,
        delivery_status
    } = req.body;

    const due = total - advance;

    const result = await pool.query(
        `INSERT INTO tests (
            patient_name, age, sex, tests, total, advance, due,
            paid_to, collected_by, test_by, delivery_status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *`,
        [
            patient_name,
            age,
            sex,
            tests,
            total,
            advance,
            due,
            paid_to,
            collected_by,
            test_by,
            delivery_status || "Not Delivered"
        ]
    );

    res.json(result.rows[0]);
});

// Get all
app.get("/tests", requireLogin, async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM tests ORDER BY created_at DESC"
    );
    res.json(result.rows);
});

// Get one
app.get("/tests/:id", requireLogin, async (req, res) => {
    const result = await pool.query("SELECT * FROM tests WHERE id=$1", [
        req.params.id
    ]);
    res.json(result.rows[0]);
});

// Update
app.put("/tests/:id", requireLogin, async (req, res) => {
    const fields = [
        "patient_name",
        "age",
        "sex",
        "tests",
        "total",
        "advance",
        "due",
        "paid_to",
        "collected_by",
        "test_by",
        "delivery_status"
    ];

    let updates = [];
    let values = [];

    fields.forEach((f) => {
        if (req.body[f] !== undefined) {
            updates.push(`${f}=$${updates.length + 1}`);
            values.push(req.body[f]);
        }
    });

    values.push(req.params.id);

    const result = await pool.query(
        `UPDATE tests SET ${updates.join(", ")}, updated_at=NOW()
         WHERE id=$${values.length} RETURNING *`,
        values
    );

    res.json(result.rows[0]);
});

// Delete
app.delete("/tests/:id", requireLogin, async (req, res) => {
    await pool.query("DELETE FROM tests WHERE id=$1", [req.params.id]);
    res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
