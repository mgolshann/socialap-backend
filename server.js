const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const morgan = require('morgan');
const debugConfiguration = require("debug")("app:configuration")
const debugDB = require("debug")("app:Db");

// Routes
const ScreamRoutes = require("./routes/ScreamRoutes")
const UserRoutes = require("./routes/UserRoutes")


const Logger = require("./middleware/Logger");
const SaeedForbiddenAuth = require("./middleware/SaeedForbiddenAuth");
const app = express();

// built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

if (app.get("env") === "production")
  app.use(morgan('tiny'));

debugConfiguration("some configuration");

// db ...
debugDB("db initialized");

// third-party middleware
app.use(cors());


// my middleware
app.use(Logger);
app.use(SaeedForbiddenAuth);

//routes
app.use(UserRoutes);
app.use(ScreamRoutes);


// configuration
//console.log(config.get("databaseAddress"));

app.set("view engine", "pug");
app.set("views", "./views"); // default

mongoose
  .connect("mongodb://localhost:27017/screams", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("db connected");
  })
  .catch(err => {
    console.error("db not connected!!", err)
  })

const port = process.env.myPort || 3000;
app.listen(port, (err) => {
  if (err) console.log(err)
  else console.log(`app listen to port ${port}`);
});

