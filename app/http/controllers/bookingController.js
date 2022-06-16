require('dotenv').config(); // Load env variables
const CatchAsyncError = require("../../utils/CatchAsyncError");
const stripe = require('stripe')(process.env.STRIPE_TEST_PRIVATE_KEY);
const Tour = require('../model/Tour');

const bookingController = {
    create: (req, res, next)=>{
        // create booking
    },
    check_Out_Session: CatchAsyncError(async (req, res, next)=>{
        const tour = await Tour.findById(req.params.id);
        // Create session with general information of booking object
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: req.user.email,
            success_url: 'http://127.0.0.1:8000/success',
            cancel_url: 'http://127.0.0.1:8000/cancel',
            client_reference_id: tour._id,
            line_items: [
              {
                  currency: 'usd',
                  name: tour.name,
                  amount: tour.price,
                  quantity: 1,
              },
            ],
        });
        
        // send session to client
        res.status(200).json({
            status: 'success',
            session
        });
    })
}

module.exports = bookingController;