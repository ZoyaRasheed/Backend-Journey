import http from "node:http";
import fs from "fs";

const server = http.createServer((req, res) => {
  //db.....
  const method = req.method;
  const path = req.url;

  const log = `${Date.now()} ${method} ${path}\n`;
  fs.appendFileSync("log.txt", log, "utf-8");

  switch (method) {
    case "GET":
      switch (path) {
        case "/":
          res.writeHead(200);
          return res.end("Hey this is Homepage");

        case "/contact":
          res.writeHead(200);
          return res.end("Hey this is contact page");

        case "/tweet":
          res.writeHead(200);
          return res.end("Hey this is sent tweet");
      }
      break;
    case "POST":
      switch (path) {
        case "/tweet":
          res.writeHead(201);
          return res.end("Hey this is my new tweet");
      }

    default:
      res.writeHead(404);
      return res.end("You are lost");
  }

  // Obviously this is great mess to start any project with all the switch cases , this cannot be implemented in real time projects, we are going to use express js .
});
server.listen(8000, () => {
  console.log("Server is runnig");
});
