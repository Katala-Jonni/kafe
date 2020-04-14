const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res
        .status(200)
        .render('contact', {
            title: 'Как нас найти',
            isContact: true,
            isHeaderAbsolute: true,
        });
});

module.exports = router;
