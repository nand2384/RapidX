const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post("/register/customer", userController.registerCustomer);

router.post("/register/business", userController.registerBusiness);

router.post("/register/employee", userController.registerEmployee);

router.post("/register/delivery-partner", userController.registerDeliveryPartner);

router.post("/login", userController.login);

router.post("/create/order", userController.createOrder);

module.exports = router;