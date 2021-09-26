const express = require('express');
const worldDataRoutes = require('./routes/worldWide-routes');
const israelDataRoutes = require('./routes/israel-data-routes');
const generalIsraelRoutes = require('./routes/genral-israel-routes');

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

// express routes - israel general data 
app.use('/general-israel', generalIsraelRoutes);



// 404 page - must be last of the pages
 app.use((req, res) => {
     res.status(404).render('404', {title: '404'});
 })
