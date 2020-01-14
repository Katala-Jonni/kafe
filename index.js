const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
// автоматически сохраянет сессии в базе данных
const MongoDBStore = require('connect-mongodb-session')(session);
// передавать данные, редирект не умеет, пользуемся пактеом
const flash = require('connect-flash');
const mongoose = require('mongoose');
// защита csrf
const csrf = require('csurf');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const keys = require('./keys');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const fileMiddleware = require('./middleware/file');
const errorHandler = require('./middleware/error');
const hbsHelpers = require('./utils/hbs-helpers');

const app = express();
const store = new MongoDBStore({
    uri: keys.MONGODB_URI,
    collection: 'sessions',
});

// создание hbs
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: hbsHelpers,
});

// регистрируем в express движок handlebarse
app.engine('hbs', hbs.engine);
// используем движок
app.set('view engine', 'hbs');
// указываем, где лежат views
app.set('views', 'views');

// раздаем всю статику
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));
// настраиваем сессию
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
}));
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
// защита приложения заголовки в ответе добавляются
app.use(helmet());
// оптимизация статических файлов
app.use(compression());
// сессия проверяется
app.use(varMiddleware);
app.use(userMiddleware);

// Настроили роуты в отдельных файлах
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true, useUnifiedTopology: true,
        });
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();
