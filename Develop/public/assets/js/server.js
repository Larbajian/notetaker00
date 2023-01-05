const express = require("express");
const path = require("path");

//for expressapp
const app = express();
const PORT = process.env.PORT || 3001;

//parsing data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

require("./routes/apiroutes")(app);
require("./routes/htmlroutes")(app);

app.listen(PORT, function() {
  console.log("App listening to: " + PORT);
});

module.exports = app;