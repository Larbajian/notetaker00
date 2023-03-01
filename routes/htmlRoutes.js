const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');

//GET notes for index.html
notes.get('/', (req,res) => {
    readFromFile('./db/notes.json').then((data) =>
    res.json(JSON.parse(data))
    );
});

//GET /notes for notes.html
notes.get("/notes", (req, res) => {
  readFromFile("./db/notes.json").then((data) => 
  res.json(JSON.parse(data))
  );
});

module.exports = notes;