const express = require("express");
const fs = require("fs");
const app = express();
app.use("/assets", express.static("public/assets"));
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/notes", function (req, res) {
  res.sendFile(__dirname + "/public/notes.html");
});

app.get("/api/notes", function (req, res) {
  readDatabase((db) => res.json(db));
});

app.post("/api/notes", function (req, res) {
  readDatabase(function (db) {
    console.log(req.body);
    db.push(req.body);
    fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(db), "utf8");
    res.json(db);
  });
});

//To delete the saved notes
app.delete("/api/notes/:id", function (req, res) {
  console.log(req.params.id);
  //logic here to remove index = params.id in the db array, adn then save db with fs.writefile
  readDatabase((data) => {
    data.splice(req.params.id, 1);
    fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(data), "utf8");
    res.json("ok");
  });
});
function readDatabase(cb) {
  const db = JSON.parse(fs.readFileSync(__dirname + "/db/db.json", "utf8"));
  cb(db);
}

app.listen(process.env.PORT, () => {
  console.log("localhost: http://localhost:3000");
});
