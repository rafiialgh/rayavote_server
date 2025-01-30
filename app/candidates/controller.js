const Candidate = require('./model');

module.exports = {
  addImageCandidate: async (req, res, next) => {
    try {
      console.log(req.file)
      let filename = req.file.filename;
      const candidate = new Candidate({
        avatar: filename,
      });

      await candidate.save();

      res.status(201).json({ data: candidate });
    } catch (err) {
      if (err && err.name === 'ValidationError') {
        return res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
      next(err);
    }
  },
  addCandidate: async (req, res, next) => {
    try {
      const {
        username,
        firstName,
        lastName,
        dateOfBirth,
        degree,
        description,
      } = req.body;

      const companyId = req.company.id;

      if (!username || !firstName || !dateOfBirth || !degree || !description) {
        return res
          .status(400)
          .json({ message: 'All required fields must be filled' });
      }

      // const existingCandidate = await Candidate.findOne({ username });
      // if (existingCandidate) {
      //   return res.status(400).json({ message: 'Username already exists' });
      // }

      const newCandidate = new Candidate({
        username,
        firstName,
        lastName,
        dateOfBirth,
        degree,
        description,
        companyId,
      });

      await newCandidate.save();

      return res.status(201).json({
        message: 'Candidate added successfully',
        data: newCandidate,
      });
    } catch (error) {
      // console.error('Error adding candidate:', error);
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
  getCandidateByCompany: async (req, res) => {
    try {
      const companyId = req.company.id;

      const candidates = await Candidate.find({ companyId });

      res.status(200).json({
        message: 'Data candidate berhasil diambil',
        data: candidates,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },
  deleteCandidate: async (req, res) => {
    try {
      const { id } = req.params;
      const companyId = req.company.id;

      const candidate = await Candidate.findOneAndDelete({
        _id: id,
        companyId,
      });
      if (!candidate) {
        return res.status(404).json({
          error: true,
          message:
            'Candidate tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya',
        });
      }

      res.status(200).json({
        message: 'Candidate berhasil dihapus',
        data: candidate,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },
  editCandidate: async (req, res) => {
    try {
      const { id } = req.params;
      const companyId = req.company.id;
      const {
        username,
        firstName,
        lastName,
        dateOfBirth,
        degree,
        description,
      } = req.body;
      console.log(req.body);

      const candidate = await Candidate.findOneAndUpdate(
        { _id: id },
        { username, firstName, lastName, dateOfBirth, degree, description }
        // { new: true, runValidators: true }
      );

      if (!candidate) {
        return res.status(404).json({
          error: true,
          message:
            'Candidate tidak ditemukan atau Anda tidak memiliki izin untuk mengeditnya',
        });
      }

      res.status(200).json({
        message: 'Candidate berhasil diupdate',
        data: candidate,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },
};
