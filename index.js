require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Phone = require("./phone.js");
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

app.get("/api/persons", (req, res) => {
  Phone.find({}).then((phones) => {
    console.log(phones);
    res.json(phones);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  // const searchById = req.params.id;
  Phone.findById(req.params.id)
    .then((phones) => {
      if (phones) {
        res.json(phones);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/info", (req, res) => {
  let date = new Date();
  Phone.find({}).then((phones) =>
    res.send(
      `<div>phonebook has info for ${phones.length} people</div><div>${date}</div>`
    )
  );
});

app.delete("/api/persons/:id", (req, res, next) => {
  Phone.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
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
    const phone = new Phone({
      name: body.name,
      number: body.number,
    });
    phone.save().then((phoneSaved) => {
      console.log("phone saved");
      // mongoose.connection.close();
      res.json(phoneSaved);
    });
  }
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const phone = {
    name: body.name,
    number: body.number,
  };
  Phone.findByIdAndUpdate(req.params.id, phone, { new: true })
    .then((updatePhone) => res.json(updatePhone))
    .catch((err) => next(err));
});

const errorHandle = (err, req, res, next) => {
  console.error(err.message);
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).send({ error: "malformatted id" });
  }
  next(err);
};
app.use(errorHandle);
app.listen(PORT, () => console.log(`server already start ${PORT}`));
