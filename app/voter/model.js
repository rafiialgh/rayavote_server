const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = Mongoose.Schema

const voterSchema = new Mongoose.Schema({
    // nim: {
    //   type: String,
    //   required: true,
    //   min: 3,
    //   max: 20,
    //   unique: true,
    // },
    // name: {
    //   type: String,
    //   min: 3,
    //   max: 20,
    //   required: true
    // },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      max: 50,
    },
    // password: {
    //   type: String,
    //   required: true,
    // },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    hasVoted: {
      type: Boolean,
      default: false
    },
    electionAddress: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true,
      default: 'empty'
    }
    // avatar: {
    //   type: String,
    //   default:
    //     'https://firebasestorage.googleapis.com/v0/b/luxuryhub-3b0f6.appspot.com/o/Site%20Images%2Fprofile.png?alt=media&token=6f94d26d-315c-478b-9892-67fda99d2cd6',
    // },
    // isAdmin: { 
  },
  { timestamps: true }
);

// voterSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

voterSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Duplicate field value entered.'));
  } else {
    next(error);
  }
});

// voterSchema.index({ nim: 1 }, { unique: true });
// voterSchema.index({ email: 1 }, { unique: true });

module.exports = Mongoose.model('Voter', voterSchema);
