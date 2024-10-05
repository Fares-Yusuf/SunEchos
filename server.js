require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});
