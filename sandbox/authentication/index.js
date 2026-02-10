import express from "express";

const app = express();
const PORT = 8000;

app.use(express.json());

const DIARY = {};
const EMAILS = new Set();

// For example : Take this controller for he aprking lot where the users are coming an paring there cars
// Now to park the car , you have to provide the info and get the token back from security guard
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (EMAILS.has(email)) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const token = `${Date.now()}`;
  DIARY[token] = { name, email, password };
  EMAILS.add(email);
  return res.json({ status: true, token });
});  

// Now coming back to take the car you have to show your token to get the car right.

app.post("/mydata", (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: " Missing token" });
  }
  // take the situation if you have made entry at secuirty guard 2 and after coming back you are providing the token at security 1
  if (!(token in DIARY)) {
    return res.status(400).json({ error: "Inavlid token" });
  }
  const entry = DIARY[token];
  return res.json({ data: entry });
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
