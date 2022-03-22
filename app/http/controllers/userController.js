const User = require('../model/User');

const factory = require('./factoryFunctionController');

const UserController = {
    addedIdToReq: (req, res, next) => {
        req.params.id = req.user._id;
        next();
    },

    getAllUser: factory.getAll(User),     

    deleteUser: factory.deleteOne(User),

    // Do not update the password on this route
    updateUser: factory.updateOne(User),

    getUser: factory.getOne(User)

}

module.exports = UserController;
