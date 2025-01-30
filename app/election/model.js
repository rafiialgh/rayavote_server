const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const electionSchema = new Mongoose.Schema({
  electionName: {
    type: String,
    require: [true, 'Election name harus diisi']
  },
  electionDesc: {
    type: String,
    require: [true, 'Description harus diisi']
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  currentPhase: {
    type: String,
    default: "init", //init, registration, voting, result
    enum: ['init', 'ongoing', 'completed']
  }
}, 
{ timestamps: true }
)

module.exports = Mongoose.model('Election', electionSchema)