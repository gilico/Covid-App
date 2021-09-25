const gotWrapper = require('./gotWrapper'); // using got npm through this module 
const chalk = require("chalk"); // Coloring outputs
const fs = require('fs');

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
        return "לא נמצא ישוב בשם זה";
    } 
    catch (error) 
    {
        console.log(chalk.bgRed("Error occured: HTTP request to Israel covid API has failed"+ 
                                "URL: " + perCityUrl + "\n" + 
                                "Full Error message: \n"), error);
    }
}

async function processGeneral(){
    try 
    {
        let generalData = await gotWrapper.makeRequest(infectedUrl);
        let vaccineData = await gotWrapper.makeRequest(vaccinedUrl);

        let lasUpdate = generalData[generalData.length - 1];
        let beforLastUpd = generalData[generalData.length - 2]    
        let lasUpdateVaccine = vaccineData[vaccineData.length - 1];
        
        return generalDataJson(lasUpdate, beforLastUpd, lasUpdateVaccine);
    } 
    catch (error) 
    {
        console.log(chalk.bgRed("Error occured: HTTP request to Israel covid API has failed"+ 
                                 "URL: " + url + "\n" + 
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


function generalDataJson(covid,covidYestd, vacc){
    let ret = 
    {
        Last_Update: new Date(covid.date).toLocaleDateString(),
        Sum_of_Sick: numberWithCommas(covid.sum),
        New_Confirmed_today: numberWithCommas(covid.amount),
        New_Confirmed_yesterday: numberWithCommas(covidYestd.amount),
        Sum_Of_First_Dose: numberWithCommas(vacc.vaccinated_cum),
        Sum_Of_Second_Dose: numberWithCommas(vacc.vaccinated_seconde_dose_cum),
        Sum_Of_Third_Dose: numberWithCommas(vacc.vaccinated_third_dose_cum),
        Vaccined_Percentage_Of_Population: vacc.vaccinated_population_perc + "%"
    }

   return ret;
}

function reverse(city){
    return city.split("").reverse().join("");
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    processCity: processCity,
    processGeneral: processGeneral
}