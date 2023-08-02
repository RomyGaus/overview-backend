const express = require("express");
const app = express();
// const db = require("./database.js");

app.use(express.json());

const HTTP_PORT = 3000;

app.get("/", (req, res) => {
    res.json({ message: "OK" });
});

app.get("/todo", (req, res) => {
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




app.use((req, res) => {
    res.status(404).json({
      message: "Ohh you are lost, read the API documentation to find your way!",
    });
});

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});
