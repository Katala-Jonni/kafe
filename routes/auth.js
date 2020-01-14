const crypto = require('crypto');
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { registerValidators, loginValidators } = require('../utils/validators');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const keys = require('../keys');
const User = require('../models/user');
const regEmail = require('../emails/registration');
const resEmail = require('../emails/reset');

const transporter = nodemailer.createTransport(sendgrid({
    auth: { api_key: keys.SENDGRID_API_KEY },
}));

const router = Router();

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError'),
    });
});

router.get('/logout', async (req, res) => {
    // req.session.isAuthenticated = false;
    // очищаем сессию
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    });
});

router.get('/reset', async (req, res) => {
    try {
        res.render('auth/reset', {
            title: 'Забыли пароль',
            error: req.flash('error'),
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login');
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() },
        });
        if (!user) {
            return res.redirect('/auth/login');
        }
        const { _id } = user;
        return res.render('auth/password', {
            title: 'Восттановить доступ',
            error: req.flash('error'),
            userId: _id.toString(),
            token: req.params.token,
        });
    } catch (e) {
        return console.log(e);
    }
});


router.post('/login', loginValidators, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('loginError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/login#login');
        }
        const { email, password } = req.body;
        const candidate = await User.findOne({ email });
        if (candidate) {
            const isSame = await bcrypt.compare(password, candidate.password);
            if (isSame) {
                // const user = await User.findById('5e1760c73402b60bc5586bc9');
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                // функциональность выше, может произойти после того, как мы заредиректимся
                // поэтому в сессии есть метод save, котрый поможет избежать данную ситуацию
                return req.session.save((err) => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/');
                });
            }
            req.flash('loginError', 'Введите корректные данные');
            return res.redirect('/auth/login#login');
        }
        req.flash('loginError', 'Введите корректные данные');
        return res.redirect('/auth/login#login');
    } catch (e) {
        return console.log(e);
    }
});

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {
            email,
            password,
            name,
        } = req.body;
        // const candidate = await User.findOne({ email });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/login#register');
        }

        // шифрование
        const hashPassword = await bcrypt.hash(password, 13);
        const user = new User({
            email,
            password: hashPassword,
            name,
            cart: { items: [] },
        });
        await user.save();
        res.redirect('/auth/login#login');
        // рекомендуется делать после редиректов, так как это стронний сервис
        return await transporter.sendMail(regEmail(email));
    } catch (e) {
        return console.log(e);
    }
});

router.post('/reset', (req, res) => {
    try {
        return crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Что-то пошло не так, повторите попытку позже');
                return res.redirect('/auth/reset');
            }
            const token = buffer.toString('hex');
            const candidate = await User.findOne({ email: req.body.email });
            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 4000;
                await candidate.save();
                await transporter.sendMail(resEmail(candidate.email, token));
                return res.redirect('/auth/login');
            }
            req.flash('error', 'Такого email нет');
            return res.redirect('/auth/reset');
        });
    } catch (e) {
        return console.log(e);
    }
});

router.post('/password', async (req, res) => {
    try {
        const { userId, token, password } = req.body;
        const user = await User.findOne({
            _id: userId,
            resetToken: token,
            resetTokenExp: { $gt: Date.now() },
        });

        if (user) {
            user.password = await bcrypt.hash(password, 13);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            return res.redirect('/auth/login');
        }
        req.flash('error', 'Время жизни токена истелко');
        return res.redirect('/auth/login');
    } catch (e) {
        return console.log(e);
    }
});

module.exports = router;
