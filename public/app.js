const toCurrency = (price) => new Intl.NumberFormat('ru-Ru',
    {
        currency: 'rub',
        style: 'currency',
        minimumFractionDigits: 0,
    })
    .format(price);

document.querySelectorAll('.price').forEach((node) => {
    const elem = node;
    elem.textContent = toCurrency(elem.textContent);
});

const toDate = (date) => new Intl.DateTimeFormat('ru-Ru',
    {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
    .format(new Date(date));

document.querySelectorAll('.js-date').forEach((node) => {
    node.textContent = toDate(node.textContent);
});


const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', (event) => {
        if (event.target.classList.contains('js-remove')) {
            const { id, csrf } = event.target.dataset;
            fetch(`/card/remove/${id}`, {
                method: 'delete',
                // body: JSON.stringify({
                //     _csrf: csrf,
                // }),
                headers: {
                    'X-XSRF-TOKEN': csrf,
                },
            })
                .then((card) => card.json())
                .then((card) => {
                    if (card.courses.length) {
                        const html = card.courses.map((item) => `<tr>
                                <td>${item.title}</td>
                                <td>${item.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${item.id}"  data-csrf="${csrf}">Удалить</button>
                                </td>
                            </tr>`).join('');
                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.price').textContent = toCurrency(card.price);
                    } else {
                        $card.innerHTML = '<p>Корзина пуста</p>';
                    }
                });
        }
    });
}

// инициализация табов
var instance = M.Tabs.init(document.querySelectorAll('.tabs'));

const tabs = document.querySelectorAll('.tab');
if (tabs.length) {
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            console.log('click');
            const alerts = document.querySelectorAll('.js-alert');
            if (alerts.length) {
                alerts.forEach((alert) => alert.remove());
            }
        });
    });
}
