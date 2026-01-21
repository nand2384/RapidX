const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post("/register/customer", userController.registerCustomer);

router.post("/register/business", userController.registerBusiness);

router.post("/register/employee", userController.registerEmployee);

module.exports = router;