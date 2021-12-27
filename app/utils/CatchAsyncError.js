// Operation Function keeps reference to it's lexical environment & form as closure...
module.exports = operationFunction =>{
    return (req, res, next) => {
        operationFunction(req, res, next).catch(next);
    }
}