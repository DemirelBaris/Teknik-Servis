const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  issue: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Varsayılan olarak oluşturulma tarihi
  },
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
