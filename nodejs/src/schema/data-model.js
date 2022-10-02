const mongoose = require('mongoose');
const dataSchema = mongoose.Schema({

  sensor_name: {type: String, required: true},
  sensor_type: {type: String, required: true},
  time: {type: Date, default: Date.now, required: true},
  deployed: {type: Boolean, required: true},
  rh: {type: Number},
  temp: {type: Number},
  press: {type: Number}

})


const Data = mongoose.model('data', dataSchema);

module.exports = {
  Data
}
