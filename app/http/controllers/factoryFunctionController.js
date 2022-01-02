// 1) Undstnd  prblm

// 2) Cncrt exmpl

// 3) Brk dn

// 4) Slv & smlfy

// 5) Luk & reftor

const catchAsyncError = require('../../utils/CatchAsyncError');
const AppError = require('../../utils/AppError');
const ApiFeatures = require('../../utils/ApiFeatures');


const factoryFunctions = {
    createOne: Model => {

        return catchAsyncError(async (req, res, next) => {

            // Create Review
            const doc = await Model.create(req.body);

            return res.status(201).json({
                status: 'success',
                data: {
                    doc: doc
                }
            });

        })

    },

    deleteOne: Model => {

        return catchAsyncError(async (req, res, next) => {

            const doc = await Model.findByIdAndDelete(req.params.id);

            if (!doc) return next(new AppError("Document not found", 404));

            return res.status(204).json({
                status: 'sucess',
                data: null
            });

        });

    },

    updateOne: Model => {

        return catchAsyncError(async (req, res, next) => {

            const doc = await Model.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!doc)
                return next(new AppError("Document not find for update", 404));


            return res.status(201).json({
                status: "success",
                data: {
                    doc: doc
                }
            });

        })
    },

    getOne: (Model, populateOptions) => {

        return catchAsyncError(async (req, res, next) => {

            let query = Model.findById(req.params.id);

            if (populateOptions) query = query.populate(populateOptions);

            const doc = await query;

            if (!doc) return next(new AppError('Document not exists', 404));

            return res.status(200).json({
                status: "success",
                data: {
                    doc: doc
                }
            });
        })
    },

    getAll: Model => {
        return catchAsyncError(async (req, res, next) => {

            let filter = {};

            // When request wants particular views for a tour (Nested get point of reviews for tour)
            if (req.params.tourId) filter = { tour: req.params.tourId };

            let apiFeatures = new ApiFeatures(Model.find(filter), req.query)
                .filter()
                .sort()
                .fields()
                .paginate();

            const docs = await apiFeatures.chainQuery; // => [ ]

            return res.status(200).json({
                status: "success",
                totalResults: docs.length,
                data: {
                    docs: docs
                }
            });

        })
    }
}

module.exports = factoryFunctions;


