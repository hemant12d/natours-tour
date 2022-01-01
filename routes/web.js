const router = require('express').Router();
router.get('/home', async (req, res)=>{

    // Insert a tour
    // newTour = new Tour({
    //     name: "New Inserted Tour",
    //     price: 944,
    //     rating: 4.6
    // });

    
    // try{   
    //     const addedTour = await newTour.save();
    //     console.log(addedTour);
    //     res.send("Hello from seperate router");
    // }
    // catch(err){
    // console.log('ERROR 🤐 ' + err);
    // }

    res.send("Hello From the Server");

});

module.exports = router;