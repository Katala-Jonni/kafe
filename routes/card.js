const { Router } = require('express');
// const Card = require('../models/card');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const User = require('../models/user');


const mapCartItems = (cart) => {
    return cart.items.map((c) => ({
        // уббрать метадату
        ...c.courseId._doc,
        count: c.count,
        id: c.courseId.id
    }));
};

const computePrice = (courses) => courses.reduce((total, item) => total + (item.count * item.price), 0);

const router = Router();

router.get('/', auth, async (req, res) => {
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();

    const courses = mapCartItems(user.cart);

    res
        .status(200)
        .render('card', {
            isCard: true,
            title: 'Корзина',
            courses,
            price: computePrice(courses)
        });
});

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    const courses = mapCartItems(user.cart);
    const cart = {
        courses,
        price: computePrice(courses)
    };
    res
        .status(200)
        .json(cart);
});

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);
    res.redirect('/card');
});

module.exports = router;
