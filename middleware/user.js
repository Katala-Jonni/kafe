const User = require('../models/user');

module.exports = async (req, res, next) => {
    try {
        // if (!req.session.user) {
        //     return next();
        // }
        // req.user = await User.findById(req.session.user._id);
        return next();
    } catch (e) {
        return console.log(e);
    }
};
