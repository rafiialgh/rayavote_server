const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const electionSchema = new Mongoose.Schema({
  // electionName: {
  //   type: String,
  //   require: [true, 'Election name harus diisi']
  // },
  // electionDesc: {
  //   type: String,
  //   require: [true, 'Description harus diisi']
  // },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  currentPhase: {
    type: String,
    default: "init", //init, registration, voting, result
    enum: ['init', 'ongoing', 'completed']
  },
  electionAddress: {
    type: String,
    required: true
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },    
}, 
{ timestamps: true }
)

module.exports = Mongoose.model('Election', electionSchema)