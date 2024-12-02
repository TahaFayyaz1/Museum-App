require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const imageRoutes = require("./routes/imageRoutes");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve static files

let db;
const client = new MongoClient(process.env.MONGO_URI);

client
  .connect()
  .then(() => {
    db = client.db("museum-db");
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

app.use(
  "/api/images",
  (req, res, next) => {
    req.db = db;
    next();
  },
  imageRoutes
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
