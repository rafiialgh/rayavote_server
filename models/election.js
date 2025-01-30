const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  candidates: {
    type: Array,
    required: true,
  },
  currentPhase: {
    type: String,
    default: 'init', //init, registration, voting, result
  },
});

module.exports = mongoose.model('Election', electionSchema);
