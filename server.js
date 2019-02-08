const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const routes = require("./routes");
const app = express();
const db = require('./models');

// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

// Define API routes here
app.use(routes)

// Set up sql database connection

// .then(() => console.log("🥞 ==> Database connection established!"))
//     .catch(err => console.log(err))


app.listen(PORT, function () {
    console.log(`🌎 ==> Server now on port ${PORT}!`);
});

