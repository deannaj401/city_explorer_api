'use strict';

//Bring in dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg =require('pg');


// //Declare port
const PORT = process.env.PORT || 3000;



// //Use CORS
app.use(cors());

//create our postgresql client
const client=newpg.Client(process.env.DATABASE_URL);

// //start Express
const app = express();

//express is able to read postman
app.use(express.urlencoded());
// //start the server
app.get('/', (req, res) => {

  res.send('hi there');
});



function Location(city, location) {
  this.latitude = location.lat;
  this.longitude = location.lon;
  this.search_query = city;
  this.formatted_query = location.display_name;
}

function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = time;


}

app.get('/location', getLocation);
app.get('weather', getWeather);
app.use('*', notFoundHandler);

//get the information
function getLocation(req, res) {
  let city = req.query.city;
  // console.log(city);
  let key = process.env.LOCATIONAPIKEY;
  const URL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  console.log(URL);

  superagent.get(URL)
    .then(data => {
      let location = new Location(city, data.body[0]);


      //determining that all is working
      res.status(200).json(location);
    })
    .catch(error => {
      console.log('ERROR', error);
      res.status(500).send('So Sorry, something went terribly wrong!');
    });

}


function getWeather(req, res) {
  let weatherArray = data.data.map(element => {
    let forecast = element.weather.description;
    let time = element.datetime;

    let key = process.env.WEATHERAPIKEY;
    const URL = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${key}`;
    // console.log(URL);

    res.status(200).json(location);

  });
}


superagent.get(URL)
  .then(data => {
    let weather = new Weather(forecast, time);
    //determining that all is working
    res.status(200).json(weatherArray);

  });

function notFoundHandler(req, res) {
  res.status(404).send('Page Not Found');

}

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);


});
