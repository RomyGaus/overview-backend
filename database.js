const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("stocks.db", (err) => {
  if (err) {
    throw err;
  }

  console.log("Connected to the SQLite database.");

  db.run(
    `CREATE TABLE stocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount INTEGER,
      target-amount INTEGER,
      updated INTEGER
    )`,
    (err) => {
      if (err) {
        return;
      }

      var insert =
        "INSERT INTO stocks (name, amount, target-amount, updated) VALUES (?,?,?,?)";

      db.run(insert, [
        "spaghetti",
        2,
        2,
        Date.now(),
      ]);
      db.run(insert, [
        "flour",
        1,
        2,
        Date.now(),
      ]);
    }
  );
});

module.exports = db;