const {} = require('mongoose');

// const fs = require('fs');
// const path = require('path');
//
// const p = path.join(
//     __dirname,
//     '..',
//     'data',
//     'card.json',
// );
//
// class Card {
//     static async fetch() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(p, 'utf-8', (err, content) => {
//                 if (err) {
//                     reject(err);
//                 }
//                 resolve(JSON.parse(content));
//             });
//         });
//     }
//
//     static async remove(id) {
//         const card = await Card.fetch();
//         const idx = card.courses.findIndex((item) => item.id === id);
//         const course = card.courses[idx];
//         if (course.count === 1) {
//             card.courses = card.courses.filter((item) => item.id !== id);
//         } else {
//             card.courses[idx].count -= 1;
//         }
//         card.price -= course.price;
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 p,
//                 JSON.stringify(card),
//                 (err) => {
//                     if (err) reject(err);
//                     resolve(card);
//                 },
//             );
//         });
//     }
//
//     static async add(course) {
//         const card = await Card.fetch();
//         const currentCourse = { ...course };
//         const idx = card.courses.findIndex((c) => c.id === currentCourse.id);
//         const candidate = card.courses[idx];
//         if (candidate) {
//             candidate.count += 1;
//             card.courses[idx] = candidate;
//         } else {
//             currentCourse.count = 1;
//             card.courses.push(currentCourse);
//         }
//         card.price += +currentCourse.price;
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 p,
//                 JSON.stringify(card),
//                 (err) => {
//                     if (err) reject(err);
//                     resolve();
//                 },
//             );
//         });
//     }
// }
//
// module.exports = Card;
