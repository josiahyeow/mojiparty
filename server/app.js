const bodyParser = require("body-parser");
const cors = require("cors");
const createError = require("http-errors");
const express = require("express");
const http = require("http");
const path = require("path");
require("./firebase");
const roomRouter = require("./routes/room");
const { fetchEmojis } = require("./data/emoji-set");
const Rooms = require("./actions/rooms");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);

// Fetch emoji data from Google Sheets
const fetchEmojisFromGoogleSheets = async (req, res, next) => {
  try {
    const emojis = await fetchEmojis();
    Rooms.setEmojis(emojis);
  } catch (e) {
    console.error(
      `Could not fetch emoji sets from Google Sheets. ${e.message}`
    );
  }
};

// Socket IO
require("./socket").listen(server);

// Create, join room routes
app.use("/room", roomRouter);

app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Error handling
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({
    error: err,
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
  fetchEmojisFromGoogleSheets();
});
