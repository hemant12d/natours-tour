const AppError = require("./AppError");
const unHandleRoute = (req, res, next) => {
    next(new AppError(`Can't find the route ${req.originalUrl}`, 404));
}

module.exports = unHandleRoute;