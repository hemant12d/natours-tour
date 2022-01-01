// { mergeParams: true } => now this router can access the params of another router

const router = require('express').Router({ mergeParams: true });
const reviewController = require('../app/http/controllers/reviewController');
const authController = require('../app/http/controllers/authController');

// Get all the reviews or create new reviews

router.use(authController.protect);

router.route('/')
    .get(authController.access('Admin', 'Lead-Guide'), reviewController.getAllReviews)
    .post(authController.access('User'), reviewController.addingParameter, reviewController.createReview);

router.route('/:id')
    .get(authController.access('Admin'), reviewController.getReview)
    .patch(authController.access('Admin', 'User'), reviewController.updateReview)
    .delete(authController.access('Admin', 'User'), reviewController.deleteReview);

module.exports = router;
