const { body,param } = require('express-validator');
const { validate } = require('./validator');

exports.validateFieldsCompanies = [

  body('name')
  .trim()
    .notEmpty()
    .withMessage('שם החברה הוא שדה חובה'),
  body('address_id')
    .notEmpty()
    .withMessage('מזהה כתובת הוא שדה חובה')
    .isNumeric()
    .withMessage('מזהה כתובת חייב להכיל מספרים בלבד'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('קטגוריה היא שדה חובה'),
  validate
];

exports.validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID חייב להיות מספר שלם חיובי'),
  validate
];
