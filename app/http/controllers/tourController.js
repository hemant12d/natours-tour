const Tour = require('../model/Tour');
const AppError = require('../../utils/AppError');
const catchAsyncError = require('../../utils/CatchAsyncError');
const factory = require('./factoryFunctionController');


const TourController = () => {
    return {

        getAllTour: factory.getAll(Tour),

        createTour: factory.createOne(Tour),

        // factory get one function is compatiable with populate method
        getTour: factory.getOne(Tour, { path: 'reviews' }),

        updateTour: factory.updateOne(Tour),

        deleteTour: factory.deleteOne(Tour),

        tourOverview: catchAsyncError(async (req, res) => {

            // aggregation pipeline
            const aggregatePipeLine = [
                {
                    $match: { price: { $gte: 300 } }
                },
                {
                    $group: {
                        _id: '$difficulty',
                        tour_Num: { $sum: 1 },
                        priceAvg: { $avg: '$price' },
                        priceSum: { $sum: '$price' },
                        priceMax: { $max: '$price' },
                        priceMin: { $min: '$price' },
                        durationAvg: { $avg: '$duration' },
                        ratingsAvg: { $avg: '$ratingsAverage' },
                    }
                },
                {
                    // Accending order
                    $sort: { ratingsAvg: 1 }
                }
            ]; // aggregation pipeline also known as stages of array

            const aggregateOverview = await Tour.aggregate(aggregatePipeLine);

            return res.status(200).json({
                status: 'success',
                data: {
                    tourOverview: aggregateOverview
                }
            });

        }),

        busyMonth: catchAsyncError(async (req, res) => {

            const clientYear = req.params.year;
            const pipeLine = [
                {
                    $unwind: '$startDates'
                },
                {
                    $match: {
                        startDates: { $gte: new Date(`${clientYear}-01-01`), $lte: new Date(`${clientYear}-12-31`) }
                    }
                },
                {
                    $group: {
                        _id: { $month: '$startDates' },
                        totalTour: { $sum: 1 },
                        tourName: { $push: '$name' }
                    }
                },
                {
                    $addFields: {
                        month: '$_id',
                    }
                },
                {
                    // Decending order
                    $sort: { totalTour: -1 }
                },
                {
                    $limit: 6,
                }
            ]

            const allTours = await Tour.aggregate(pipeLine);

            return res.status(200).json({
                status: 'success',
                totalResults: allTours.length,
                data: {
                    tours: allTours,
                }
            });
        })

    }
}

module.exports = TourController;
