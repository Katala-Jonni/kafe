const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res
        .status(200)
        .render('cart', {
            title: 'Моя корзина кафе "Солнцевой" Петрозаводск',
            isCart: true,
            isHeaderAbsolute: true
        });
});

module.exports = router;
