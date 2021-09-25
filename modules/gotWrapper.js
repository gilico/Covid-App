const got = require("got");
const chulk = require("chalk");

async function makeRequest(url){
    try {
        //call got() to issue a GET request
        const response = await got(url); 
		const data = JSON.parse(response.body);
        return data;
    } catch (err) {
        console.log(chulk.bgBlue("Error occured: HTTP request has failed.\n" + 
                                 "URL: " + url + "\n" + 
                                 "Full Error message: \n"), err);

        process.exit(-1); //program exit with failure - Kills the server
    }
}

module.exports = {
    makeRequest: makeRequest
}