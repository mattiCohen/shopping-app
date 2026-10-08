const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const catchAsync = require('../utils/catchAsync');
const { createAddress } = require('../services/addressService');

const JWT_SECRET = process.env.JWT_SECRET;

const register = catchAsync(async (req, res, next) => {
    const { email, password, phone, first_name, last_name, city, street, building_number } = req.body;

    const userExists = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
        const error = new Error("משתמש עם אימייל זה כבר קיים במערכת");
        error.statusCode = 400;
        return next(error);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const addressId = await createAddress(city, street, building_number);
        const newUserResult = await client.query(
            'INSERT INTO customers (email, password, phone, first_name, last_name, address_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING customer_id, email',
            [email, hashedPassword, phone, first_name, last_name, addressId]
        );

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: "המשתמש והכתובת נוצרו בהצלחה!",
            user: newUserResult.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const userResult = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
        const error = new Error(" מייל לא קיים במערכת");
        error.statusCode = 400;
        return next(error);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error(" סיסמה שגויה");
        error.statusCode = 400;
        return next(error);
    }

    const token = jwt.sign(
        { userId: user.customer_id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.status(200).json({
        success: true,
        message: "התחברת בהצלחה!",
        token,
        user: { id: user.customer_id, email: user.email }
    });
});

module.exports = { register, login };