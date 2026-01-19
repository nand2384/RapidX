const pool = require("../config/db");

const getRequest = async () => {
    const result = await pool.query("SELECT * FROM main_master");
    return result.rows;
};

module.exports = { getRequest };