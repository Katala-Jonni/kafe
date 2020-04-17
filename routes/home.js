const { Router } = require('express');

const router = Router();

const Category = require('../models/category');
const Product = require('../models/product');


const listProducts = [
    {
        name: 'Каша рисовая2',
        price: 50,
        isSale: true,
        categoryId: '5e964420cff2097e7f6f1e20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ducimus minima nobis numquam quibusdam quisquam.',
        structure: 'Молоко, хлопья овсяные',
        weight: '300'
    },
    {
        name: 'Каша рисовая3',
        price: 50,
        isSale: true,
        categoryId: '5e964420cff2097e7f6f1e20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ducimus minima nobis numquam quibusdam quisquam.',
        structure: 'Молоко, хлопья овсяные',
        weight: '300'
    },
    {
        name: 'Каша рисовая4',
        price: 50,
        isSale: true,
        categoryId: '5e964420cff2097e7f6f1e20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ducimus minima nobis numquam quibusdam quisquam.',
        structure: 'Молоко, хлопья овсяные',
        weight: '300'
    },
    {
        name: 'Каша рисовая5',
        price: 50,
        isSale: true,
        categoryId: '5e964420cff2097e7f6f1e20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ducimus minima nobis numquam quibusdam quisquam.',
        structure: 'Молоко, хлопья овсяные',
        weight: '300'
    },
    {
        name: 'Каша рисовая6',
        price: 50,
        isSale: true,
        categoryId: '5e964420cff2097e7f6f1e20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ducimus minima nobis numquam quibusdam quisquam.',
        structure: 'Молоко, хлопья овсяные',
        weight: '300'
    },
    {
        name: 'Каша рисовая7',
        price: 50,
        isSale: true,
        categoryId: '5e964420cff2097e7f6f1e20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ducimus minima nobis numquam quibusdam quisquam.',
        structure: 'Молоко, хлопья овсяные',
        weight: '300'
    },
    {
        name: 'Каша рисовая8',
        price: 50,
        isSale: true,
        categoryId: '5e964420cff2097e7f6f1e20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ducimus minima nobis numquam quibusdam quisquam.',
        structure: 'Молоко, хлопья овсяные',
        weight: '300'
    },
    {
        name: 'Каша рисовая9',
        price: 50,
        isSale: true,
        categoryId: '5e964420cff2097e7f6f1e20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ducimus minima nobis numquam quibusdam quisquam.',
        structure: 'Молоко, хлопья овсяные',
        weight: '300'
    },
    {
        name: 'Каша рисовая10',
        price: 50,
        isSale: true,
        categoryId: '5e964420cff2097e7f6f1e20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ducimus minima nobis numquam quibusdam quisquam.',
        structure: 'Молоко, хлопья овсяные',
        weight: '300'
    },
    {
        name: 'Каша рисовая11',
        price: 50,
        isSale: true,
        categoryId: '5e964420cff2097e7f6f1e20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ducimus minima nobis numquam quibusdam quisquam.',
        structure: 'Молоко, хлопья овсяные',
        weight: '300'
    },
    {
        name: 'Каша рисовая12',
        price: 50,
        isSale: true,
        categoryId: '5e964420cff2097e7f6f1e20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ducimus minima nobis numquam quibusdam quisquam.',
        structure: 'Молоко, хлопья овсяные',
        weight: '300'
    }
];


router.get('/', async (req, res) => {
    try {
        // const category = await Category.updateMany({ active: { $exists: false } }, { active: true }, { upsert: true });

        // await Product.insertMany(listProducts);

        const category = await Category
            .find({ active: true })
            .populate('products')
            .select({ __v: 0 })
            .sort({ position: 1, name: 1 })
            .exec();

        const nPerPage = 12;
        const pageNumber = 1;

        const products = await Product
            .find({ active: true })
            .select({ __v: 0 })
            .sort({ name: 1 })
            .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
            .limit(nPerPage)
            .exec();

        const paginations = await Product.find({ active: true });
        const counts = [];
        let count = 1;
        while (count <= Math.ceil(paginations.length / nPerPage)) {
            counts.push(count);
            count += 1;
        }
        return res
            .status(200)
            .render('index', {
                title: 'Главная странца',
                isHome: true,
                category,
                products,
                categoryName: '',
                paginationCount: counts
            });
    } catch (e) {
        return console.error(e);
    }
});

router.get('/category/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category
            .find({ active: true })
            .populate('products')
            .select({ __v: 0 })
            .sort({ position: 1, name: 1 })
            .exec();

        const nPerPage = 12;
        const pageNumber = 1;

        const products = await Product
            .find({ categoryId: id, active: true })
            .select({ __v: 0 })
            .sort({ name: 1 })
            .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
            .limit(nPerPage)
            .exec();

        const paginations = await Product.find({ categoryId: id, active: true });
        const counts = [];
        let count = 1;
        while (count <= Math.ceil(paginations.length / nPerPage)) {
            counts.push(count);
            count += 1;
        }

        return res
            .status(200)
            .render('index', {
                title: 'Главная странца',
                isProduct: true,
                isHeaderAbsolute: true,
                category,
                products,
                categoryName: id,
                paginationCount: counts
            });
    } catch (e) {
        return console.log(e);
    }
});

router.get('/category/:id/:step', async (req, res) => {
    try {
        const { id, step } = req.params;

        const category = await Category
            .find({ active: true })
            .populate('products')
            .select({ __v: 0 })
            .sort({ position: 1, name: 1 })
            .exec();

        const nPerPage = 12;
        const pageNumber = +step;

        const products = await Product
            .find({ categoryId: id, active: true })
            .select({ __v: 0 })
            .sort({ name: 1 })
            .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
            .limit(nPerPage)
            .exec();

        const paginations = await Product.find({ categoryId: id, active: true });
        const counts = [];
        let count = 1;
        while (count <= Math.ceil(paginations.length / nPerPage)) {
            counts.push(count);
            count += 1;
        }
        return res
            .status(200)
            .render('index', {
                title: 'Главная странца',
                isProduct: true,
                isHeaderAbsolute: true,
                category,
                products,
                categoryName: id,
                paginationCount: counts
            });
    } catch (e) {
        return console.log(e);
    }
});

router.get('/step/:num', async (req, res) => {
    try {
        const { num } = req.params;

        const category = await Category
            .find({ active: true })
            .populate('products')
            .select({ __v: 0 })
            .sort({ position: 1, name: 1 })
            .exec();

        const nPerPage = 12;
        const pageNumber = +num;

        const products = await Product
            .find({ active: true })
            .select({ __v: 0 })
            .sort({ name: 1 })
            .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
            .limit(nPerPage)
            .exec();

        const paginations = await Product.find({ active: true });
        const counts = [];
        let count = 1;
        while (count <= Math.ceil(paginations.length / nPerPage)) {
            counts.push(count);
            count += 1;
        }
        return res
            .status(200)
            .render('index', {
                title: 'Главная странца',
                isProduct: true,
                isHeaderAbsolute: true,
                category,
                products,
                categoryName: '',
                paginationCount: counts
            });
    } catch (e) {
        return console.log(e);
    }
});


module.exports = router;
