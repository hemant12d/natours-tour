class tourMiddleware{
   static topFiveTour(req, res, next){
      req.query.sort = '-price, -duration';
      req.query.fields = 'name,price,duration,maxGroupSize,ratingsAverage,ratingsQuantity';
      req.query.limit = '5'
      return next();
    }
    static topFiveCheap(req, res, next){
      req.query.sort = 'price, duration';
      req.query.fields = 'name,price,duration,maxGroupSize,ratingsAverage,ratingsQuantity';
      req.query.limit = '5'
      return next();
    }
}

module.exports = tourMiddleware;