const { Router } = require('express');
const uuid = require('uuid/v4');

const router = Router();

const Product = require('../models/product');
const Basket = require('../models/basket');
const Card = require('../models/card');

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const basket = await Basket
            .findById(id)
            .select({ __v: 0 })
            .populate('products.productId')
            .exec();
        return res
            .status(200)
            .render('cart', {
                title: 'Моя корзина кафе "Солнцевой" Петрозаводск',
                isCart: true,
                isHeaderAbsolute: true,
                basket: basket || null,
                message: basket ? 'ok' : 'Ваша корзина пуста'
            });
    } catch (e) {
        return res
            .status(404)
            .render('cart', {
                title: 'Моя корзина кафе "Солнцевой" Петрозаводск',
                basket: null,
                isCart: true,
                isHeaderAbsolute: true,
                message: 'Такой страницы нет'
            });
    }
});


const mapCartItems = (cart) => {
    return cart.items.map((c) => ({
        // уббрать метадату
        ...c.courseId._doc,
        count: c.count,
        id: c.courseId.id
    }));
};

const computePrice = (courses) => courses.reduce((total, item) => {
    return total + (item.count * item.price);
}, 0);

// router.get('/', async (req, res) => {
//     // const user = await req.user
//     //     .populate('cart.items.courseId')
//     //     .execPopulate();
//
//     // const courses = mapCartItems(user.cart);
//
//     const product = await Card.fetch();
//
//     res
//         .status(200)
//         .render('cart', {
//             title: 'Моя корзина кафе "Солнцевой" Петрозаводск',
//             isCart: true,
//             isHeaderAbsolute: true,
//             product
//         });
//
//     // res
//     //     .status(200)
//     //     .render('card', {
//     //         isCard: true,
//     //         title: 'Корзина',
//     //         courses,
//     //         price: computePrice(courses),
//     //     });
// });

// router.delete('/remove/:id', auth, async (req, res) => {
//     await req.user.removeFromCart(req.params.id);
//     const user = await req.user.populate('cart.items.courseId').execPopulate();
//     const courses = mapCartItems(user.cart);
//     const cart = {
//         courses,
//         price: computePrice(courses),
//     };
//     res
//         .status(200)
//         .json(cart);
// });

router.get('/basket/:id', async (req, res) => {
    try {
        const basket = await Basket
            .findById(req.params.id)
            .select({ __v: 0 })
            .populate('products.productId')
            .exec();
        return res
            .status(200)
            .json({
                basket: basket || null,
                message: basket ? 'ok' : null
            });
    } catch (e) {
        return res
            .status(500)
            .json({
                basket: null,
                message: 'Что-то пошло не так! Не отчаивайтесь, попробуйте снова :)))'
            });
    }
});

router.post('/basket', async (req, res) => {
    try {
        const {
            id,
            product,
            count,
            price
        } = req.body;
        // Поиск товара
        const goods = await Product.findById(product);
        if (!goods) {
            return res
                .status(200)
                .json({
                    basket: null,
                    message: 'Такого продукта нет'
                });
        }
        // Поиск корзины
        const basket = await Basket.findById(id);
        if (!basket) {
            console.log('Создание корзины');
            const clientId = uuid();
            // Создание корзины
            const newBasket = new Basket({
                products: [{
                    productId: product,
                    count: +count
                }],
                price: +price,
                clientId
            });
            await newBasket.save();
            const cart = await Basket
                .find({ clientId })
                .select({ __v: 0 })
                .populate('products.productId')
                .exec();

            return res
                .status(200)
                .json({
                    basket: cart,
                    message: 'ok'
                });
        }
        // если корзина есть в базе
        const candidate = basket.products.findIndex((el) => `${el.productId}` === `${product}`);
        // проверка на наличии товара в корзине
        if (candidate >= 0) {
            basket.products[candidate].count += +count;
        } else {
            basket.products.push({
                productId: product,
                count: +count
            });
        }
        basket.price += +price;
        await basket.save();
        const cart = await Basket
            .find({ _id: id })
            .select({ __v: 0 })
            .populate('products.productId')
            .exec();

        return res
            .status(200)
            .json({
                basket: cart,
                message: 'ok'
            });
    } catch (e) {
        return res
            .status(500)
            .json({
                basket: null,
                message: 'Что-то пошло не так! Не отчаивайтесь, попробуйте снова :)))'
            });
    }
});
router.post('/remove/:id', async (req, res) => {
    try {
        return res.redirect('/#main-shop');
    } catch (e) {
        return res
            .status(500)
            .json({
                basket: null,
                message: 'Что-то пошло не так! Не отчаивайтесь, попробуйте снова :)))'
            });
    }
});

router.delete('/basket/:basketId/product/:id', async (req, res) => {
    try {
        const { basketId, id } = req.params;
        const basket = await Basket
            .findById(basketId)
            .populate('products.productId')
            .select({ __v: 0 })
            .exec();

        let sum = 0;
        const basketFilter = basket.products.filter((item) => {
            const { productId: { _id, price }, count } = item;
            if (`${_id}` === id) {
                sum = +price * +count;
            }
            return `${_id}` !== id;
        });
        if (!basketFilter.length) {
            await Basket
                .deleteOne({ _id: basketId })
                .exec();
            return res
                .status(200)
                .json({
                    basket: null,
                    message: null
                });
        }
        basket.products = basketFilter;
        basket.price -= sum;
        await basket.save();
        const newBasket = await Basket
            .findById(basketId)
            .select({ __v: 0 })
            .populate('products.productId')
            .exec();
        return res
            .status(200)
            .json({
                basket: newBasket || null,
                message: newBasket ? 'ok' : null
            });
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({
                basket: null,
                message: 'Что-то пошло не так! Не отчаивайтесь, попробуйте снова :)))'
            });
    }
});

router.post('/add', async (req, res) => {
    const product = await Product.findById(req.body.id);
    // console.log(product);
    await Card.add(product);
    // await req.user.addToCart(course);
    res.redirect('/cart');
});

module.exports = router;
