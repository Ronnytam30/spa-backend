const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  date: String,
  time: String,
  services: [
    {
      name: String,
      duration: String,
      price: Number,
      staff: String
    }
  ]
});

module.exports = mongoose.model('Booking', bookingSchema);
