const express = require('express');
const bodyParser = require('body-parser');
const worldDataRoutes = require('./routes/worldWide-routes');
const israelDataRoutes = require('./routes/israel-data-routes');
const processIsreal = require("./modules/processIsrael");
const { urlencoded } = require('body-parser');


var urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
app.listen(3000);


// register views engine
app.set('view engine', 'ejs');

// set static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));


// set views
app.get('/', (req, res) => {
    res.render('index', {title: 'דף הבית'});
});

// express routes - israel cities data 
app.use('/israel-data', israelDataRoutes);

// express routes - data by countries 
app.use('/worldWide-data', worldDataRoutes);


// israel general data page
app.get('/general-israel', async(req, res) => {
    try 
    {
        const data = await processIsreal.processGeneral();
        res.render('general-israel', {title: 'מידע כללי', data});    
    } 
    catch (error) 
    {
        console.log(error);
    }
});


// 404 page - must be last of the pages
 app.use((req, res) => {
     res.status(404).render('404', {title: '404'});
 })
