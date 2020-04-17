const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        get: (v) => {
            const otherText = v.slice(1, v.length);
            return `${v[0].toUpperCase()}${otherText}`;
        },
        set: (v) => v.toLowerCase()
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectID,
                ref: 'Product',
                required: true
            }
        }
    ],
    active: {
        type: Boolean,
        default: true
    },
    position: {
        type: Number,
        min: 1,
        default: 1
    }
});

module.exports = model('Category', categorySchema);
