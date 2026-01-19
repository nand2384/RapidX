const userService = require("../services/userService");

const getRequest = async (req, res) => {
    try {
        const response = await userService.getRequest();
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const registerCustomer = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password, address, state, city, pincode, address_type } = req.body;
        const response = await userService.registerCustomer(first_name, last_name, email, phone, password, address, state, city, pincode, address_type);
        res.status(201).json(response);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { getRequest, registerCustomer };