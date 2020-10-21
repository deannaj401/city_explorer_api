'use strict';

//Bring in dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// //Declare port
const PORT = process.env.PORT || 3000;

// //start Express
const app = express();

// //Use CORS
app.use(cors());
//express is able to read postman
// app.use(express.urlencoded());
// //start the server
app.get('/', (request, response) => {

  response.send('hi there');
});

let long = '';
let lat = '';

function Location(location, city) {
  this.latitude = location.lat;
  this.longitude = location.lon;
  this.search_query = city;
  this.formatted_query = location.display_name;
  long = this.longitude;
  lat = this.latitude;
}

function Weather(obj, date) {
  this.forecast = obj.weather.description;
  this.time = date;

}


function Trails(obj) {
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.star_votes;
  this.summary = obj.summary;
  this.trail_url = obj.trail_url;
  this.conditions = obj.conditions;
  this.condition_date = obj.condition_date;
  this.condition_time = obj.condition_time;

}





//get the city information
app.get('/location', (request, response) => {
  let city = request.query.city;
  console.log(city);
  let key = process.env.LOCATIONAPIKEY;
  const URL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  console.log(URL);

  superagent.get(URL)
    .then(data => {
      console.log(data.body[0]);
      let location = new Location(data.body[0], city);


      //determining that all is working
      response.status(200).json(location);
    })
    .catch(error => {
      console.log('ERROR', error);
      response.status(500).send('So Sorry, something went terribly wrong!');
    });

});

//get the weather information
app.get('/weather', (request, response) => {
  let city = request.query.search_query;
  let key = process.env.WEATHERAPIKEY;
  const URL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  console.log('url', URL);
  superagent.get(URL)
    .then(data => {
      // console.log(data.body.data);
      let weatherArray = data.body.data.map(day => {
        // console.log('DATA', data.body);
        let newDay = new Date(day.ts * 1000).toDateString();
        let weather = new Weather(day, newDay);
        // console.log(weather);
        return weather;
      });

      response.status(200).json(weatherArray);
      response.send(weatherArray);

    })
    .catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('Something went so horribly wrong');
    });

});

app.get('/trails', (request, response) => {
  let location = request.query.search_query;
  let key = process.env.TRAILAPIKEY;
  const URL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=${key}`;
  console.log('url', URL);

  superagent.get(URL)
    .then(data => {
      // console.log(data.body.trails);
      let trailArray = data.body.trails.map(item => {
        let trail = new Trails(item);
        console.log(trail);
        return trail;

      });

      response.status(200).json(trailArray);
      response.send(trailArray);
    })
    .catch(error => {
      console.log('ERROR', error);
      response.status(500).send('Something went so Tragically wrong');
    });


});

app.use('*', notFoundHandler);

function notFoundHandler(request, response) {
  response.status(404).send('Page Not Found');

}

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);


});


