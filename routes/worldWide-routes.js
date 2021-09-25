const express = require('express');
const processWorldWideData = require('../modules/processWorldWideData');

const router = express.Router();


// worldwide page
router.get('/', (req, res) => {
    const output = {};
    res.render('worldWide-data', {title: 'מידע עולמי', output});
});

// worldwide get data from form
router.post('/', async(req, res) => {
    try {
        const userCountry = req.body.country;
        const output = await processWorldWideData.callCoronaWWApi(userCountry);

        res.render('worldWide-data', {title: 'מידע עולמי', output});
    } 
    catch (error) {
        console.log(error);
    }
})


module.exports = router;