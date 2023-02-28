const express = require("express");
const fs = require("fs");
const app = express();
const notes = require('./db/db.json');
const uuid = require('./utils/uuid');
const util = require('util');

// routes //

const apiRoutes = require("./routes/index.js");
const htmlRoutes = require('./routes/notes.js');

// setup port //

const PORT = process.env.PORT || 3001;

// middleware //

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

//GET
//homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//notes page
app.get('/notes', (req,res) =>
res.sendFile(path.join(__dirname, '/public/notes.html'))
);

const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
err ? console.error(err) : console.info(`\nData written to ${destination}`)
);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

app.get('/api/notes', (req,res) => {
  readFromFile('./db/db.json').then((data => res.json(JSON.parse(data))));
})

app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title, 
      text,
      review_id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(`Note added successfully 🚀`);
  } else {
    res.json('Error in adding note');
  }
});

////////////////////////////////////////////////

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

module.exports = app;