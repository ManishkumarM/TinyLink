// controllers/pageController.js
const linkModel = require("../models/linkModel");

module.exports = {
    // Render dashboard page
    async renderDashboard(req, res) {
        try {
            const links = await linkModel.getAllLinks();
            res.render("index", { links });
        } catch (err) {
            console.error("Dashboard Error:", err);
            res.status(500).send("Server error");
        }
    },

    // Render stats page
    // Render stats page
    async renderStatsPage(req, res) {
        try {
            const { code } = req.params;
            const link = await linkModel.getLinkByCode(code);

            if (!link) {
                return res.status(404).render("stats", {
                    notFound: true,
                    link: null,
                    baseURL: req.protocol + "://" + req.get("host")
                });
            }

            res.render("stats", {
                notFound: false,
                link,
                baseURL: req.protocol + "://" + req.get("host")
            });
        } catch (err) {
            console.error("Stats Error:", err);
            res.status(500).send("Server error");
        }
    },
    // Redirect user to original URL + increment clicks
    async handleRedirect(req, res) {
        try {
            const { code } = req.params;
            const link = await linkModel.getLinkByCode(code);

            if (!link) {
                return res.status(404).send("Short code not found");
            }

            await linkModel.incrementClicks(code);

            return res.redirect(302, link.original_url);

        } catch (err) {
            console.error("Redirect Error:", err);
            res.status(500).send("Server error");
        }
    }
};
