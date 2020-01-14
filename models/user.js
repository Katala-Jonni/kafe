const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: String,
    password: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                courseId: {
                    required: true,
                    type: Schema.Types.ObjectID,
                    ref: 'Course',
                },
            },
        ],
    },
    avatarUrl: String,
    resetToken: String,
    resetTokenExp: Date,
});

// расширяет схему и добавялет функции
userSchema.methods.addToCart = function (courses) {
    // обязательно использовать слово function так как нужен контекст
    const items = [...this.cart.items];
    const { _id } = courses;
    // Schema.Types.ObjectID приводим к тексту
    const idx = items.findIndex((c) => c.courseId.toString() === _id.toString());
    if (idx >= 0) {
        items[idx].count += 1;
    } else {
        items.push({
            courseId: _id,
            count: 1,
        });
    }
    this.cart = { items };
    // сохраняем
    return this.save();
};

userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items];
    const idx = items.findIndex((c) => c.courseId.toString() === id.toString());
    if (idx >= 0 && items[idx].count > 1) {
        items[idx].count -= 1;
    } else {
        items = items.filter((c) => c.courseId.toString() !== id.toString());
    }
    this.cart = { items };
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};

module.exports = model('User', userSchema);
