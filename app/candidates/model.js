const mongoose = require('mongoose')
const Schema = mongoose.Schema

const candidateSchema = new mongoose.Schema(
  {
    // username: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    // firstName: {
    //   type: String,
    //   required: true,
    // },
    // lastName: {
    //   type: String,
    // },
    // dateOfBirth: {
    //   type: Date,
    //   required: true,
    // },
    // degree: {
    //   type: String,
    //   required: true,
    // },
    // description: {
    //   type: String,
    //   required: true,
    // },
    // companyId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Company',
    //   required: true
    // }
    avatar: {
      type: String,
      default:
        'https://firebasestorage.googleapis.com/v0/b/luxuryhub-3b0f6.appspot.com/o/Site%20Images%2Fprofile.png?alt=media&token=6f94d26d-315c-478b-9892-67fda99d2cd6',
    },
  },
  { timestamps: true }
);

// candidateSchema.path('username').validate(
//   async function (value) {
//     try {
//       const count = await this.model('Candidate').countDocuments({
//         username: value,
//       });
//       return !count;
//     } catch (err) {
//       throw err;
//     }
//   },
//   (attr) => `${attr.value} sudah terdaftar`
// );

module.exports = mongoose.model('Candidate', candidateSchema)
