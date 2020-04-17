const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        get: (v) => {
            const otherText = v.slice(1, v.length);
            return `${v[0].toUpperCase()}${otherText}`;
        },
        set: (v) => v.toLowerCase()
    },
    price: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    oldPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    isSale: {
        type: Boolean,
        required: true,
        default: false
    },
    categoryId: {
        type: Schema.Types.ObjectID,
        ref: 'Category',
        required: true
    },
    img: [],
    // title: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     trim: true,
    //     get: (v) => {
    //         const otherText = v.slice(1, v.length);
    //         return `${v[0].toUpperCase()}${otherText}`;
    //     },
    //     set: (v) => v.toLowerCase()
    // },
    description: {
        type: String,
        required: true,
        // unique: true,
        trim: true,
        get: (v) => {
            const otherText = v.slice(1, v.length);
            return `${v[0].toUpperCase()}${otherText}`;
        },
        set: (v) => v.toLowerCase()
    },
    tags: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            title: {
                type: String,
                required: true,
                trim: true
            },
            color: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],
    structure: {
        type: String,
        required: true,
        trim: true
    },
    weight: {
        type: String,
        required: true,
        trim: true
    },
    countPopular: {
        type: Number,
        default: 0,
        min: 0
    }
});

module.exports = model('Product', productSchema);
