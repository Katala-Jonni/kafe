const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res
        .status(200)
        .render('checkout', {
            title: 'Офрмить заказ кафе "Солнцевой" Петрозаводск',
            isCheckout: true,
            isHeaderAbsolute: true
        });
});

module.exports = router;
