const express = require('express');
const processIsreal = require("../modules/processIsrael");

const router = express.Router();

// israel city page
router.get('/', (req, res) => {
    const cityData = {};
    res.render('israel-data', {title: 'מידע ישראל', cityData});
});

// send data from form
router.post('/', async(req, res) => {
    try {
        const userCity = req.body.city;
        const cityData = await processIsreal.processCity(userCity);
        
        res.render('israel-data', {title: 'מידע ערים', cityData});

    } catch (error) {
        console.log("post city data error: " + error)
    }  
});

module.exports = router;