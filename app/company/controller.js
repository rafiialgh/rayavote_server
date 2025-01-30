const Company = require('./model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = {
  signup: async (req, res, next) => {
    try {
      const payload = req.body;

      const existingEmail = await Company.findOne({ email: payload.email });
      // if (existingEmail) {
      //   return res.status(409).json({
      //     status: 'Error',
      //     message: 'Email already registered',
      //     email: payload.email,
      //   });
      // }

      let company = new Company(payload);
      await company.save();
      delete company._doc.password;
      res.status(201).json({ data: company });
    } catch (error) {
      if (error && error.name === 'ValidationError') {
        return res.status(422).json({
          error: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
  signin: async (req, res, next) => {
    const { email, password } = req.body;

    Company.findOne({ email: email })
      .then((company) => {
        if (company) {
          const checkPassword = bcrypt.compareSync(password, company.password);
          if (checkPassword) {
            const token = jwt.sign(
              {
                company: {
                  id: company.id,
                  email: company.email,
                },
              },
              config.jwtKey
            );

            res.status(200).json({
              data: { companyId: company.id, companyEmail: company.email, token },
            });
          } else {
            res.status(403).json({
              message: 'Password yang anda masukan salah',
            });
          }
        } else {
          res.status(403).json({
            message: 'Email yang anda masukan salah',
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message || 'Internal server error',
        });
        next(err);
      });
  },
};
