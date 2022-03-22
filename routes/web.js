const router = require('express').Router();

router.get('/home', async (req, res)=> {
    console.log(req.query);
    return res.send("Hello From the Server")
}
);

module.exports = router;