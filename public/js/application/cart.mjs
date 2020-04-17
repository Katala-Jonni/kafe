import backend from './backend.mjs';
import storage from './storage.mjs';

const { Cart, api } = backend;
const { getStorage, setStorage, removeStorage } = storage;
const cartId = '6af92374-bd97-40b4-9f4b-aa5d231aeeee';
//cart-total-js

const handleRemoveProduct = async (evt) => {
    evt.preventDefault();
    const target = evt.currentTarget;
    const databaseStorage = getStorage(cartId);
    const apiPath = `cart/basket/${databaseStorage}/product/${target.dataset.id}`;
    await Cart.remove(apiPath);
    await loadBasket();
};


const hiddenClass = 'visually-hidden';
const cartView = document.querySelector('.cart-total-js');
cartView.classList.add(hiddenClass);
const loadBasket = async () => {
    const databaseStorage = getStorage(cartId);
    if (!databaseStorage) {
        cartView.innerHTML = '';
        cartView.classList.add(hiddenClass);
        return;
    }
    const cart = await Cart.getCart(`${api.cart}/${databaseStorage}`);
    if (!cart.basket) {
        cartView.innerHTML = '';
        cartView.classList.add(hiddenClass);
        removeStorage(cartId);
    }
    if (!cart.message || cart.message !== 'ok') return;
    const { basket } = cart;
    const createHtml = basket.products.map((item) => {
        const { productId, count } = item;
        return `
            <div class="cart-img-details">
                <div class="cart-img-photo">
                    <a href="/shop/product/${productId._id}"><img src="img/product/total-cart.jpg" alt="${productId.name}"/></a>
                    <span class="quantity">${count}</span>
                </div>
                <div class="cart-img-contaent">
                    <a href="/shop/product/${productId._id}"><p>${productId.name}</p></a>
                    <span>₽ ${productId.price * count}</span>
                </div>
                <div class="pro-del"><button class="cart-remove-js btn btn-secondary btn-xs glyphicon glyphicon-remove" aria-hidden="true" data-id="${productId._id}"></button>
                </div>
            </div>
            <div class="clear"></div>
           `;
    });
    const html = `
                        <ul>
                            <li><a href="/cart/${basket._id}"><span class="cart-icon"><i class="fa fa-shopping-cart"></i></span>
                                <span class="cart-no cart-shop-js">Корзина ( ${basket.products.length} )</span></a>
                                <div class="mini-cart-content">
                                    ${createHtml.join()}
                                    <div class="cart-inner-bottom">
                                        <p class="total">Итого: <span class="amount">₽ ${basket.price}</span></p>
                                        <div class="clear"></div>
                                        <p class="cart-button-top"><a href="/checkout">Оформить</a></p>
                                    </div>
                                </div>
                            </li>
                        </ul>
        `;
    cartView.innerHTML = html;
    const cartRemove = document.querySelectorAll('.cart-remove-js');
    cartRemove.forEach((btn) => {
        btn.addEventListener('click', handleRemoveProduct);
    });

    cartView.classList.remove(hiddenClass);
};
loadBasket();


// добавить товар в корзину
const handleSubmitAddProduct = async (evt) => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const input = form.querySelector('input');
    const databaseStorage = getStorage(cartId);
    const body = {
        product: input.value,
        price: input.dataset.price,
        count: 1,
        id: databaseStorage || null
    };
    const { basket, message } = await Cart.addCart(api.cart, body);
    if (message.toLowerCase() === 'ok') {
        // eslint-disable-next-line no-underscore-dangle
        setStorage(cartId, basket[0]._id);
        await loadBasket();
    } else {
        console.log('Выводить ошибку');
    }
};
const AddProductForm = document.querySelectorAll('.cart-add-js');
AddProductForm.forEach((form) => {
    form.addEventListener('submit', handleSubmitAddProduct);
});
