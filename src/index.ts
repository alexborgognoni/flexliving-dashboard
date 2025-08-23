import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("Hello from The Flex Reviews Dashboard 🚀");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
