const Voter = require('./model');
const path = require('path');
const fs = require('fs');
const { emailGmail, appPassword, jwtKey } = require('../../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

module.exports = {
  // signup: async (req, res, next) => {
  //   try {
  //     console.log('File:', req.file);
  //     console.log('Body:', req.body);
  //     const payload = req.body;
  //     const companyId = req.company?.id;

  //     const existingEmail = await Voter.findOne({ email: payload.email })
  //     if (existingEmail) {
  //       return res.status(409).json({
  //         status: 'Error',
  //         message: 'Email already registered',
  //         email: payload.email
  //       })
  //     }

  //     if (req.file) {
  //       let filename = req.file.filename;

  //       const voter = new Voter({
  //         ...payload,
  //         companyId,
  //         avatar: filename,
  //       });

  //       await voter.save();
  //       delete voter._doc.password;
  //       res.status(201).json({ data: voter });

  //     } else {
  //       let voter = new Voter(payload);
  //       await voter.save();
  //       delete voter._doc.password;
  //       res.status(201).json({ data: voter });
  //     }
  //   } catch (err) {
  //     if (err && err.name === 'ValidationError') {
  //       return res.status(422).json({
  //         error: 1,
  //         message: err.message,
  //         fields: err.errors,
  //       });
  //     }
  //     next(err);
  //   }
  // },
  signup: async (req, res, next) => {
    try {
      const {
        email,
        password,
        electionAddress,
        electionName,
        electionDescription,
      } = req.body;
      console.log(req.body);

      const companyId = req.company?.id;

      if (!companyId) {
        return res.status(400).json({ message: 'Company ID is missing.' });
      }
      console.log(companyId);

      const existingVoter = await Voter.findOne({ email });

      if (existingVoter) {
        return res.status(400).json({
          message: 'Voter with this email already exists.',
        });
      }

      const voter = new Voter({
        email,
        password,
        electionAddress,
        companyId,
      });

      await voter.save();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: emailGmail,
          pass: appPassword,
        },
      });

      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log('Server is ready to take our messages');
            resolve(success);
          }
        });
      });

      const mailOptions = {
        from: {
          name: 'Raya Vote',
          address: emailGmail,
        },
        to: voter.email,
        subject: `Kamu terdaftar di Pemilihan ${electionName}`,
        html: `
          <h1>Kamu terdaftar sebagai pemilih</h1>
          <br>Informasi pemilihan:
          <br><b>${electionName}</b>
          <br>${electionDescription}
          <br>
          <br>Email kamu: ${voter.email}
          <br>Password kamu: ${voter.password}
          <br>Silahkan kunjungi website di bawah untuk memilih:
          <br><a href="http://localhost:3000/">Click here to visit the website</a>
          `,
      };

      await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(info);
            resolve(info);
          }
        });
      });

      delete voter._doc.password;

      return res.status(201).json({
        message: 'Voter added successfully',
        data: voter,
      });
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
    try {
      const { email, password } = req.body;

      const voter = await Voter.findOne({ email: email });
      if (!voter) {
        return res.status(403).json({
          message: 'Email salah.',
        });
      }

      if (voter.password !== password) {
        return res.status(403).json({
          message: 'Password salah.',
        });
      }

      const tokenVoter = jwt.sign(
        {
          voter: {
            id: voter.id,
            email: voter.email,
            electionAddress: voter.electionAddress,
          },
        },
        jwtKey
      );

      // Kirim respon sukses
      res.status(200).json({
        data: {
          voter: {
            _id: voter.id,
            email: voter.email,
            electionAddress: voter.electionAddress,
            hasVoted: voter.hasVoted,
          },
          tokenVoter,
        },
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || 'Internal server error',
      });
      next(err);
    }
  },
  getVoterByCompany: async (req, res) => {
    try {
      const companyId = req.company.id;

      const voter = await Voter.find({ companyId });

      res.status(200).json({
        message: 'Data voter berhasil diambil',
        data: voter,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },
  deleteVoter: async (req, res) => {
    try {
      const { id } = req.params;
      const companyId = req.company.id;

      const voter = await Voter.findOneAndDelete({
        _id: id,
        // companyId,
      });
      if (!voter) {
        return res.status(404).json({
          error: true,
          message:
            'Voter tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya',
        });
      }

      res.status(200).json({
        message: 'Voter berhasil dihapus',
        data: voter,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },
  editVoter: async (req, res) => {
    try {
      const { id } = req.params;
      const { email, password, electionName, electionDescription } = req.body;

      console.log(id, email, password, electionName, electionDescription);

      const voter = await Voter.findById(id);

      if (!voter) {
        return res.status(404).json({
          error: true,
          message:
            'Voter tidak ditemukan atau Anda tidak memiliki izin untuk mengeditnya',
        });
      }

      // let hashedPassword = voter.password;
      // if (password) {
      //   const salt = await bcrypt.genSalt(10);
      //   hashedPassword = await bcrypt.hash(password, salt);
      // }

      const updatedVoter = await Voter.findByIdAndUpdate(
        id,
        { email, password },
        { new: true, runValidators: true }
      );

      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: emailGmail,
            pass: appPassword,
          },
        });

        const mailOptions = {
          from: {
            name: 'Raya Vote',
            address: emailGmail,
          },
          to: voter.email,
          subject: `Kamu terdaftar di Pemilihan ${electionName}`,
          html: `
          <h1>Kamu terdaftar sebagai pemilih</h1>
          <br>Informasi pemilihan kamu <b>telah diupdate</b>:
          <br><b>${electionName}</b>
          <br>${electionDescription}
          <br>
          <br>Email kamu: ${voter.email}
          <br>Password kamu: ${voter.password}
          <br>Silahkan kunjungi website di bawah untuk memilih:
          <br><a href="http://localhost:3000/">Click here to visit the website</a>
          `,
        };

        transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email' });
      }

      res.status(200).json({
        message: 'Voter berhasil diupdate',
        data: updatedVoter,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },
};
