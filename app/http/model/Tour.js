const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: [true, "Tour with the follwing name is already exists"],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"],
        enum: ['Hard', "Easy", "Difficulty"]
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have price"]
    },
    priceDiscount: {
        type: Number,
        default: 0
    },
    summary: {
        type: String,
        required: [true, "A tour must have a summary"]
    },
    description: {
        type: String,
        required: [true, "A tour must have a description"]
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a cover image"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    startDates: [Date],

    startLocation: {
        // GeoJSON Data (Describe place on earth using cordinates)
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
        },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
        
    ]
        
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


// mongoose index concept for improve performance
tourSchema.index({price:1, ratingsAverage: -1}); 
tourSchema.index({startLocation:'2dsphere'}); 

// Virtual properties to create the virtual fields
tourSchema.virtual('daysInWeek').get(function () {
    return (this.duration / 7).toFixed(2);
});


// Virtual Populate for parent referencing
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
    // count: true
});



//Mongoose Middleware



// Populate the query with query M/W

tourSchema.pre(/^find/, function (next) {

    // this referencing to the current query
    this.populate(
        {
            path: 'guides',
            select: '-__v -active -passwordChangeAt -passwordResetToken -passwordResetExpires -role'
        }
    );
    next();

});
 

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;



// Is the Earth 2D or 3D?
// Maps are 2-dimensional (2D) representations of a 3-dimensional (3D) Earth. In a small area, Earth is essentially flat, so a flat map is accurate. But to represent a larger portion of Earth, map makers must use some type of projection to collapse the third dimension onto a flat surface.