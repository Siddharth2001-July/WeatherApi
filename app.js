const express = require('express');
const { write } = require('fs');
const https = require('https');

const app = express()
app.use(express.urlencoded({ extended: true }))
const port = 3000

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    var place = req.body.city;
    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + place + "&appid=ccf56e3d4f616ab7697440221b43b0e9&units=metric";
    https.get(weatherUrl, (urlResponse) => {
        // To check if API responded
        try {
            if (urlResponse.statusCode === 200) {
                console.log("API responded successfully");
                // Data Response
                urlResponse.on("data", (hexData) => {
                    var parseData = JSON.parse(hexData);
                    // Getting the needed data from whole data-set
                    var temp = parseData.main.temp;
                    var weatherDes = parseData.weather[0].description;
                    res.write("<h1>Temprature in "+place+" is " + temp + " degree celcius.</h1>");
                    res.write("<p>Currently it is " + weatherDes + " there!");
                    var icon = "https://openweathermap.org/img/wn/" + parseData.weather[0].icon + "@2x.png";
                    res.write("<img style='background-color: aliceblue; border-radius: 25%;' src='" + icon + "'>");
                    res.send();
                })
            }
            else if (urlResponse !== 200) {
                console.log('API Error ');
                res.write("Error 404: Entered place doesnt exist.\nTip : Please enter complete and correctly spelled city name!");
                res.send();
            }   
        } catch (error) {
            console.log('API not connected\nError Code : '+error);   
        }
    })
});

// var place = "Dehradun";
app.listen(port, () => console.log(`Server is running on port ` + port))