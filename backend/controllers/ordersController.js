const catchAsync = require('../utils/catchAsync');
const pool = require("../db");
const { handleNotFound, handleBadRequest } = require('../utils/errors'); 
const { createOrderWithItems } = require('../services/ordersService');

const getOrderById = catchAsync(async (req, res, next) => {
    const { order_id } = req.params;
    const orderResult = await pool.query("SELECT * FROM orders WHERE order_id = $1", [order_id]);
    
    if (orderResult.rows.length === 0) {
        return handleNotFound(next, "Order not found");
    }
    
    const itemsResult = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [order_id]);
    
    res.json({
        order: orderResult.rows[0],
        items: itemsResult.rows
    });
});

const getAllOrders = catchAsync(async (req, res, next) => {
    const orderResult = await pool.query("SELECT * FROM orders"); 
    if (orderResult.rows.length === 0) {
        return handleNotFound(next, "Orders not found");
    }
    const itemsResult = await pool.query("SELECT * FROM order_items");
    res.json({
        order: orderResult.rows,
        items: itemsResult.rows
    });
});

const getOrdersByStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    const ordersResult = await pool.query("SELECT * FROM orders WHERE status = $1", [status]);
    if (ordersResult.rows.length === 0) {
        return handleNotFound(next, "Orders not found");
    }
    const itemsResult = await pool.query("SELECT * FROM order_items");
    
    res.json({
        order: ordersResult.rows,
        items: itemsResult.rows
    });
});

const createOrder = catchAsync(async (req, res, next) => {
    const { customer_id, shopping_cart_id, shipping_city, shipping_street, shipping_building_number } = req.body;

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const cartRes = await client.query(`
            SELECT product_id, quantity 
            FROM cart_items 
            WHERE shopping_cart_id = $1
        `, [shopping_cart_id]);
        
        const finalItems = cartRes.rows;
        if (!finalItems || finalItems.length === 0) {
            await client.query('ROLLBACK'); 
            return handleBadRequest(next, "Cannot create an order with an empty cart");
        }

        const shippingAddress = {
            city: shipping_city,
            street: shipping_street,
            building_number: shipping_building_number
        };

        const order = await createOrderWithItems(client, customer_id, null, shippingAddress, finalItems);

        await client.query(`
            DELETE FROM cart_items 
            WHERE shopping_cart_id = $1
        `, [shopping_cart_id]);

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: "Order created successfully and cart cleared",
            order_id: order.order_id,
            total_amount: order.total_amount
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error); 
    } finally {
        client.release();
    }
});

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    getOrdersByStatus
};