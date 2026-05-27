const { body, param } = require('express-validator');
const { validate } = require('./validator');

exports.validateFieldsCustomer = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('כתובת אימייל היא שדה חובה'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('מספר טלפון הוא שדה חובה')
    .isNumeric()
    .withMessage('מספר טלפון חייב להיות מספר')
      .matches(/^0\d{8,9}$/)
   .withMessage('מספר טלפון לא תקין'),


  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('שם פרטי הוא שדה חובה'),

  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('שם משפחה הוא שדה חובה'),
  body('address_id')
    .notEmpty()
    .withMessage('מזהה כתובת הוא שדה חובה')
    .isNumeric()
    .withMessage('מזהה כתובת חייב להכיל מספרים בלבד'),
  validate
];

exports.validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID חייב להיות מספר שלם חיובי'),
  validate
];