const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res
        .status(200)
        .render('about', {
            title: 'О кафе "Солнцевой Петрозаводск"',
            isAbout: true,
            isHeaderAbsolute: true,
        });
});

module.exports = router;
