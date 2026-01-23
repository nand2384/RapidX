const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.JWT_KEY;

const saltRounds = 10;

const generateId = async (id) => {
  try {
    const variableData = [
      { id: 10, table: "users", column: "user_id" },
      { id: 20, table: "business_clients", column: "business_id" },
      { id: 21, table: "users", column: "user_id" },
      { id: 22, table: "users", column: "user_id" },
      { id: 30, table: "users", column: "user_id" },
      { id: 40, table: "addresses", column: "address_id" },
      { id: 50, table: "orders", column: "order_id" },
      { id: 51, table: "parcels", column: "parcel_id" }
    ]

    const currentVariableData = variableData.find((data) => data.id == id);

    let uniqueId;
    let isUnique;

    while(!isUnique) {
      const tempId = Math.floor(100000 + Math.random() * 900000);
      uniqueId = Number(`${currentVariableData.id ?? id}${tempId}`);

      const result = await pool.query(`SELECT * FROM ${currentVariableData.table} WHERE ${currentVariableData.column} = ${uniqueId}`);

      if(result.rowCount === 0) {
        isUnique = true;
      }
    };

    return uniqueId;

  } catch (error) {
    console.log("Error generating id: ", error);
    throw new Error("Error generating id");
  } 
};

const registerCustomer = async (
  first_name,
  last_name,
  email,
  phone,
  password,
  address,
  state,
  city,
  pincode,
  address_type
) => {
  try {
    //Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userId = await generateId(10);

    const userQuery = `
      INSERT INTO users (
        user_id, role_id, email, phone, password,
        is_banned, created_at, first_name, last_name
      )
      VALUES (
        $1,
        (SELECT role_id FROM roles_master WHERE role_name = 'Customer'),
        $2, $3, $4, $5, NOW(), $6, $7
      )
    `;

    const userValues = [
      userId,
      email,
      phone,
      hashedPassword,
      false,
      first_name,
      last_name
    ];

    const userResult = await pool.query(userQuery, userValues);

    if (userResult.rowCount === 0) {
      throw new Error("Customer user insert failed");
    }

    const addressResult = await insertAddress(
      userId,
      null,
      address,
      city,
      state,
      pincode,
      address_type,
      true
    );

    if (!addressResult || addressResult.rowCount === 0) {
      throw new Error("Customer address insert failed");
    }

    const token = generateJwtToken(userId, null, email);
    return token;

  } catch (error) {
    console.error("Error registering customer:", error);
    return false;
  }
};

