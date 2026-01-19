const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get("/", userController.getRequest);

router.post("/register/customer", userController.registerCustomer);

module.exports = router;