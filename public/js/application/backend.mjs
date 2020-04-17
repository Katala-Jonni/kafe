class Cart {
    static async getCart(apiName) {
        try {
            const result = await fetch(apiName);
            return result.json();
        } catch (e) {
            return console.error(e);
        }
    }

    static async addCart(apiName, body) {
        try {
            const res = await fetch(`${apiName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(body)
            });
            return await res.json();
        } catch (e) {
            return console.error(e);
        }
    }

    static async remove(apiName) {
        try {
            const res = await fetch(`${apiName}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
                // body: JSON.stringify(body)
            });
            return await res.json();
        } catch (e) {
            return console.error(e);
        }
    }
}

const api = {
    cart: '/cart/basket',
    deleteProduct: '/cart/basket/product'
};

// eslint-disable-next-line import/prefer-default-export
export default {
    Cart,
    api
};
