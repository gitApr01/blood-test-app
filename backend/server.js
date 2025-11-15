const express = require("express");
const cors = require("cors");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Session setup
app.use(
  session({
    store: new SQLiteStore({
      db: "sessions.sqlite",
      dir: "./",
    }),
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);

// Authentication middleware
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
}

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, user) => {
      if (err) return res.status(500).json({ error: err });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      if (user.password === password) {
        req.session.user = { id: user.id, username: user.username, role: user.role };
        return res.json({ message: "Logged in", user: req.session.user });
      } else {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    }
  );
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

// Add test
app.post("/tests", requireLogin, (req, res) => {
  const {
    patient_name, age, sex, tests,
    total, advance, paid_to,
    collected_by, test_by, delivery_status
  } = req.body;

  const due = total - advance;

  db.run(
    `
    INSERT INTO tests (
      patient_name, age, sex, tests,
      total, advance, due,
      paid_to, collected_by, test_by,
      delivery_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      patient_name,
      age,
      sex,
      JSON.stringify(tests),
      total,
      advance,
      due,
      paid_to,
      collected_by,
      test_by,
      delivery_status || "Not Delivered"
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: this.lastID });
    }
  );
});

// Get all tests
app.get("/tests", requireLogin, (req, res) => {
  db.all(
    "SELECT * FROM tests ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      rows = rows.map(r => ({
        ...r,
        tests: JSON.parse(r.tests)
      }));
      res.json(rows);
    }
  );
});

// Get one test
app.get("/tests/:id", requireLogin, (req, res) => {
  db.get(
    "SELECT * FROM tests WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err });
      if (!row) return res.status(404).json({ error: "Not found" });

      row.tests = JSON.parse(row.tests);
      res.json(row);
    }
  );
});

// Update test
app.put("/tests/:id", requireLogin, (req, res) => {
  const fields = [
    "patient_name","age","sex","tests","total",
    "advance","due","paid_to","collected_by",
    "test_by","delivery_status"
  ];

  let updates = [];
  let values = [];

  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = ?`);
      values.push(f === "tests" ? JSON.stringify(req.body[f]) : req.body[f]);
    }
  });

  values.push(req.params.id);

  db.run(
    `UPDATE tests SET ${updates.join(", ")} WHERE id = ?`,
    values,
    function (err) {
      if (err) return res.status(500).json({ error: err });
      res.json({ updated: true });
    }
  );
});

// Delete
app.delete("/tests/:id", requireLogin, (req, res) => {
  db.run(
    "DELETE FROM tests WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err });
      res.json({ deleted: true });
    }
  );
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
