
const mongoose = require('mongoose');
const dataSchema = mongoose.Schema({

  sensor_name: {type: String, required: true},
  sensor_type: {type: String, required: true},
  sensor_found: {type: Boolean, required: true},
  time: {
    type: Date,
    set: d => new Date(d * 1000),
    required: true
  },
  rh: {type: Number},
  temp: {type: Number}

})


const Data = mongoose.model('data', dataSchema);

module.exports = {
  Data
}
