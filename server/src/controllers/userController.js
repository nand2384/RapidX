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
};

const registerEmployee = async (req, res) => {
    try {
        const { email, phone, password, first_name, last_name } = req.body;
        const authToken = req.headers.authorization.split(" ")[1];
        const response = await userService.registerEmployee(email, phone, password, first_name, last_name, authToken);
        
        if(response == true) {
            res.status(201).json("Employee registered successfully");
        } else {
            res.status(400).json("Error in registering employee");
        }
    } catch (error) {
        console.log("Error in registering employee: ", error);
    }
};

const createOrder = async (req, res) => {
    try{
    
        const {sender_name, sender_phone, sender_address, sender_state, sender_city, sender_pincode, reciver_name, reciver_phone, reciver_address, reciver_state, reciver_city, reciver_pincode, parcle_type_id, parcel_category_id, special_instruction, order_amount} = req.body;
        const response = await userService.createOrder(sender_name, sender_phone, sender_address, sender_state, sender_city, sender_pincode, reciver_name, reciver_phone, reciver_address, reciver_state, reciver_city, reciver_pincode, parcle_type_id, parcel_category_id, special_instruction, order_amount);
        res.status(201).json(reesponse);
    } catch (error){
        console.log("Error in Creating Order: ", error);
    }
}

module.exports = { registerCustomer, registerBusiness, registerEmployee, createOrder };