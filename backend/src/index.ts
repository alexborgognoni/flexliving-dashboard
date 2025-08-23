import express from "express";
import cors from "cors";
import {
  propertiesRouter,
  hostsRouter,
  guestsRouter,
  reviewsRouter,
} from "./api";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

app.use("/api", propertiesRouter);
app.use("/api", hostsRouter);
app.use("/api", guestsRouter);
app.use("/api", reviewsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
