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
  // let city = request.query.city;
  // let data = require('/data/location.json')[0];
  // let location = new Location(data, city);
  response.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
