const userService = require("../services/userService");

const registerCustomer = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password, address, state, city, pincode, address_type } = req.body;
        const response = await userService.registerCustomer(first_name, last_name, email, phone, password, address, state, city, pincode, address_type);
        res.status(201).json(response);
    } catch (error) {
        console.log(error);
    }
};

const registerBusiness = async (req, res) => {
    try {
        const {company_name, business_type_id, reg_no, business_email, business_phone, address, city, state, pincode, billing_cycle_id, payment_method_id, business_password, admin_name, admin_phone, admin_email, admin_password} = req.body;
        const response = await userService.registerBusiness(company_name, business_type_id, reg_no, business_email, business_phone, address, city, state, pincode, billing_cycle_id, payment_method_id, business_password, admin_name, admin_phone, admin_email, admin_password);
        res.status(201).json(response);
    } catch (error) {
        console.log("Error in registering business: ", error);
    }
}

module.exports = { registerCustomer, registerBusiness };