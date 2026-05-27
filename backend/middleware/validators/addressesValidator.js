const { body,param } = require('express-validator');
const { validate } = require('./validator');

exports.validateFieldsAddress = [
  
  body('street')
  .trim()
    .notEmpty()
    .withMessage('שם הרחוב הוא שדה חובה'),
  
  body('city')
    .trim()
    .notEmpty()
    .withMessage('שם העיר הוא שדה חובה'),
    
  body('building_number')
    .notEmpty()
    .withMessage('מספר בניין הוא שדה חובה')
    .isNumeric()
    .withMessage('מספר בניין חייב להכיל מספרים בלבד'),

  validate 
];

exports.validateId = [
    param('id')
    .isInt({ min: 1 })
    .withMessage('ID חייב להיות מספר שלם חיובי'),
  validate 
];