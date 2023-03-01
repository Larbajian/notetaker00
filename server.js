const express = require('express');
const path = require('path');
const api = require('./routes/index.js');
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('./helpers/fsUtils.js');


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
          note_id: uuidv4(),
      };

  readAndAppend(newNote, './db/notes.json');

  const response = {
      status: 'note posted!',
      body: newNote,
  };
  //res.json(response);
  res.sendFile(path.join(__dirname, '/public/notes.html'))
  } else {
  res.json('note was not posted')
}
  
});

//GET NOTES (API)
app.get('/api/notes', (req,res) => {
  readFromFile('./db/notes.json').then((data) =>
  res.json(JSON.parse(data))
  );
});

//DELETE NOTES (API)
app.delete('/:note_id', (req,res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/notes.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
          const notesArray = json.filter((note) => note.note_id !== noteId);
          writeToFile('./db/notes.json', notesArray);

          res.json(`Note with this id has been deleted.`);
      });


});
////////////////////////////////////////////////

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

module.exports = app;