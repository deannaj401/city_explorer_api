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
app.use(express.urlencoded());
// //start the server
app.get('/', (request, response) => {

  response.send('hi there');
});



function Location(city, location) {
  this.latitude = location.lat;
  this.longitude = location.lon;
  this.search_query = city;
  this.formatted_query = location.display_name;
}

function Weather(obj, date) {
  this.forecast = obj.weather.description;
  this.time = date;

}




app.use('*', notFoundHandler);



//get the information
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


app.get('/weather', (request, response) => {
  let city = request.query.search_query;
  let key = process.env.WEATHERAPIKEY;
  const URL = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${key}`;

  superagent.get(URL)
    .then(data => {
      let weatherArray = data.body.data.map(day => {
        let newDay = new Date(day.ts * 1000).toDateString();
        let weather = new Weather(day, newDay);
        console.log(weather);
        return weather;
      });

      console.log(URL);

      response.status(200).json(weatherArray);
      response.send(weatherArray);

    })
    .catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('Something went so horribly wrong');
    });


});


function notFoundHandler(request, response) {
  response.status(404).send('Page Not Found');

}

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);


});
