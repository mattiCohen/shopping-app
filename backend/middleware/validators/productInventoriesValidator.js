
const { body,param } = require('express-validator');
const { validate } = require('./validator');

exports.validateFieldsProductInventories = [
 body('quantity')
 .notEmpty()
 .withMessage('הכמות היא שדה חובה')
 .isNumeric('הכמות חייבת להכיל מספרים בלבד'),
 body('product_id')
 .notEmpty()
 .withMessage('מזהה מוצר הוא שדה חובה'),
 
  validate 
];

exports.validateId = [
    param('product_inventory_id')
    .isInt({ min: 1 })
    .withMessage('ID חייב להיות מספר שלם חיובי'),
  validate 
];

exports.validateProductId = [
    param('product_id')
    .isInt({ min: 1 })
    .withMessage('מזהה מוצר חייב להיות מספר שלם חיובי'),
  validate 
];