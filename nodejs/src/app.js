
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
// const util = require('util');
const fs = require('fs');
// const exec = util.promisify(require('child_process').exec);
const shell = require('shelljs');
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
  console.log(`${req.method}: ${req.originalUrl}`);
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
  res.status(200).json({"hello": "world"});
})

app.get('/api/nas/status', async (req, res) => {
  // const { stdout: nodeVersion } = await exec('node --version');
  // console.log("node version:", nodeVersion);
  // res.status(200).json({"hello": "world"});
  if (fs.existsSync('/home/gordon/data/scripts')) {
    res.writeHead(200, { 'Content-Type':'text/html'});
    res.end("<div><p>NAS is online :)<p></div>");
  } else {
    res.writeHead(200, { 'Content-Type':'text/html'});
    res.end("<div><p>NAS is offline :(<p></div>");
  }

})

app.get('/api/nas/wake', async (req, res) => {

  res.writeHead(200, { 'Content-Type':'text/html'});
  if (!fs.existsSync(process.env.NAS_PATH)) {
    shell.exec('/home/gordon/iot/nodejs/src/bash-script/nasWake.sh');
    res.write("NAS is offline :(<br>");
    res.write("Wake command sent (refresh page to update status)");
  } else {
    res.write("NAS is connected :)")
  }
  res.end();

  // res.writeHead(200, { 'Content-Type':'text/html'});
  // res.write("Checking connection<br>");

  // if (!fs.existsSync('/home/gordon/data/scripts')) {
  //   res.write("Connection not found, sending wake command<br>");
  //

  //   res.write("Command sent, waiting for connection (can take up to 30s)<br>");
  //   while (!fs.existsSync('/home/gordon/data/scripts')) {
  //     await sleep(5000);
  //     res.write("Still waiting<br>");
  //   }
  // }

  // res.end("Connection found, NAS in online :)");

  // if (fs.existsSync('./src/schema')) {
  //   res.writeHead(200, { 'Content-Type':'text/html'});
  //   res.write("<div><p>Waiting to connect :)<p></div>");
  //   await sleep(5000);
  //   res.end("<div><p>NAS is online :)<p></div>");
  // } else {
  //   res.writeHead(200, { 'Content-Type':'text/html'});
  //   res.end("<div><p>NAS is offline :(<p></div>");
  // }

})

/*****************************************************************
 * import a route from a gpx file
 ******************************************************************/
app.post('/api/new-data/', async (req, res) => {

//  const data = req.body.data;
  console.log(req.body);
  let dataArr = req.body.data;
  try {
    await Data.create(dataArr);
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  };

});


/*****************************************************************
 * import a route from a gpx file
 ******************************************************************/
app.get('/api/get-latest/:sensorName/:startDate/:endDate', async (req, res) => {
  // console.log(req.params.nReadings);
  let startDate = req.params.startDate + "T00:00:00Z";
  let endDate   = req.params.endDate + "T00:00:00Z";

// console.log(startDate);
// console.log(endDate);

  let doc = await Data.find(
    // {sensor_name: req.params.sensorName, deployed: true, time: {$gt: startDate, $lt: endDate}})
    {sensor_name: req.params.sensorName, time: {$gt: startDate, $lt: endDate}})
    .sort({time: -1})
    .limit(req.params.nReadings);
// console.log(doc);
  // TODO: --> call a function here that will return a time history based on one sensor with accuracy to mins only,
  // and then sensor values for each sensor - so that pressure is correlated to rh and temp for MR calculation
  res.status(201).json( doc );

});

app.get('/api/clean', async (req, res) => {

  // const query = {sensor_name: "shtOutside", "rh_pre": { $exists: false}};
  const query = {sensor_name: {$ne: "shtOutside"}, deployed: false};
  // const query = {deployed: false};
  /*
  *  USE THIS LOOP FIRST TO CHECK WHAT YOU ARE SELECTING
  */
  // let docs = await Data.find(query);
  // console.log(docs.length);

  let docs = await Data.deleteMany(query);

  res.status(201).json( docs );
});



module.exports = app;

