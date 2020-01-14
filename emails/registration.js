const keys = require('../keys');

module.exports = (email) => ({
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Аккаунт создан',
    html: `
            <h1>Добро пожаловать в наш магазин</h1>
            <p>Вы успешно создали свой аккаунт с email ${email}</p>
            <hr/>
            <a href="${keys.BASE_URL}">Магазин курсов</a>
        `,
});
