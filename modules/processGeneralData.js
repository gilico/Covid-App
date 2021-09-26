const router = require('../routes/worldWide-routes');
const gotWrapper = require('./gotWrapper');
const chalk = require('chalk');

// URLs of APIs:
const mainPath = "https://datadashboardapi.health.gov.il/api/queries/";
const infectedUrl = mainPath + "infectedPerDate";
const vaccinedUrl = mainPath + "vaccinated";


async function processGeneral(userDate){
    try 
    {
        let sickAllData = await gotWrapper.makeRequest(infectedUrl);
        let vaccineAllData = await gotWrapper.makeRequest(vaccinedUrl);

        // wiil contain an array
        const sickData = getDataByDate(sickAllData, userDate);

        const vaccineData = getDataByDate(vaccineAllData, userDate);

        if (sickData === null || vaccineData === null) {
            return null
        }

        let chosenDateSick = sickData[0];
        // the day before the chosen date
        let beforChosenUpd = sickAllData[sickData[1]-1];   
        
        return generalDataJson(chosenDateSick, beforChosenUpd, vaccineData);
    } 
    catch (error) 
    {
        console.log(chalk.bgRed("Error occured: HTTP request to Israel covid API has failed"+ 
                                 "URL: " + url + "\n" + 
                                 "Full Error message: \n"), error);
    }
   
}


function getDataByDate(allData, date){

    let isSickArray = false;

    if (allData[0].date) 
    {
        isSickArray = true;
    }
    
    if (isSickArray) 
    {
        for (let i = 0; i < allData.length; i++) {

            let currDate = new Date(allData[i].date).toLocaleDateString();

            if (currDate === date) 
            {
                return [allData[i], i];
            }
        }
        return null;
    }
    else
    {
        for (let i = 0; i < allData.length; i++) {

            let currDate = new Date(allData[i].Day_Date).toLocaleDateString();

            if (currDate === date) 
            {
                return allData[i];
            }
        }
        return null;
    }
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
    processGeneral: processGeneral
}