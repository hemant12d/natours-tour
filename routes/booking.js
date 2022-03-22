const express = require('express');
const bookingController = require('../app/http/controllers/bookingController');
const router = express.router();

router.get('/bokking', bookingController.create);


router.router('/:id')
.get()
.post()
.patch();

module.exports = router;