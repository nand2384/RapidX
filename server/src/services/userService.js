const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.JWT_KEY;

const saltRounds = 10;

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

  try {
    const userQuery = `INSERT INTO users (user_id, role_id, email, phone, password, is_banned, created_at, first_name, last_name) VALUES ($1, (SELECT role_id FROM roles_master WHERE role_name = 'Customer'), $2, $3, $4, $5, NOW(), $6, $7)`;
    const userValues = [userId, email, phone, hashedPassword, false, first_name, last_name];
    var userResult = await pool.query(userQuery, userValues);
  } catch (error) {
    console.log("Error inserting user data to SQL: ", error);
  }
    
  if(userResult.rowCount > 0) {
    const addressResult = await insertAddress(userId, null, address, city, state, pincode, address_type, true);

    if(addressResult.rowCount > 0) {
      const token = generateJwtToken(userId, email);
      return token;
    } else {
      return false;
    }
  };
};

const insertAddress = async (userId, businessId, address, city, state, pincode, address_type, is_default_address) => {
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
      const addressQuery = `INSERT INTO addresses (address_id, user_id, business_id, address, city, state, pincode, address_type, is_default_address) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
      const addressValues = [addressId, userId, businessId, address, city, state, pincode, address_type, is_default_address];
      const addressResult = await pool.query(addressQuery, addressValues);

      return addressResult;

    } catch (error) {
      console.log("Error inserting address data to SQL: ", error);
    }
};

const generateJwtToken = (id, email) => {
  const token = jwt.sign(
    { id: id, email: email },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
  return token;
};           

const extractJwtTokenData = async (authToken) => {
  try {
    const payload = jwt.decode(authToken, SECRET_KEY);
    const id = payload.id;
    const email = payload.email;
    return { id, email };
  } catch (error) {
    console.log("Error extracting token data: ", error);
  }
};

const registerBusiness = async (company_name, business_type_id, reg_no, business_email, business_phone, address, city, state, pincode, billing_cycle_id, payment_method_id, business_password, admin_name, admin_phone, admin_email, admin_password) => {
  const hashedPassword = await bcrypt.hash(business_password, saltRounds);
  const hashedAdminPassword = await bcrypt.hash(admin_password, saltRounds);

  let isUnique;
  let adminId;

  const generateAdminId = () => {
    const tempId = Math.floor(100000 + Math.random() * 900000);
    adminId = Number(`21${tempId}`);
  }

  while(!isUnique) {
    generateAdminId();
    const result = await pool.query(`SELECT * FROM users WHERE user_id = ${adminId}`);

    if(result.rowCount === 0) {
      isUnique = true;
    } else {
      isUnique = false;
    }
  };

  try {
    const adminQuery = `INSERT INTO users (user_id, role_id, email, phone, password, is_banned, created_at, first_name) VALUES ($1, (SELECT role_id FROM roles_master WHERE role_name = 'Business Admin'), $2, $3, $4, $5, NOW(), $6)`;
    const adminValues = [adminId, admin_email, admin_phone, hashedAdminPassword, false, admin_name];
    const adminResult = await pool.query(adminQuery, adminValues);

    if(adminResult.rowCount > 0) {
      let businessId;
      let isBusinessIdUnique = false;

      const generateBusinessId = () => {
        const tempId = Math.floor(100000 + Math.random() * 900000);
        businessId = Number(`20${tempId}`);
      }

      while(!isBusinessIdUnique) {
        generateBusinessId();
        const result = await pool.query(`SELECT * FROM business_clients WHERE business_id = ${businessId}`);

        if(result.rowCount === 0) {
          isBusinessIdUnique = true;
        } else {
          isBusinessIdUnique = false;
        }
      };

      try {
        const businessQuery = `INSERT INTO business_clients (business_id, account_admin_id, company_name, business_type_id, reg_no, business_email, business_phone, business_password, created_at, account_status_id, billing_cycle_id, payment_method_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), (SELECT value_id FROM value_master WHERE value_name = 'Pending Verification'), $9, $10)`;
        const businessValues = [businessId, adminId, company_name, business_type_id, reg_no, business_email, business_phone, hashedPassword, billing_cycle_id, payment_method_id];
        const result = await pool.query(businessQuery, businessValues);
        
        if(result.rowCount > 0) {
          try {
            const updatingUserWithBusinessId = `UPDATE users SET business_id = $1 WHERE user_id = $2`;
            const updatingUserValues = [businessId, adminId];
            const updatingUserResult = await pool.query(updatingUserWithBusinessId, updatingUserValues);
            if(updatingUserResult.rowCount > 0) {
              const addressResult = await insertAddress(null, businessId, address, city, state, pincode, null, true);
              if(addressResult.rowCount > 0) {
                const token = generateJwtToken(businessId, business_email);
                return token;
              } else {
                return false;
              }
            }
          } catch (error) {
            console.log("Error updating user data to SQL: ", error);            
          }
        }
      } catch (error) {
        console.log("Error inserting business data to SQL: ", error);
      }
    }
  } catch (error) {
    console.log("Error inserting admin data to SQL: ", error);
  }
};

const registerEmployee = async (email, phone, password, first_name, last_name, authToken) => {
  const extractedData = await extractJwtTokenData(authToken);
  const businessId = extractedData.id;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  let employeeId;
  let isUnique;

  const generateEmployeeId = () => {
    const tempId = Math.floor(100000 + Math.random() * 900000);
    employeeId = Number(`22${tempId}`);
  };

  while(!isUnique) {
    generateEmployeeId();
    const result = await pool.query(`SELECT * FROM users WHERE user_id = ${employeeId}`);
    if(result.rowCount === 0) {
      isUnique = true;
    } else {
      isUnique = false;
    }
  };

  try {
    const employeeQuery = `INSERT INTO users (user_id, role_id, email, phone, password, is_banned, created_at, first_name, last_name, business_id)
    VALUES ($1, (SELECT role_id FROM roles_master WHERE role_name = 'Business Employee'), $2, $3, $4, $5, NOW(), $6, $7, $8)`;
    const employeeValues = [employeeId, email, phone, hashedPassword, false, first_name, last_name, businessId];
    const employeeResult = await pool.query(employeeQuery, employeeValues);

    if(employeeResult.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error inserting employee data to SQL: ", error);
  }
};

module.exports = { registerCustomer, registerBusiness, registerEmployee };