var createError = require("http-errors");
var express = require("express");
var path = require("path");
const fs = require("fs");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const hbs = require("handlebars");

var indexRouter = require("./routes/index");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var cors = require("cors");
let corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(cors(corsOptions));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//register partials for email_templates
// hbs.registerPartial("layout", fs.readFileSync(__dirname + "/views/layout.hbs"));

// error handler
app.use(function (err, req, res, next) {
  if (err.status == 500) {
    err = "Something went wrong please try again";
  }
  if (err.status == 400) {
    err = {};
    err.message = "Request malformed";
    err.status = 400;
  }
  res
    .status(err.status || 500)
    .json({ status: false, message: err.message, errors: err });
});

module.exports = app;
