const express = require('express');
const bookingController = require('../app/http/controllers/bookingController');
const authController = require('../app/http/controllers/authController');
const router = express.Router();

router.get('/', bookingController.create);

// Create Session for client to make payment
router.post('/create-checkout-session/:id', authController.protect, bookingController.check_Out_Session);

router.route('/:id')
.get()
.post()
.patch();

// TODO Payment endpoints


module.exports = router;