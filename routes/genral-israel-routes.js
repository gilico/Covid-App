const express = require('express');
const processGeneralIsrael = require("../modules/processGeneralData");

const router = express.Router();

// israel general data page
router.get('/', (req, res) => {
    const data = undefined; 
    res.render('general-israel', {title: 'מידע כללי', data});    
     
});

router.post('/', async(req, res) => {
    try {
        let data;
        let userDate = req.body.date;
        
        if (userDate === '') {
            data = null;
        }else{
            userDate = new Date(userDate).toLocaleDateString();
            data = await processGeneralIsrael.processGeneral(userDate);
        }
        res.render('general-israel', {title: 'מידע כללי', data});

    } catch (error) {
        console.log(error);
    }
})

module.exports = router;