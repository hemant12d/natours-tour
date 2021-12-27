const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({

    review: {
        type: String,
        required: [true, "Review field can't be empty"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "Review must be belong to user"]
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Review must be belong to tour"]
    },
    rating: {
        type: Number,
        required: [true, "Rating fields can't be empty"],
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }

},

    // Virtual Proties
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }

);


// Populate the query
reviewSchema.pre(/^find/, function (next) {
    // this.populate(
    //     {
    //         path: "user",
    //         select: "name, photo"
    //     })
    //     .populate(
    //         {
    //             path: "tour",
    //             select: "name"
    //         }
    //     );
    this.populate(
        {
            path: "user",
            select: "name, photo"
        });

    next();
});




const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;