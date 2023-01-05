const path = require("path");
const fs = require("fs");
const app = require("./server");
const uniqid = require("uniqid");

module.exports = function (app) {
  app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "../db/db.json"));
  });

  app.post("/api/notes", (req, res) => {
    let db = fs.readFileSync("db/db.json");
    db = JSON.parse(db);
    res.json(db);
    //note 'body'
    let userNote = {   
        id: uniqid(),
        title: req.body.title,
        text: req.body.text,
    };
    //.push userNote to db.json file
    db.push(userNote);
    fs.writeFileSync("db/db.json", JSON.stringify(db));
    res.json(db);
  });
};
