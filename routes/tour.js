const express = require('express')
const router = express.Router()
const tourController = require('../app/http/controllers/tourController');
const authController = require('../app/http/controllers/authController');
const reviewController = require('../app/http/controllers/reviewController');
const tourMiddleware = require('../app/middleware/tourMiddleware');
const reviewRouter = require('../routes/review');

// mounting router

// Request will be go to reviewRouter's home end point
router.use('/:tourId/reviews', reviewRouter);

// A new unique way of single route for update, find & delete a single document
router.route('/')
    .get(tourController().getAllTour)
    .post(
        authController.protect,
        authController.access('Admin', 'Lead-Guide'),
        tourController().createTour
    );

router.route('/:id')
    .get(tourController().getTour)
    .patch(
        authController.protect,
        authController.access('Admin', 'Lead-Guide'),
        tourController().updateTour
    )
    .delete(
        authController.protect,
        authController.access('Admin', 'Lead-Guide'),
        tourController().deleteTour
    );

// Let's do with self :) => Hurray🥳, You did it !!
router.route('/alias/top5tours').get(tourMiddleware.topFiveTour, tourController().getAllTour);
router.route('/alias/top5cheap').get(tourMiddleware.topFiveCheap, tourController().getAllTour);


// Get aggrate overview from documentation (Have any doubt regarding aggregate then, look back to udemy tutorial)
router.route('/aggregate/overview').get(tourController().tourOverview);

router.route('/aggregate/busymonth/:year')
    .get(
        authController.protect,
        authController.access('Admin', 'Lead-Guide', 'Guide'),
        tourController().busyMonth
    );


// Geo Special Queries
// /tours-within/233/center/34.111745,-118.113491/unit/mi


// Tour within distance
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController().toursWithIn);


router.route('/tours-nearMe/:latlng/unit/:unit').get(tourController().tourNearMe);

module.exports = router;