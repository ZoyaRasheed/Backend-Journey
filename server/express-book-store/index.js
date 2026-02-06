import express from "express";

const app = express();

const books = [
  { id: 1, bookName: "CS", author: "zoya" },
  { id: 2, bookName: "Networking", author: "Manish" },
];

app.get("/", (req, res) => {
  res.end("helllllow");
});
app.get("/books", (req, res) => {
  //we can sent the custome response headers too ( can start with x-)
  res.setHeader("x-mine", "zoya");
  res.json(books);
});

// we can have the dynamic data in request too

app.get("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Hey its a bad request , send a number" });
  }
  const book = books.find((e) => e.id == id);
  if (!book)
    return res.status(404).json({ error: ` Book with id ${id} doesn't exist` });

  return res.status(200).json(book);
});
app.listen(3000, () => {
  console.log("Server is running");
});
