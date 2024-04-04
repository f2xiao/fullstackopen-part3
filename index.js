const express = require("express");
const cors = require("cors");
const app = express();

const { v4: uuidv4 } = require("uuid");

const requestLogger = (request, response, next) => {
  console.log(`Method: `, request.method);
  console.log(`Path: `, request.path);
  console.log(`Body: `, request.body);
  console.log(`------------------------------`);
  next();
};

// cors middleware
app.use(cors());
// middleware for static content
app.use(express.static("dist"));
// json-parser middleware to parse request.body
app.use(express.json());
// requestLogger middleware
app.use(requestLogger);

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("Hello from express");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.post("/api/notes", (request, response) => {
  const uniqueId = uuidv4();
  const { content, important } = request.body;

  console.log(uniqueId, typeof uniqueId);

  if (!content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const newNote = {
    id: uniqueId,
    content,
    important: important || false,
  };

  notes = [newNote, ...notes];
  console.log(notes);

  response.json(newNote);
});

app.get("/api/notes/:id", (request, response) => {
  //   get the id and find the id in the array
  const { id } = request.params;
  //   console.log(id, typeof id);

  const returnedNote = notes.find((note) => note.id === id);
  if (returnedNote) {
    response.json(returnedNote);
  } else {
    response.status(404).json({
      error: "note is not found",
    });
  }
});

app.delete("/api/notes/:id", (request, response) => {
  //   get the id and find the id in the array
  const { id } = request.params;
  //   console.log(id, typeof id);

  const returnedNote = notes.find((note) => note.id === id);
  if (returnedNote) {
    notes = notes.filter((note) => note.id !== returnedNote.id);
    response.status(204).end();
  } else {
    response.status(404).json({
      error: "note is not found",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`the sever starts on port ${PORT} `);
});
