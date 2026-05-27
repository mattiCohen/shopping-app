const { body,param } = require('express-validator');
const { validate } = require('./validator');

exports.validateFieldsShoppingCarts = [
    body('customer_id')
    .notEmpty()
    .withMessage('מזהה לקוח הוא שדה חובה '),
    
    validate
];

exports.validateId = [
    param('id')
    .isInt({ min: 1 })
    .withMessage('ID חייב להיות מספר שלם חיובי'),
  validate 
];