const insertAddress = async (userId, businessId, address, city, state, pincode, address_type, is_default_address) => {
  const addressId = await generateId(40);
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

const generateJwtToken = (userId, businessId, email) => {
  const payload = {};

  if (userId !== undefined && userId !== null) payload.userId = userId;
  if (businessId !== undefined && businessId !== null) payload.businessId = businessId;
  if (email !== undefined && email !== null) payload.email = email;

  try {
    const authToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    return authToken;
  } catch (error) {
    console.log("Error generating token: ", error);
    throw new Error("Error generating token");
  }
};

const extractJwtTokenData = (authToken) => {
  try {
    const payload = jwt.decode(authToken, SECRET_KEY);
    const userId = payload.userId ?? null;
    const businessId = payload.businessId ?? null;

    const email = payload.email;

    return { userId, businessId, email };
  } catch (error) {
    console.log("Error extracting token data: ", error);
    throw new Error("Error extracting token data");
  }
};

const registerBusiness = async (
  company_name,
  business_type_id,
  reg_no,
  business_email,
  business_phone,
  address,
  city,
  state,
  pincode,
  billing_cycle_id,
  payment_method_id,
  business_password,
  admin_first_name,
  admin_last_name,
  admin_phone,
  admin_email,
  admin_password
) => {
  try {
    //Hash passwords
    const hashedPassword = await bcrypt.hash(business_password, saltRounds);
    const hashedAdminPassword = await bcrypt.hash(admin_password, saltRounds);


    const adminId = await generateId(21);
    const businessId = await generateId(22);

    const adminQuery = `
      INSERT INTO users (user_id, role_id, email, phone, password, is_banned, created_at, first_name, last_name)
      VALUES (
        $1,
        (SELECT role_id FROM roles_master WHERE role_name = 'Business Admin'),
        $2, $3, $4, $5, NOW(), $6, $7
      )
    `;

    const adminResult = await pool.query(adminQuery, [
      adminId,
      admin_email,
      admin_phone,
      hashedAdminPassword,
      false,
      admin_first_name,
      admin_last_name
    ]);

    if (adminResult.rowCount === 0) throw new Error("Admin insert failed");

    const businessUserQuery = `
      INSERT INTO users (user_id, role_id, email, phone, password, is_banned, created_at, first_name)
      VALUES (
        $1,
        (SELECT role_id FROM roles_master WHERE role_name = 'Business'),
        $2, $3, $4, $5, NOW(), $6
      )
    `;

    const businessUserResult = await pool.query(businessUserQuery, [
      businessId,
      business_email,
      business_phone,
      hashedPassword,
      false,
      company_name
    ]);

    if (businessUserResult.rowCount === 0) throw new Error("Business user insert failed");

    const businessQuery = `
      INSERT INTO business_clients (
        business_id, account_admin_id, company_name,
        business_type_id, reg_no, business_phone,
        created_at, account_status_id, billing_cycle_id, payment_method_id
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        NOW(),
        (SELECT value_id FROM value_master WHERE value_name = 'Pending Verification'),
        $7, $8
      )
    `;

    const businessResult = await pool.query(businessQuery, [
      businessId,
      adminId,
      company_name,
      business_type_id,
      reg_no,
      business_phone,
      billing_cycle_id,
      payment_method_id
    ]);

    if (businessResult.rowCount === 0) throw new Error("Business insert failed");

    await pool.query(
      "UPDATE users SET business_id = $1 WHERE user_id IN ($2, $3)",
      [businessId, adminId, businessId]
    );

    const addressResult = await insertAddress(null, businessId, address, city, state, pincode, null, true);
    if (!addressResult || addressResult.rowCount === 0) throw new Error("Address insert failed");

    const token = generateJwtToken(null, businessId, business_email);
    return token;

  } catch (error) {
    console.error("Error registering business:", error);
    throw error;
  }
};

const registerEmployee = async (email, phone, password, first_name, last_name, authToken) => {
  try {
    //Extract business ID from token
    const extractedData = extractJwtTokenData(authToken);
    const businessId = extractedData?.id;

    if (!businessId) {
      throw new Error("Invalid or expired auth token");
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const employeeId = await generateId(22);

    const employeeQuery = `
      INSERT INTO users (
        user_id, role_id, email, phone, password,
        is_banned, created_at, first_name, last_name, business_id
      )
      VALUES (
        $1,
        (SELECT role_id FROM roles_master WHERE role_name = 'Business Employee'),
        $2, $3, $4, $5, NOW(), $6, $7, $8
      )
    `;

    const employeeValues = [
      employeeId,
      email,
      phone,
      hashedPassword,
      false,
      first_name,
      last_name,
      businessId
    ];

    const employeeResult = await pool.query(employeeQuery, employeeValues);

    return employeeResult.rowCount > 0;

  } catch (error) {
    console.log("Error inserting employee data to SQL: ", error);
    return false;
  }
};

const registerDeliveryPartner = async (
  rider_first_name,
  rider_last_name,
  phone,
  email,
  password,
  birth_date,
  profile_picture,
  license_number,
  expiry_date,
  license_photo,
  document_type_id,
  document_number,
  document_photo,
  address,
  state,
  city,
  pincode,
  vehicle_type_id,
  vehicle_number,
  rc_book_picture,
  bank_name,
  branch_name,
  account_number,
  account_holder_name,
  account_type,
  ifsc_code,
  working_type_id,
  working_state,
  working_city,
  time_slot
) => {
  try {
    //Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const riderId = await generateId(30);

    const riderUsersQuery = `
      INSERT INTO users (
        user_id, role_id, email, phone, password,
        is_banned, created_at, first_name, last_name
      ) 
      VALUES (
        $1,
        (SELECT role_id FROM roles_master WHERE role_name = 'Delivery Partner'),
        $2, $3, $4, $5, NOW(), $6, $7
      )
    `;

    const usersQueryValues = [
      riderId,
      email,
      phone,
      hashedPassword,
      false,
      rider_first_name,
      rider_last_name
    ];

    const riderUsersResult = await pool.query(riderUsersQuery, usersQueryValues);

    if (riderUsersResult.rowCount === 0) {
      throw new Error("Delivery partner user insert failed");
    }

    const addressResult = await insertAddress(
      riderId,
      null,
      address,
      city,
      state,
      pincode,
      null,
      true
    );

    if (!addressResult || addressResult.rowCount === 0) {
      throw new Error("Delivery partner address insert failed");
    }

    const partnerQuery = `
      INSERT INTO delivery_partner 
      (
        delivery_partner_id, birth_date, profile_picture, 
        license_number, expiry_date, license_photo, document_type_id, 
        document_number, document_photo, vehicle_type_id, vehicle_number, 
        rc_book_picture, working_type_id, working_state, working_city, 
        time_slot, account_status_id, bank_name, branch_name, 
        account_number, account_type, ifsc_code, account_holder_name, 
        is_verified, created_at
      ) 
      VALUES (
        $1, $2, $3, 
        $4, $5, $6, $7, 
        $8, $9, $10, $11, 
        $12, $13, $14, $15, 
        $16,
        (SELECT value_id FROM value_master WHERE value_name = 'Pending Verification'),
        $17, $18, 
        $19, $20, $21, $22, 
        $23, NOW()
      )
    `;

    const partnerValues = [
      riderId,
      birth_date,
      profile_picture,
      license_number,
      expiry_date,
      license_photo,
      document_type_id,
      document_number,
      document_photo,
      vehicle_type_id,
      vehicle_number,
      rc_book_picture,
      working_type_id,
      working_state,
      working_city,
      time_slot,
      bank_name,
      branch_name,
      account_number,
      account_type,
      ifsc_code,
      account_holder_name,
      false
    ];

    const partnerResult = await pool.query(partnerQuery, partnerValues);

    if (partnerResult.rowCount === 0) {
      throw new Error("Delivery partner profile insert failed");
    }

    const token = generateJwtToken(riderId, null, email);
    return token;

  } catch (error) {
    console.log("Error inserting rider data to SQL: ", error);
    return false;
  }
};

const login = async (email, password) => {
  try {
    const checkUserQuery = `SELECT * FROM users WHERE email = $1`;
    const checkUserValues = [email];
    const checkUserResult = await pool.query(checkUserQuery, checkUserValues);

    if (checkUserResult.rowCount === 0) {
      return false;
    }

    const user = checkUserResult.rows[0];

    if (user.is_banned) {
      return false;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return false;
    }

    const role = user.role_id;
    const token = generateJwtToken(user.user_id, user.business_id, user.email);

    delete user.password;

    return { token, role, user };

  } catch (error) {
    console.log("Login error:", error);
    return false;
  }
};

const createOrder = async (
  authToken,
  sender_name,
  sender_phone,
  sender_address,
  sender_state,
  sender_city,
  sender_pincode,
  receiver_name,
  receiver_phone,
  receiver_address,
  receiver_state,
  receiver_city,
  receiver_pincode,
  special_instruction,
  order_amount,
  parcels
) => {
  try {
    //Extract token data
    const extractedData = extractJwtTokenData(authToken);
    const userId = extractedData?.userId;
    const businessId = extractedData?.businessId;

    if (!userId) {
      throw new Error("Invalid auth token");
    }

    const orderId = await generateId(50);

    const orderQuery = `
      INSERT INTO orders (
        order_id, sender_id, business_id, sender_name, sender_phone,
        sender_address, sender_state, sender_city, sender_pincode,
        receiver_name, receiver_phone, receiver_address, receiver_state,
        receiver_city, receiver_pincode, special_instruction, 
        order_amount, delivery_status_id, created_at, is_complete
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13,
        $14, $15, $16, $17,
        (SELECT value_id FROM value_master WHERE value_name = 'Order Placed'),
        NOW(), $18
      )
    `;

    const orderValues = [
      orderId,
      userId,
      businessId,
      sender_name,
      sender_phone,
      sender_address,
      sender_state,
      sender_city,
      sender_pincode,
      receiver_name,
      receiver_phone,
      receiver_address,
      receiver_state,
      receiver_city,
      receiver_pincode,
      special_instruction,
      order_amount,
      false
    ];

    const orderResult = await pool.query(orderQuery, orderValues);

    if (orderResult.rowCount === 0) {
      throw new Error("Order insert failed");
    }

    const parcelResult = await insertParcels(orderId, parcels);

    if (parcelResult !== true) {
      throw new Error("Parcel insert failed");
    }

    const orderData = await pool.query(
      `SELECT * FROM orders WHERE order_id = $1`,
      [orderId]
    );

    const parcelData = await pool.query(
      `SELECT * FROM parcels WHERE order_id = $1`,
      [orderId]
    );

    return {
      orderData: orderData.rows,
      parcelData: parcelData.rows
    };

  } catch (error) {
    console.log("Error inserting order data to SQL:", error);
    return false;
  }
};

const insertParcels = async (orderId, parcels) => {
  try {
    if (!Array.isArray(parcels) || parcels.length === 0) {
      throw new Error("Invalid parcels data");
    }

    const parcelQuery = `
      INSERT INTO parcels (parcel_id, order_id, parcel_type_id, parcel_size_id)
      VALUES ($1, $2, $3, $4)
    `;

    let parcelAddedCount = 0;

    for (const parcel of parcels) {
      const parcelId = await generateId(51);

      const parcelValues = [
        parcelId,
        orderId,
        parcel.parcel_type_id,
        parcel.parcel_size_id
      ];

      const parcelResult = await pool.query(parcelQuery, parcelValues);

      if (parcelResult.rowCount > 0) {
        parcelAddedCount++;
      }
    }

    return parcelAddedCount === parcels.length;

  } catch (error) {
    console.log("Error inserting parcel data to SQL: ", error);
    return false;
  }
};

module.exports = { registerCustomer, registerBusiness, registerEmployee, registerDeliveryPartner, login, createOrder };