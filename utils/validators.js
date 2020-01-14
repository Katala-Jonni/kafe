const { body } = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Укажите верный email')
        .custom(async (value, { req }) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    return Promise.reject('Пользователь с таким email уже существует');
                }
            } catch (e) {
                return console.log(e);
            }
        })
        .normalizeEmail(),
    body('password', 'Пароль должен быть миниму 6 символов')
        .isLength({ min: 6, max: 56 })
        .isAlphanumeric()
        .trim(),
    body('confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать');
        }
        return true;
    })
        .trim(),
    body('name').isLength({ min: 3 }).withMessage('Имя должно быть минимум 3 символа')
        .trim(),
];

exports.loginValidators = [
    body('email')
        .isEmail().withMessage('Укажите верный email')
        .normalizeEmail()
        .escape(),
    body('password', 'Неверно указан логин или пароль')
        // .isLength({ min: 6, max: 56 })
        .isAlphanumeric()
        .trim()
        .escape(),
];

exports.courseValidators = [
    body('title').isLength({ min: 3 }).withMessage('Минимальная длина названия 3 символа').trim(),
    body('price').isNumeric().withMessage('Введите корректную цену'),
    body('img').isURL().withMessage('Введите кооректный url'),
];
