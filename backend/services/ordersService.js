const pool = require("../db");

const createOrderWithItems = async (client, customerId, guestData, shippingAddress, items) => {
    let totalAmount = 0;
    const itemsWithPrices = [];

    for (const item of items) {
        const productRes = await client.query(
            "SELECT selling_price FROM products WHERE product_id = $1",
            [item.product_id]
        );
        if (productRes.rows.length === 0) {
            const error = new Error(`Product with ID ${item.product_id} not found`);
            error.statusCode = 404;
            throw error;
        }

        const currentPrice = productRes.rows[0].selling_price;
        totalAmount += currentPrice * item.quantity;

        itemsWithPrices.push({
            product_id: item.product_id,
            quantity: item.quantity,
            price: currentPrice
        });
    }

    const { city, street, building_number } = shippingAddress;
    const orderQuery = `
        INSERT INTO orders (
            customer_id, guest_email, guest_phone, 
            shipping_city, shipping_street, shipping_building_number, 
            total_amount, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') 
        RETURNING *
    `;
    
    const orderValues = [
        customerId, 
        guestData ? guestData.email : null,
        guestData ? guestData.phone : null,
        city,
        street,
        building_number,
        totalAmount
    ];

    const orderResult = await client.query(orderQuery, orderValues);
    const newOrder = orderResult.rows[0];
    const itemInsertQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
        VALUES ($1, $2, $3, $4)
    `;

    for (const item of itemsWithPrices) {
        await client.query(itemInsertQuery, [
            newOrder.order_id,
            item.product_id,
            item.quantity,
            item.price
        ]);
    }

    //כאן מתבצע התשלום באשראי באמצאות חברת סליקה חיצונית על סך totalAmount 
    //במידה והתשלום עבר בהצלחה נעדכן את status ההזמנה paid
    //במידה והתשלום נכשל נעדכן את status ההזמנה failed ונחזיר הודעת שגיאה מתאימה ללקוח
    
    return newOrder;
};

module.exports = {
    createOrderWithItems
};