// controllers/apiController.js
const linkModel = require("../models/linkModel");

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function isValidCode(code) {
    return /^[A-Za-z0-9]{6,8}$/.test(code);
}

module.exports = {

    // CREATE LINK
    async createLink(req, res) {
        try {
            const { original_url, short_code } = req.body;
    
            if (!original_url || !isValidUrl(original_url)) {
                return res.status(400).json({ error: "Invalid URL" });
            }
            //let fixedUrl = normalizeUrl(original_url);
            let finalCode = short_code;
    
            // If user provided a code → validate it
            if (short_code) {
                if (!isValidCode(short_code)) {
                    return res.status(400).json({ error: "Invalid code format" });
                }
    
                const exists = await linkModel.getLinkByCode(short_code);
                if (exists) {
                    return res.status(409).json({ error: "Short code already exists" });
                }
            } 
            else {
                // Otherwise generate random code
                finalCode = generateCode();
            }
    
            const saved = await linkModel.createLink(finalCode,original_url);
    
            return res.status(201).json(saved);
    
        } catch (err) {
            console.error("Create Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },
    

    // LIST ALL LINKS
    async getAllLinks(req, res) {
        try {
            const links = await linkModel.getAllLinks();
            return res.json(links);
        } catch (err) {
            console.error("List Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },

    // GET SINGLE LINK
    async getSingleLink(req, res) {
        try {
            const { code } = req.params;

            const link = await linkModel.getLinkByCode(code);
            if (!link) {
                return res.status(404).json({ error: "Code not found" });
            }

            return res.json(link);

        } catch (err) {
            console.error("Get Single Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },

    // DELETE LINK
    async deleteLink(req, res) {
        try {
            const { code } = req.params;

            const deleted = await linkModel.deleteLink(code);

            if (!deleted) {
                return res.status(404).json({ error: "Code not found" });
            }

            return res.json({ success: true });

        } catch (err) {
            console.error("Delete Error:", err);
            return res.status(500).json({ error: "Server error" });
        }
    }
};


function generateCode() {
    return Math.random().toString(36).substring(2, 8); // 6 char code
}


function normalizeUrl(url) {
    // Trim spaces
    url = url.trim();

    // If it starts with proper http:// or https:// return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    // Fix malformed http:example.com or https:example.com
    if (url.startsWith("http:") || url.startsWith("https:")) {
        url = url.replace(/^https?:/, ""); // remove http: or https:
    }

    // Remove leading slashes if present
    url = url.replace(/^\/+/, "");

    // Default to http://
    return "http://" + url;
}

