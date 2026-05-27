const {body, param} = require('express-validator');
const {validate} = require('./validator');

exports.validateFieldsShoppingHistory = [
    body('shopping_cart_id')
    .notEmpty()
    .withMessage('מזהה עגלת קנייה הוא שדה חובה '),
    body('date')
    .notEmpty()
    .withMessage('תאריך הוא שדה חובה ')
    .isDate()
    .withMessage('תאריך לא תקין '),
    validate
];

exports.validateId = [
    param('id')
    .isInt({ min: 1 })
    .withMessage('ID חייב להיות מספר שלם חיובי'),
  validate 
];