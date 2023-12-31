const express = require("express");
const cors = require("cors");
const db = require("./database.js");

const app = express();
app.use(cors({
  methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"]
}))
app.use(express.json());

const HTTP_PORT = 8000;

// READ
app.get("/", (req, res) => {
    res.json({ message: "OK" });
});

//Read all
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


//Read one
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

//Read only where amount < target
app.get("/shoppinglist", (req, res) => {
  let sql = "SELECT * FROM stocks WHERE amount < target";
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

//CREATE
app.post("/stocks", (req, res) => {
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
  let data = req.body;

  if (Object.keys(data).length === 0) {
    res.status(400).json({ error: "No values to update."});
      return;
  }

  data["updated"] = Date.now();
  
  let sql = `UPDATE stocks SET`;
  const params = [];
  Object.entries(data).forEach(([key, value]) => {
      sql += ` ${key}=?,`;
      params.push(value);
  });
  sql = sql.slice(0, -1);
  sql += ' WHERE id=?;';
  params.push(req.params.id);

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
