const { Router } = require('express');

const router = Router();

const Category = require('../models/category');
const Product = require('../models/product');

router.get('/product/:id', async (req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const product = await Product
            .findById({ _id: id })
            .select({ __v: 0 })
            .populate('categoryId')
            .exec();

        console.log(product);
        // const category = new Category({
        //     name: 'Завтраки'
        // });
        // const data = [
        //     { name: 'Ассорти' },
        //     { name: 'супы' },
        //     { name: 'салаты' },
        //     { name: 'Блюда из птицы' },
        //     { name: 'Блюда из свинины' },
        //     { name: 'блюда из говядины' },
        //     { name: 'Блюда из рыбы' },
        //     { name: 'гарниры' },
        //     { name: 'Шашлыки' },
        //     { name: 'пиццы' },
        //     { name: 'холодные напитки' },
        //     { name: 'топинги' },
        //     { name: 'бизнес ланч' },
        //     { name: 'десерты' },
        //     { name: 'выпечка' }
        // ];
        // await Category.insertMany(data);
        return res
            .status(200)
            .render('product', {
                title: `${product.name} кафе Солнцевой Петрозаводск`,
                isProduct: true,
                isHeaderAbsolute: true,
                product
            });
    } catch (e) {
        return console.log(e);
    }
});

// POST
router.post('/product', async (req, res) => {
    try {
        console.log(req.params);
        return res
            .status(200)
            .render('product', {
                title: 'Продукт',
                isProduct: true,
                isHeaderAbsolute: true
            });
    } catch (e) {
        return console.log(e);
    }
});

module.exports = router;
