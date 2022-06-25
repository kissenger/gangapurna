
"use strict"

/**
 * Handles the public interface with the front-end.  Only routes are specified in this module
 * (with some others in app-auth.js) with suppporting functions abstracted to 'app-functions.js'
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Data = require('./schema/data-model').Data;
const dotenv = require('dotenv').config();
if (dotenv.error) {
  console.log(`ERROR from app.js: ${dotenv.error}`);
  process.exit(0);
}

const app = express();

// apply middleware - note setheaders must come first
// TODO:  (2) to inject /api on routes
app.use( (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Request-With, Content-Type, Accept, Authorization, Content-Disposition");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");
  next();
});
app.use(bodyParser.json());
app.use((req, res, next) => {
  // debugMsg(`${req.method}: ${req.originalUrl}`);
  console.log()
  next();
})


// mongo as a service
// console.log(process.env.MONGODB_PASSWORD)
mongoose.connect(`mongodb+srv://root:${process.env.MONGODB_PASSWORD}@cluster0-5h6di.gcp.mongodb.net/iot?retryWrites=true&w=majority`,
  {useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connection
  .on('error', console.error.bind(console, 'connection error:'))
  .on('close', () => console.log('MongoDB disconnected'))
  .once('open', () => console.log('MongoDB connected') );

app.get('/api/ping/', async (req, res) => {
  res.status(201).json({"hello": "world"});
})

/*****************************************************************
 * import a route from a gpx file
 ******************************************************************/
app.post('/api/new-data/', async (req, res) => {

//  const data = req.body.data;
  console.log(req.body);
  await Data.create( req.body );
});


/*****************************************************************
 * import a route from a gpx file
 ******************************************************************/
app.get('/api/get-latest/:sensorName', async (req, res) => {

  let doc = await Data.find({sensor_name: req.params.sensorName}).sort({time: -1}).limit(1);
  res.status(201).json( doc[0] );

});


/**
 * rhi
 * Inputs:  t = temp in degrees centigrade
 *          rh = relative humidity as %
 * Outputs: rhi = rh / rh_crit
 */

function rhi(t, rh) {
  return rh / rhCrit(t);
}


/**
 * rhCrit
 * Inputs: t = temp in degrees centigrade
 * Outputs: rh_crit = rh for mould risk at given temperature
 */

function rhCrit(t) {

  const A = 0.0168;
  const B = -1.5741;
  const C = 93.137;

  if (t <= 2) {
    return 100;
  } else if (t >= 24) {
    return 65;
  } else {
    return A * t * t + B * t + C;
  }

}


module.exports = app;

