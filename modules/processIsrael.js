const gotWrapper = require('./gotWrapper'); // using got npm through this module 
const chalk = require("chalk"); // Coloring outputs

// URLs of APIs:
const mainPath = "https://datadashboardapi.health.gov.il/api/queries/";
const perCityUrl = mainPath + "contagionDataPerCityPublic";
const infectedUrl = mainPath + "infectedPerDate";
const vaccinedUrl = mainPath + "vaccinated";


async function processCity(cityName){
    try 
    {
        let allCities = await gotWrapper.makeRequest(perCityUrl);

        for (let index = 0; index < allCities.length; index++) 
        {
            if (allCities[index].city.includes(cityName)) 
            {
                return cityDataStr(allCities[index]);
            }
        }
        return null;
    } 
    catch (error) 
    {
        console.log(chalk.bgRed("Error occured: HTTP request to Israel covid API has failed"+ 
                                "URL: " + perCityUrl + "\n" + 
                                "Full Error message: \n"), error);
    }
}

function cityDataStr(cityObj){
    let cityName = reverse(cityObj.city)

    const ret = 
    {
        City: cityName.split("").reverse().join(""), 
        Confirmed: numberWithCommas(cityObj.sickCount),
        Active: numberWithCommas(cityObj.actualSick),
        Verifies_7_days_ago: numberWithCommas(cityObj.verifiedLast7Days)
    };

    return ret;
}

function reverse(city){
    return city.split("").reverse().join("");
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    processCity: processCity
}