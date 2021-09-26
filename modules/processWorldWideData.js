const fs = require('fs'); // using fs for readFilesSync
const gotWrapper = require('./gotWrapper'); // using got npm through this module 
const chalk = require("chalk"); // Coloring outputs
const translate = require('translate-google');


// Containd all the file data - this file got all the countries by their code
const data = JSON.parse(fs.readFileSync("./data/ISO3166-1.json").toString()); 

//translate from hebrew with google translate npm
async function translateCountry(country){
    try {
        return translate(country, { to: 'en'})
    } catch (error) {
        console.error(err)
    }
}

//This method return to the main module the user's search result.
function processLocation(country){
    for (let i = 0; i < data.length; i++) {
        // This loop check if the user's input is part of a country name
        if (data[i].englishShortName.toLowerCase().includes(country)) 
        {
            // calls method with the country code to use country name and it's code.
            return data[i].alpha2Code; 
        }
    }
    return null;
    // if the user input invalid name - nothing returns.
}

// Async function that calls 'gotWrapper' with the country code' only after the user confitmed it.
async function callCoronaWWApi(country){
    const trans = await translateCountry(country)
    const setFinal = setCommonCountryNames(trans)
    
    const stateCode = await processLocation(setFinal.toLowerCase());

    if (stateCode === null) {
        return null
    }

    // Combining the two parts of the api url.
    const ApiPath = "https://corona-api.com/countries/"; 
    let url = ApiPath + stateCode;

    try {
        // Try to make request to the api using 'got' and contain the country's covid data in variable
        let covidData = await gotWrapper.makeRequest(url);
        // This statement will be true only if there is data about the country
        if (covidData.data  != "") {
            // Send the country's covid data to string method
            return covidDataJson(covidData.data);
        }
    } catch (error) {
        console.log(chalk.bgRed("Error occured: HTTP request to WorldWide Api has failed"+ 
                                 "URL: " + url + "\n" + 
                                 "Full Error message: \n"), error);
    }
}

// Method that converts the country's properties to string
function covidDataJson(data){
    // Insert this to 'try-catch' to catch the errer if there is any property missing
    // To see this work type: at worldwide 'saba'
    
    let ret = 
    {
        name: data.name,
        population: numberWithCommas(data.population),
        update_at: new Date(data.updated_at).toLocaleDateString(),
        total_confirmed: numberWithCommas(data.timeline[0].confirmed),
        new_confirmed: numberWithCommas(data.timeline[0].new_confirmed),
        active: numberWithCommas(data.timeline[0].active),
        deaths: numberWithCommas(data.timeline[0].deaths),
        new_deaths: numberWithCommas(data.timeline[0].new_deaths)
    }
    // console.log(ret)
    return ret;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function setCommonCountryNames(country){

    switch (country) {
        case "England":
        case "UK":
            return "United Kingdom of Great Britain"
        
        case "United States":
            return "United States Of America"

        default:
            return country;
    }

}


// // Export these tow function - for country code and to process the data
module.exports = {
    callCoronaWWApi: callCoronaWWApi,
}