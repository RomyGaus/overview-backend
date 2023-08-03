const express = require("express");
const app = express();
const db = require("./database.js");

app.use(express.json());

const HTTP_PORT = 3000;

// READ
app.get("/", (req, res) => {
    res.json({ message: "OK" });
});

app.get("/stocks", (req, res) => {
    let sql = "SELECT * FROM stocks";
    let params = [];
  
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: "success",
        data: rows,
      });
    });
});

app.get("/stocks/:id", (req, res) => {
  let sql = "SELECT * FROM stocks WHERE id = ?";
  let params = [req.params.id];

  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

//CREATE
app.post("/stocks", (req, res) => {
  let errors = [];

  if (!req.body.name) {
    errors.push("No name specified");
  }

  if (errors.length) {
    res.status(400).json({
      error: errors,
    });
  }

  let data = {
    name: req.body.name,
    amount: req.body.amount,
    target: req.body.target,
    updated: Date.now(),
  };

  let sql =
    "INSERT INTO stocks (name, amount, target, updated) VALUES (?,?,?,?)";

  let params = [data.name, data.amount, data.target, data.updated];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
  
    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});

//UPDATE
app.patch("/stocks/:id", (req, res) => {
  let data = {
    name: req.body.name,
    amount: req.body.amount,
    target: req.body.target,
    updated: Date.now(),
  };

  let sql = `UPDATE stocks SET
    name = COALESCE(?, name),
    amount = ?,
    target = ?,
    updated = ?
    WHERE id = ?`;

  let params = [
    data.name,
    data.amount,
    data.target,
    data.updated,
    req.params.id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: data,
      changes: this.changes,
    });
  });
});

//DELETE
app.delete("/stocks/:id", (req, res) => {
  let sql = "DELETE FROM stocks WHERE id = ?";
  let params = [req.params.id];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({ message: "success", changes: this.changes });
  });
});


app.use((req, res) => {
    res.status(404).json({
      message: "Ohh you are lost, read the API documentation to find your way!",
    });
});

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});
