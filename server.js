const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const csv = require("fast-csv");
var multer = require("multer");
app.use(express.static(__dirname + "/public/views"));
app.set("view engine", "ejs");

var storage = multer.diskStorage({
  destination: "./public/data/uploads/",
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

var uploadFile = multer({ storage: storage });

app.get("/", function (req, res) {
  res.render("index");
});

app.post(
  "/uploadCSV",
  uploadFile.single("csvFiles"),
  function (req, res, next) {
    fs.createReadStream(
      path.resolve(__dirname, "./public/data/uploads/", req.file.filename)
    )
      .pipe(
        csv.parse({
          headers: [req.body.first, req.body.last, req.body.email],
        })
      )
      .on("error", (error) => console.error(error))
      .on("data", (row) => console.log(row))
      .on("end", (rowCount) => console.log(`Parsed ${rowCount} rows`));

    res.send("Success");
  }
);
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log("Server is listening on: ", port);
});
