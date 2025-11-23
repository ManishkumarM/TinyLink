const model = require("../models/linkModel");

// Helper functions
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

module.exports = {
  
  // CREATE LINK
  createLink: async (req, res) => {
    try {
      let { url, code } = req.body;

      // Validate URL
      if (!url || !isValidUrl(url)) {
        return res.status(400).json({ error: "Invalid URL" });
      }

      // Check custom code
      if (code) {
        // Validate custom code format
        if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
          return res.status(400).json({ error: "Code must be 6-8 characters (A-Z a-z 0-9)" });
        }

        // Check if already exists
        const existing = await model.getLinkByCode(code);
        if (existing) {
          return res.status(409).json({ error: "Code already exists" });
        }

      } else {
        // Generate new code
        let newCode;
        let exists = true;

        // Ensure unique generated code
        while (exists) {
          newCode = generateCode(6);
          exists = await model.getLinkByCode(newCode);
        }
        code = newCode;
      }

      // Create link
      const link = await model.createLink(code, url);

      return res.status(201).json(link);

    } catch (err) {
      console.error("Create link error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  },


  // GET ALL LINKS
  getAllLinks: async (req, res) => {
    try {
      const links = await model.getAllLinks();
      return res.json(links);
    } catch (err) {
      console.error("Get all links error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  },


  // GET ONE LINK STATS
  getLinkStats: async (req, res) => {
    try {
      const { code } = req.params;
      const link = await model.getLinkByCode(code);

      if (!link) {
        return res.status(404).json({ error: "Code not found" });
      }

      return res.json(link);

    } catch (err) {
      console.error("Get link stats error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  },


  // DELETE LINK
  deleteLink: async (req, res) => {
    try {
      const { code } = req.params;

      const deleted = await model.deleteLink(code);
      if (!deleted) {
        return res.status(404).json({ error: "Code not found" });
      }

      return res.json({ success: true });

    } catch (err) {
      console.error("Delete link error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
};
