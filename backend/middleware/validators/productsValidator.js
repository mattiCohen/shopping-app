const { body,param } = require('express-validator');
const { validate } = require('./validator');

exports.validateFieldsProducts = [
    body('purchase_price')
    .notEmpty()
    .withMessage('מחיר קניה הוא שדה חובה ')
    .isNumeric()
    .withMessage('מחיר מכירה חייב להכיל מספרים בלבד'),    
    body('selling_price')
    .notEmpty()
    .withMessage('מחיר מכירה הוא שדה חובה ')
    .isNumeric()
    .withMessage('מחיר מכירה חייב להכיל מספרים בלבד'),
    body('company_id')
    .notEmpty()
    .withMessage('מזהה החברה הוא שדה חובה '),

    validate
];

exports.validateId = [
    param('id')
    .isInt({ min: 1 })
    .withMessage('ID חייב להיות מספר שלם חיובי'),
  validate 
];