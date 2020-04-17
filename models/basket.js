const { Schema, model } = require('mongoose');

const basketSchema = new Schema({
    products: [
        {
            productId: {
                type: Schema.Types.ObjectID,
                ref: 'Product',
                required: true
            },
            count: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            }
        }
    ],
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    clientId: {
        type: String,
        required: true,
        trim: true
    },
    discount: {
        type: Number,
        min: 0,
        default: 0
    },
    coupon: {
        type: String,
        trim: true
    },
    delivery: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Basket', basketSchema);
