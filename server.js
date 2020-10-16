'use strict';

//Bring in dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// //Declare port
const PORT = process.env.PORT || 3000;

// //start Express
const app = express();

// //Use CORS
app.use(cors());
// //start the server
app.get('/', (request, response) => {

  response.send(location);
});



function Location(obj, query) {
  this.latitude = obj[0].lat;
  this.longitude = obj[0].lon;
  this.search_query = query;
  this.formatted_query = obj[0].display_name;
}

function Weather(forecast, date) {
  this.forecast = forecast;
  this.date = date;


}

app.get('/location', getLocation);
app.get('/weather', getWeather);

//get the information
function getLocation(request, response) {
  try {
    let data = require('./data/location.json');
    let city = request.query.city;
    console.log(city);
    let location = new Location(data, city);
    console.log(location);
    //determining that all is working
    response.status(200).json(location);
  }
  catch (error) {
    console.log('ERROR', error );
    response.status(500).json("So Sorry, something went terribly wrong!");


  }
}

function getWeather(request, response) {
  let weatherArray = [];
  let data = require('./data/weather.json');
  data.data.forEach(element => {
    let forecast = element.weather.description;
    let date = element.valid_date;
    let weather = new Weather(forecast, date);
    weatherArray.push(weather);
  });

  console.log(data.data[0]);
  //determining that all is working
  response.status(200).json(weatherArray);

}

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
