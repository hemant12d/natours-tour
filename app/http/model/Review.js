const res = require('express/lib/response');
const mongoose = require('mongoose');
const Tour = require('./Tour');
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
        required: [true, "Rating field can't be empty"],
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


reviewSchema.index({tour:1, user: 1}, {unique: true}); 


// Populate the query with query M/W
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


/**
 * 
 * @param {MongoDB Id} tourId 
 */

// In static method this refers to the current model
reviewSchema.statics.calAverageRating = async function (tourId) {
   
    const aggregatePipeLine = [
        {
            $match: { 
                tour: tourId
            }
        },
        {
            $group: {
                _id: '$tour',
                ntour: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]

    try {
        const stats = await this.aggregate(aggregatePipeLine);
        if(stats.length > 0) {
            const { ntour, avgRating } = stats[0];
            await Tour.findByIdAndUpdate(tourId, { ratingsAverage: avgRating, ratingsQuantity: ntour });
        }
        else{
            await Tour.findByIdAndUpdate(tourId, { ratingsAverage: 4.5, ratingsQuantity: 0 });
        }
    }
    catch (err) {
        console.log(err.message);
    }
}

// Document M/W
reviewSchema.post('save', async function () {
    // Calculate the rating & insert to the following tour
    const tourId = this.tour;
    await this.constructor.calAverageRating(tourId);
});


//This will work with both methods findByIdAndUpdate & findByIdAndDelete ( Query M/W )
reviewSchema.pre(/^findOneAnd/, async function (next) {
    // Save this to available this to post middleware
    this.review = await this.findOne().clone();
    next();
});


reviewSchema.post(/^findOneAnd/, async function () {

    // if review not exists then not calculate the average rating for tour
    if (this.review) await this.review.constructor.calAverageRating(this.review.tour);

})


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;