const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { courseValidators } = require('../utils/validators');

const router = Router();

const isOwner = (course, req) => course.userId.toString() === req.user._id.toString();

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('userId', 'email name')
            .select('title price img')
            .where('price', { $lt: 29000 })
            .sort({ price: 'asc' });
        res
            .status(200)
            .render('courses', {
                title: 'Курсы',
                isCourses: true,
                courses,
                userId: req.user ? req.user._id.toString() : null,
            });
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res
            .status(200)
            .render('course', {
                layout: 'empty',
                title: `Курс ${course.title}`,
                course,
            });
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id/edit', auth, async (req, res) => {
    try {
        if (!req.query.allow) {
            return res.redirect('/');
        }
        const course = await Course.findById(req.params.id);
        if (!isOwner(course, req)) {
            return res.redirect('/courses');
        }
        return res.render('course-edit', {
            title: `Редактировать ${course.title}`,
            course,
            error: req.flash('editData'),
        });
    } catch (e) {
        return console.log(e);
    }
});

router.post('/edit', auth, courseValidators, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('editData', errors.array()[0].msg);
            return res
                .status(422)
                .redirect(`${req.body.id}/edit?allow=true`);
        }
        const course = await Course.findById(req.body.id);
        if (!isOwner(course, req)) {
            return res.redirect('/courses');
        }
        Object.assign(course, req.body);
        await course.save();
        // await Course.updateOne(req.body);
        return res.redirect('/courses');
    } catch (e) {
        return console.log(e);
    }
});

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id,
        });
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
