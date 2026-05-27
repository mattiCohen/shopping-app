const { body,param } = require('express-validator');
const { validate } = require('./validator');

exports.validateFieldCartItems = [

  body('shopping_cart_id')
    .notEmpty()
    .withMessage('מזהה עגלת קניות הוא שדה חובה')
    .isNumeric()
    .withMessage('מזהה עגלת קניות חייב להכיל מספרים בלבד'),
  
  body('product_id')
    .notEmpty()
    .withMessage('מזהה מוצר הוא שדה חובה')
    .isNumeric()
    .withMessage('מזהה מוצר חייב להכיל מספרים בלבד'),
    
  body('quantity')
   .notEmpty()
    .withMessage('כמות היא שדה חובה')
    .isNumeric()
    .withMessage('הכמות חייבת להכיל מספרים בלבד'),
    

  validate 
];

exports.validateId = [
    param('id')
    .isInt({ min: 1 })
    .withMessage('ID חייב להיות מספר שלם חיובי'),
  validate 
];