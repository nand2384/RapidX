const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.JWT_KEY;

const saltRounds = 10;

const getRequest = async () => {
  const result = await pool.query("SELECT * FROM main_master");
  return result.rows;
};

const registerCustomer = async (first_name, last_name, email, phone, password, address, state, city, pincode, address_type) => {
  //Generate Hashed Password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  let isUnique = false;
  let userId;

  const generateId = () => {
    const tempId = Math.floor(100000 + Math.random() * 900000);
    userId = Number(`10${tempId}`);
  };

  while(!isUnique) {
    generateId();
    const result = await pool.query(`SELECT * FROM users WHERE user_id = ${userId}`);
    
    if(result.rowCount === 0) {
      isUnique = true;
    } else {
      isUnique = false;
    }
  };

  // const result = await pool.query(`INSERT INTO users (user_id, role_id, email, phone, password, is_banned, created_at, first_name, last_name) VALUES (${userId}, (SELECT role_id FROM roles_master WHERE role_name = 'Customer'), ${email}, ${phone}, ${hashedPassword}, false, NOW(), ${first_name}, ${last_name}`);

  try {
    const userQuery = `INSERT INTO users (user_id, role_id, email, phone, password, is_banned, created_at, first_name, last_name) VALUES ($1, (SELECT role_id FROM roles_master WHERE role_name = 'Customer'), $2, $3, $4, $5, NOW(), $6, $7)`;
    const userValues = [userId, email, phone, hashedPassword, false, first_name, last_name];
    var userResult = await pool.query(userQuery, userValues);
  } catch (error) {
    console.log("Error inserting user data to SQL: ", error);
  }
    
  if (userResult.rowCount > 0) {
    let addressId;
    let isAddressUnique = false;

    const generateAddressId = () => {
      const tempId = Math.floor(100000 + Math.random() * 900000);
      addressId = Number(`40${tempId}`);
    };

    while(!isAddressUnique) {
      generateAddressId();
      const result = await pool.query(`SELECT * FROM addresses WHERE address_id = ${addressId}`);
      if(result.rowCount === 0) {
        isAddressUnique = true;
      } else {
        isAddressUnique = false;
      }
    };

    try {
      const addressQuery = `INSERT INTO addresses (address_id, user_id, address, city, state, pincode, address_type, is_default_address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
      const addressValues = [addressId, userId, address, city, state, pincode, address_type, true];
      var addressResult = await pool.query(addressQuery, addressValues);

    } catch (error) {
      console.log("Error inserting address data to SQL: ", error);
    }

    if(addressResult.rowCount > 0) {
      const token = jwt.sign(
        { userId: userId, email: email },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      return token;
    } else {
      return false;
    }
  };
};

module.exports = { getRequest, registerCustomer };
