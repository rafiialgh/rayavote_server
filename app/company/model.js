const Mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const companySchema = new Mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email harus diisi'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Masukkan email yang valid'],
    },
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
    },
  },
  { timestamps: true }
);

companySchema.path('email').validate(
  async function (value) {
    try {
      const count = await this.model('Company').countDocuments({
        email: value,
      });
      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

companySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = Mongoose.model('Company', companySchema);
