// routes/apiRoutes.js
const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

// Create new short link
router.post("/links", apiController.createLink);

// List all links
router.get("/links", apiController.getAllLinks);

// Stats for a single link
router.get("/links/:code", apiController.getSingleLink);

// Delete a link
router.delete("/links/:code", apiController.deleteLink);

module.exports = router;
