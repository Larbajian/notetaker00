const express = require('express');
const path = require('path');
const { readAndAppend, readFromFile, writeToFile } = require('./helpers/fsUtils.js');
const fs = require('fs');
const uniqid = require('uniqid');
let noteData = fs.readFileSync('./db/notes.json');

let db = JSON.parse(noteData);


// setup port //
const PORT = process.env.PORT || 3001;

const app = express();

// middleware //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//GET
//notes for index.html
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//notes for notes.html
app.get('/notes', (req,res) =>
res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//POST NOTES (API)
app.post('/api/notes', (req,res) =>{
  const { title, text } = req.body;

  if (title && text) {
      const newNote = {
          title,
          text,
          id : uniqid()
      };
  db.push(newNote);
  res.json(newNote);
    } else {
  res.json('note was not posted');
}
  
});

//GET NOTES (API)
app.get('/api/notes', (req,res) => {
res.json(db);
});

//DELETE NOTES (API)
app.delete("/api/notes/:id", (req, res) => {
  const noteToDelete = req.params.id;

  const notesArray = db.filter((note) => note.id !== noteToDelete);
  db = notesArray; 
  fs.writeFile("./db/notes.json", JSON.stringify(db), (err) => {
    err ? console.log('error') : console.log('deleted');
  });
  res.json(notesArray);
  });


////////////////////////////////////////////////

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

module.exports = app;