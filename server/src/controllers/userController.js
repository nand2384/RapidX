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
        const {company_name, business_type_id, reg_no, business_email, business_phone, address, city, state, pincode, billing_cycle_id, payment_method_id, business_password, admin_first_name, admin_last_name, admin_phone, admin_email, admin_password} = req.body;
        const response = await userService.registerBusiness(company_name, business_type_id, reg_no, business_email, business_phone, address, city, state, pincode, billing_cycle_id, payment_method_id, business_password, admin_first_name, admin_last_name, admin_phone, admin_email, admin_password);
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

const registerDeliveryPartner = async (req, res) => {
    try {
        const { rider_first_name, rider_last_name, phone, email, password, birth_date, profile_picture, license_number, expiry_date, license_photo, document_type_id, document_number, document_photo, address, state, city, pincode, vehicle_type_id, vehicle_number, rc_book_picture, bank_name, branch_name, account_number, account_holder_name, account_type, ifsc_code, working_type_id, working_state, working_city, time_slot } = req.body
        const response = await userService.registerDeliveryPartner(rider_first_name, rider_last_name, phone, email, password, birth_date, profile_picture, license_number, expiry_date, license_photo, document_type_id, document_number, document_photo, address, state, city, pincode, vehicle_type_id, vehicle_number, rc_book_picture, bank_name, branch_name, account_number, account_holder_name, account_type, ifsc_code, working_type_id, working_state, working_city, time_slot);

        if(response !== false) {
            res.status(201).json({ token: response });
        } else {
            res.status(400).json("Error in registering delivery partner");
        }
    } catch (error) {
        
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await userService.login(email, password);
        
        if(response !== false) {
            res.status(200).json({ token: response.token, role: response.role, user: response.user });
        } else {
            res.status(401).json("Invalid credentials");
        }
    } catch (error) {
        console.log("Error in login: ", error);
    }
};

const createOrder = async (req, res) => {
    try {
        const { sender_name, sender_phone, sender_address, sender_state, sender_city, sender_pincode, receiver_name, receiver_phone, receiver_address, receiver_state, receiver_city, receiver_pincode, special_instruction, order_amount, parcels } = req.body;

        const bearerToken = req.headers.authorization;

        if(bearerToken && bearerToken.startsWith("Bearer ")) {
            var authToken = bearerToken.split(" ")[1];
        } else {
            res.status(401).json("Unauthorized");
            return;
        }

        const response = await userService.createOrder(authToken, sender_name, sender_phone, sender_address, sender_state, sender_city, sender_pincode, receiver_name, receiver_phone, receiver_address, receiver_state, receiver_city, receiver_pincode, special_instruction, order_amount, parcels);

        if(response !== false && response.orderData.rowCount > 0 && response.parcelData.rowCount > 0) {
            res.status(201).json({ orderData: response.orderData.rows, parcelData: response.parcelData.rows });
        } else {
            res.status(400).json("Error in creating order");
        }
     } catch (error){
        console.log("Error in Creating Order: ", error);
    }
};

module.exports = { registerCustomer, registerBusiness, registerEmployee, registerDeliveryPartner, login, createOrder };