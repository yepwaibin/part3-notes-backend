const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

const morgan = require("morgan");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
morgan.token("content", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  let date = new Date();
  res.send(
    `<div>phonebook has info for ${persons.length} people</div><div>${date}</div>`
  );
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) {
    res.status(404).json({
      error: "name missing",
    });
  } else if (!body.number) {
    res.status(404).json({
      error: "number missing",
    });
  } else {
    if (persons.find((person) => person.name === body.name)) {
      res.status(404).json({
        error: "the name already exists .name must be unique.",
      });
    } else {
      let person = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number,
      };
      persons = persons.concat(person);
      res.json(person);
    }
  }
});

app.listen(PORT, () => console.log(`server already start ${PORT}`));
