
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
  let dataArr = req.body.data;
  for (let i = 0; i < dataArr.length; i++) {
    await Data.create( dataArr[i] );
  }

});


/*****************************************************************
 * import a route from a gpx file
 ******************************************************************/
app.get('/api/get-latest/:sensorName/:nReadings', async (req, res) => {
  // console.log(req.params.nReadings);
  let doc = await Data.find({sensor_name: req.params.sensorName, sensor_found: true, deployed: true}).sort({time: -1}).limit(req.params.nReadings);
  res.status(201).json( doc );

});


module.exports = app;

