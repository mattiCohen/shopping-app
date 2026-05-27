const { body } = require('express-validator');
const { validate } = require('./validator');

exports.validateRegister = [
  body('email').trim().notEmpty().withMessage('נא למלא אימייל').isEmail().withMessage('אימייל לא תקין'),
  body('password').notEmpty().withMessage('נא למלא סיסמה').isLength({ min: 6 }).withMessage('סיסמה לפחות 6 תווים'),
  validate
];

exports.validateLogin = [
  body('email').trim().notEmpty().withMessage('נא למלא אימייל').isEmail().withMessage('אימייל לא תקין'),
  body('password').notEmpty().withMessage('נא למלא סיסמה'),
  validate
];