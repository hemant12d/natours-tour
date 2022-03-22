class ApiFeatures {
    constructor(chainQuery, clientOptions) {
        this.chainQuery = chainQuery;
        this.clientOptions = clientOptions;
    }

    //  filter the client options
    filter() {

        // Destructure the reference object
        let queryObj = { ...this.clientOptions };

        // Popup the options sort, fields, limit, & page
        const popUp = ['sort', 'fields', 'limit', 'page'];
        
        popUp.forEach(el => delete queryObj[el]);

        // We want input like this 
        // { price: { '$lte': '400' }, ratingsAverage: { '$gte': '4.5' } }
        // from this
        // { price: { lte: '400' }, ratingsAverage: { gte: '4.5' } }

         
        // Advance filtering, Ek Zalak 😎😎
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        // If the object is empty, then this is going to fetch all the results
        // Await position has changed due to method chaining functionality for advance fileting basics

        this.chainQuery = this.chainQuery.find(JSON.parse(queryStr));

        return this;
    }

    // sort the result
    sort() {
        if (this.clientOptions.sort) {

            // Make the parameter valid for query
            let sortByFields = this.clientOptions.sort.split(',').join(' ');

            // If there is no match for sortByFields or sortByFields is empty, then default accending order will be apply
            this.chainQuery = this.chainQuery.sort(sortByFields);
        } else {
            // Default Sort (Newest Fast)
            this.chainQuery = this.chainQuery.sort('-createdAt');
        }

        return this;
    }

    // Execute specific fields
    fields() {
        if (this.clientOptions.fields) {

            // Parameter validation for sort
            let sortFileds = this.clientOptions.fields.split(',').join(' ');
            this.chainQuery = this.chainQuery.select(sortFileds);
        }
        else {

            // Default 
            this.chainQuery = this.chainQuery.select('-__v');
        }
        return this;
    }

    // pagination & limit
    paginate() {
        const page = this.clientOptions.page * 1 || 1;
        const limit = this.clientOptions.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.chainQuery = this.chainQuery.skip(skip).limit(limit);
        return this;

        // if(skip >= await Tour.countDocuments()){
        //     throw Error("Page not exists, documents are finished");
        // }
    }
}

module.exports = ApiFeatures;
