const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  availableServices: [String]
});

module.exports = mongoose.model('Employee', employeeSchema);

