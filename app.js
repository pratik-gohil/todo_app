const express = require("express");
const mongoose = require("mongoose");
const Todo = require("./models/todos");

const uri = process.env.URI;
mongoose
  .connect(uri)
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log(err));

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  Todo.find()
    .sort({ createdAd: -1 })
    .then((todos) => {
      res.render("index", { title: "Todos", todos });
    });
});

app.get("/todos", (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send(todos);
    })
    .catch((err) => console.log(err));
});

app.post("/todo", (req, res) => {
  const todo = new Todo(req.body);

  todo
    .save()
    .then((result) => res.redirect("/"))
    .catch((err) => console.log(err));
});

app.delete("/todo/:id", (req, res) => {
  const id = req.params.id;

  Todo.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/" });
    })
    .catch((err) => console.log(err));
});

app.use((req, res) => {
  res.render("404", { title: "Page Not Found" });
});
