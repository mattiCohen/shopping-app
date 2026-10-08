const {body, param} = require('express-validator');
const {validate} = require('./validator');

exports.validateFieldsSuppliers = [
body('phone')
  .trim()
.notEmpty()
.withMessage('מספר טלפון הוא שדה חובה ')
    .matches(/^0\d{8,9}$/)
    .withMessage('מספר טלפון לא תקין'),
body('first_name')
  .trim()
.notEmpty()
.withMessage('שם פרטי הוא שדה חובה '),
body('last_name')
  .trim()
.notEmpty()
.withMessage('שם משפחה הוא שדה חובה '),
body('company_id')
.notEmpty()
.withMessage('מזהה חברה הוא שדה חובה ')
.isNumeric()
.withMessage('מזהה חברה חייב להיות מספר'),
    validate
];

exports.validateId = [
    param('id')
    .isInt({ min: 1 })
    .withMessage('ID חייב להיות מספר שלם חיובי'),
  validate 
];