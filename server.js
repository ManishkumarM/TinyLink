require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const apiRoutes = require("./routes/apiRoutes");
const pageRoutes = require("./routes/pageRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// const listEndpoints = require("express-list-endpoints");

// app.get("/routes", (req, res) => {
//     const routes = listEndpoints(app);
//     res.json(routes);
// });

// Health check
app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime_seconds: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Page routes
app.use("/", pageRoutes);

// API routes
app.use("/api", apiRoutes);


app.use((req, res, next) => {
  res.locals.baseURL = process.env.BASE_URL;
  next();
});





// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
