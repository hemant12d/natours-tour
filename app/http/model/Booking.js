const mongoose = require('mongoose');

let schema = mongoose.Schema;


let bookingSchema = new schema({
    user: {
        type: schema.ObjectId,
        ref: 'User',
        required: [true, "Booking must be belong to user"]
    },
    tour:{
        type: schema.ObjectId,
        ref: 'Tour',
        required: [true, "Booking belong to tour"]
    },
    totalSeats: {
        type: Number,
        default: 1,
        min: [1, "User have to book atleast one seat in tour"],
    },
    paymentMethod: {
        type: String,
        enum: ["gpay", "debitcard"],
        default: "debitcard",
    },
    couponCode: {
        type: String,
        default: null
    },
    totalPrice: {
        type: Number,
        min: [0, "Total Price can't be lower than 0"]
    }
},
{
    timestamps: true
});


// Compile model

let Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;