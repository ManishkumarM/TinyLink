// routes/pageRoutes.js
const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");

// Dashboard page
router.get("/", pageController.renderDashboard);

// Stats page
router.get("/code/:code", pageController.renderStatsPage);

// Redirect route (MUST be last)
router.get("/:code", pageController.handleRedirect);

// Stats page
router.get("/code/:code", async (req, res) => {
    const { code } = req.params;

    const data = await linkModel.getLinkByCode(code);

    if (!data) {
        return res.status(404).render("stats", { notFound: true, link: null });
    }

    res.render("stats", {
        notFound: false,
        link: data
    });
});


module.exports = router;
