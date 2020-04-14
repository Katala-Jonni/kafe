const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res
        .status(200)
        .render('delivery', {
            title: 'Доставка еды кафе "Солнцевой" Петрозаводск',
            isDelivery: true,
            isHeaderAbsolute: true
        });
});

module.exports = router;
