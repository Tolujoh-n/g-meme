// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const galleryRoutes = require("./routes/galleryRoutes");
const path = require("path");

const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/authDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Middleware
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve image files
app.use("/api/gallery", galleryRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
