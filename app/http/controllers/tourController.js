const Tour = require('../model/Tour');
const AppError = require('../../utils/AppError');
const catchAsyncError = require('../../utils/CatchAsyncError');
const factory = require('./factoryFunctionController');
const httpStatusCodes = require('../../responses/httpStatusCodes');
const apiResult = require('../../responses/apiResult');


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
                    $match: { 
                        price: { $gte: 300 } 
                    }
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
                    $sort: { 
                        ratingsAvg: 1
                    }
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
                        startDates: {
                            $gte: new Date(`${clientYear}-01-01`),
                            $lte: new Date(`${clientYear}-12-31`)
                        }
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
                    $sort: {
                         totalTour: -1 
                    }
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
        }),


        // /tours-within/:distance/center/:latlng/unit/:unit
        // /tours-within/233/center/34.111745,-118.113491/unit/mi
        toursWithIn: catchAsyncError(async (req, res, next) => {
            const { distance, latlng, unit } = req.params;
            const [lat, lng] = latlng.split(',');


            // radius measured in radians, query operators accept distance in radians
            const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
          
            if (!lat || !lng) {
              return next(
                new AppError(
                  'Please provide latitutr and longitude in the format lat,lng.',
                  400
                )
              );
            }
          
          
            // For spherical query operators to function properly, you must convert distances to radians
            // If you use longitude and latitude, specify coordinates in order of longitude, latitude in query
            const tours = await Tour.find({
                startLocation: {
                  $geoWithin: { $centerSphere: [[lng, lat], radius] }
                }
            });
          
            return res.status(httpStatusCodes.ACCEPTED).json({
              status: apiResult.SUCCESS,
              results: tours.length,
              data: {
                data: tours
              }
            });
          
        }),

        tourNearMe: catchAsyncError(async (req, res, next) =>{

            const {latlng, unit}  = req.params;
            const [lat, lng] = latlng.split(",");
            let multiplier = unit === 'mi' ? 0.000621371 : 0.001;

            if (!lat || !lng) {
                return next(
                  new AppError(
                    'Please provide latitutr and longitude in the format lat,lng.',
                    400
                  )
                );
            }
           

            const distances = await Tour.aggregate([
                {
                    $geoNear:{
                        near:{
                            type: 'Point',
                            coordinates: [lng * 1, lat * 1]
                        },
                        // default distanceField is comes in meter
                        distanceField: 'distance',
                        distanceMultiplier: multiplier
                    }
                },
                {
                    $project: {
                      distance: 1,
                      name: 1
                    }
                }
            ])
            
            return res.status(httpStatusCodes.ACCEPTED).json({
                status: apiResult.SUCCESS,
                data: {
                  data: distances
                }
            });

        })

    }
}

module.exports = TourController;
