const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');
const { validationResult } = require('express-validator');

const router = Router();

router.get('/', auth, (req, res) => {
    res
        .status(200)
        .render('add', {
            title: 'Добавть курс',
            isAdd: true,
        });
});

router.post('/', auth, courseValidators, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res
                .status(422)
                .render('add', {
                    title: 'Добавть курс',
                    isAdd: true,
                    error: req.flash('error'),
                    data: {
                        title: req.body.title,
                        price: req.body.price,
                        img: req.body.img,
                    },
                });
            // .redirect('/courses');
        }
        const course = new Course({
            title: req.body.title,
            price: req.body.price,
            img: req.body.img,
            userId: req.user,
        });
        await course.save();
        return res.redirect('/courses');
    } catch (e) {
        return console.log(e);
    }
});

module.exports = router;
