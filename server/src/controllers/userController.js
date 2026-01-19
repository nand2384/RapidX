const userService = require("../services/userService");

const getRequest = async (req, res) => {
    try {
        const response = await userService.getRequest();
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getRequest };