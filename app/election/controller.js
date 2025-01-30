const Election = require('./model');

module.exports = {
  // Controller untuk membuat election baru
  createElection: async (req, res, next) => {
    try {
      // Mengambil data dari request body
      const { electionName, electionDesc } = req.body;
      const companyId = req.company.id;

      // Validasi input
      if (!electionName || !electionDesc) {
        return res.status(400).json({
          message: 'Election name dan description harus diisi!',
        });
      }

      // Membuat instance election baru
      const newElection = new Election({
        electionName,
        electionDesc,
        companyId,
      });

      // Simpan election ke database
      await newElection.save();

      // Kirimkan response sukses
      return res.status(201).json({
        message: 'Election created successfully!',
        data: newElection,
      });
    } catch (error) {
      // Tangani error dan kirimkan response error
      console.error(error);
      return res.status(500).json({
        message: 'Terjadi kesalahan saat membuat election!',
      });
    }
  },
  getElectionsByCompany: async (req, res) => {
    try {
      const companyId = req.company.id;

      const elections = await Election.find({ companyId });

      res.status(200).json({
        message: 'Data election berhasil diambil.',
        data: elections,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Terjadi kesalahan.' });
    }
  },
  getOrCreateElection: async (req, res, next) => {
    try {
      const { companyId } = req.query;

      const existingElection = await Election.find({ companyId });

      if (existingElection && existingElection.length > 0) {
        return res.status(200).json({
          message: 'Election already exists',
          data: existingElection,
        });
      } else {
        return res.status(200).json({
          message: 'No election found, redirect to create election',
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  editElection: async (req, res) => {
    try {
      const { id } = req.params;
      const { electionName, electionDesc, currentPhase } = req.body;

      const election = await Election.findOneAndUpdate(
        { _id: id },
        { electionName, electionDesc, currentPhase }
        // { new: true, runValidators: true }
      );

      if (!election) {
        return res.status(404).json({
          error: true,
          message:
            'Election tidak ditemukan',
        });
      }

      res.status(200).json({
        message: 'Election berhasil diupdate',
        data: election,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },
};
