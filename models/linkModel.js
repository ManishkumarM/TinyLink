const pool = require("../db");

module.exports = {
  
  // CREATE LINK
  async createLink(code, url) {
    const query = `
      INSERT INTO links (short_code , original_url)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(query, [code, url]);
    return result.rows[0];
  },

  // GET ALL LINKS
  async getAllLinks() {
    const result = await pool.query(`
      SELECT * FROM links ORDER BY created_at DESC;
    `);
    return result.rows;
  },

  // GET A LINK BY CODE
  async getLinkByCode(code) {
    const result = await pool.query(
      `SELECT * FROM links WHERE short_code = $1`,
      [code]
    );
    return result.rows[0];
  },

  // INCREMENT CLICK COUNT
  async incrementClicks(code) {
    const result = await pool.query(
      `UPDATE links
       SET clicks = clicks + 1,
           updated_at = NOW()
       WHERE short_code = $1
       RETURNING *`,
      [code]
    );
    return result.rows[0];
  },

  // DELETE LINK
  async deleteLink(code) {
    const result = await pool.query(
      `DELETE FROM links WHERE short_code = $1 RETURNING *`,
      [code]
    );
    return result.rows[0];
  }
};
