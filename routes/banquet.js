const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res
        .status(200)
        .render('banquet', {
            title: 'Банкеты в кафе "Солнцевой" Петрозаводск',
            isBanquet: true,
            isHeaderAbsolute: true,
        });
});

module.exports = router;
