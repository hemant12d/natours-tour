const Review = require('../model/Review');
const factory = require('./factoryFunctionController');


const reviewController = {
    getAllReviews: factory.getAll(Review),

    addingParameter: (req, res, next) => {
        if (!req.body.tour) req.body.tour = req.params.tourId;
        if (!req.body.user) req.body.user = req.user._id;
        next();
    },

    createReview: factory.createOne(Review),

    // Get, Update & Delete review using id
    getReview: factory.getOne(Review),
    deleteReview: factory.deleteOne(Review),
    updateReview: factory.updateOne(Review)

}

module.exports = reviewController;