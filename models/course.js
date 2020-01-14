const { Schema, model } = require('mongoose');

const course = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectID,
        ref: 'User',
    },
});

course.method('toClient', function () {
    const c = this.toObject();
    c.id = c._id;
    delete c._id;
    return c;
});

module.exports = model('Course', course);


// const uuid = require('uuid/v4');
// const fs = require('fs');
// const path = require('path');
//
// class Course {
//     constructor({ title, price, img }) {
//         this.title = title;
//         this.price = price;
//         this.img = img;
//         this.id = uuid();
//     }
//
//     getData() {
//         return {
//             title: this.title,
//             price: this.price,
//             img: this.img,
//             id: this.id,
//         };
//     }
//
//     async save() {
//         const courses = await Course.getAll();
//         courses.push(this.getData());
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if (err) {
//                         reject(err);
//                     }
//                     resolve();
//                 },
//             );
//         });
//     }
//
//     static getAll() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 'utf-8',
//                 (err, content) => {
//                     if (err) {
//                         reject(err);
//                     }
//                     resolve(JSON.parse(content));
//                 },
//             );
//         });
//     }
//
//     static async getById(id) {
//         const courses = await Course.getAll();
//         return courses.find((item) => id === item.id);
//     }
//
//     static async update(course) {
//         const courses = await Course.getAll();
//         const idx = courses.findIndex((item) => item.id === course.id);
//         courses[idx] = course;
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if (err) {
//                         reject(err);
//                     }
//                     resolve();
//                 },
//             );
//         });
//     }
// }
//
// module.exports = Course;
