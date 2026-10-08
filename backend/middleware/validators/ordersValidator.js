const { body, param } = require('express-validator');
const { validate } = require('./validator'); // מייבא את פונקציית ה-validate הכללית שלך

exports.validateCreateOrder = [
    body('customer_id')
        .notEmpty()
        .withMessage('מזהה לקוח הוא שדה חובה')
        .isInt({ min: 1 })
        .withMessage('מזהה לקוח חייב להיות מספר שלם חיובי'),

    body('shopping_cart_id')
        .notEmpty()
        .withMessage('מזהה עגלה הוא שדה חובה')
        .isInt({ min: 1 })
        .withMessage('מזהה עגלה חייב להיות מספר שלם חיובי'),

    body('shipping_city')
        .trim()
        .notEmpty()
        .withMessage('שם עיר הוא שדה חובה')
        .isString()
        .withMessage('שם עיר חייב להיות טקסט תקין'),

    body('shipping_street')
        .trim()
        .notEmpty()
        .withMessage('שם רחוב הוא שדה חובה')
        .isString()
        .withMessage('שם רחוב חייב להיות טקסט תקין'),

    body('shipping_building_number')
        .trim()
        .notEmpty()
        .withMessage('מספר בניין הוא שדה חובה'),

    validate
];

exports.validateOrderId = [
    param('order_id')
        .isInt({ min: 1 })
        .withMessage('מזהה הזמנה חייב להיות מספר שלם חיובי'),
    validate 
];