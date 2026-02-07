import { books } from "../models/books.model.js";

export default {
  // we can have the dynamic data in request too
  getbooks: (req, res) => {
    //we can sent the custome response headers too ( can start with x-)
    res.setHeader("x-mine", "zoya");
    res.json(books);
  },

  // we can have the dynamic data in request too
  getBookById: (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "Hey its a bad request , send a number" });
    }
    const book = books.find((e) => e.id == id);
    if (!book)
      return res
        .status(404)
        .json({ error: `Book with id ${id} doesn't exist` });

    return res.status(200).json(book);
  },

  // we can add books too using post request
  addBook: (req, res) => {
    const { bookName, author } = req.body;

    if (!bookName || bookName.trim() == "") {
      return res.status(401).json({ error: "Please provide Bookname" });
    }
    if (!author || author.trim() == "") {
      return res.status(401).json({ error: "Please provide author" });
    }
    const id = books.length + 1;
    const book = { id: id, bookName, author };
    books.push(book);
    return res
      .status(401)
      .json({ message: ` Book with this id ${id} is created ` });
  },

  // now we can delete books too
  deleteBookById: (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "Hey its a bad request , send an Id " });
    }
    //findIndex return us either 1 if found the item and -1 if not found the item
    const indextoDelete = books.findIndex((e) => e.id == id);
    if (indextoDelete < 0) {
      return res
        .status(404)
        .json({ error: `Book with id ${id} doesn't exist` });
    }
    books.splice(indextoDelete, 1);

    return res
      .status(200)
      .json({ message: `Hey the book with id ${id} is deleted ` });
  },
};
