const nodemailer = require('nodemailer');
const Voter = require('../voter/model');
const { emailGmail, appPassword } = require('../../config');

module.exports = {
  resultMail: async (req, res) => {
    try {
      const { electionAddress, electionName, winnerCandidate } = req.body;
      console.log(req.body);

      const voters = await Voter.find({ electionAddress: electionAddress });

      if (!voters.length) {
        return res.status(404).json({ message: 'No voters found for this election' });
      }

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

      for (const voter of voters) {
        try {
          const mailOptions = {
            from: {
              name: 'Raya Vote',
              address: emailGmail,
            },
            to: voter.email, 
            subject: `Hasil dari pemilihan ${electionName} sudah selesai`,
            html: `
              <h1>Terima kasih atas partisipasi Anda</h1>
              <br>Pemenang dari pemilihan tersebut adalah:
              <br><b>${winnerCandidate}</b>
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
          console.log(`Email sent to ${voter.email}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${voter.email}:`, emailError);
        }
      }

      res.status(200).json({
        message: 'Email sudah terkirim',
        totalEmails: voters.length,
      });
    } catch (error) {
      console.error('Error processing emails:', error);
      res.status(500).json({ message: 'Failed to process emails' });
    }
  },
};
