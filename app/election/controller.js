const Election = require('./model');

module.exports = {
  // Controller untuk membuat election baru
  createElection: async (req, res, next) => {
    try {
      // Mengambil data dari request body
      const { electionAddress, startTime, endTime } = req.body;
      const companyId = req.company.id;

      // if (!electionName || !electionDesc) {
      //   return res.status(400).json({
      //     message: 'Election name dan description harus diisi!',
      //   });
      // }

      if (new Date(startTime) >= new Date(endTime)) {
        return res
          .status(400)
          .json({ message: 'Start time harus lebih kecil dari end time' });
      }

      // Membuat instance election baru
      const newElection = new Election({
        // electionName,
        // electionDesc,
        companyId,
        electionAddress,
        startTime,
        endTime,
        currentPhase: 'init',
      });

      await newElection.save();

      return res.status(201).json({
        message: 'Election created successfully!',
        data: newElection,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Terjadi kesalahan saat membuat election!',
      });
    }
  },
  getElectionsByCompany: async (req, res) => {
    try {
      // const companyId = req.company.id;
      const { address } = req.params;

      const election = await Election.findOne({ electionAddress: address });

      if (!election) {
        return res.status(404).json({
          message: 'Data election tidak tersedia.',
        });
      }

      const now = new Date();

      let status = 'init';
  
      if (now >= election.startTime && now < election.endTime) {
        status = 'ongoing';
      } else if (now >= election.endTime) {
        status = 'completed';
      }
  
      election.currentPhase = status;
      await election.save();

      res.status(200).json({
        message: 'Data election berhasil diambil.',
        data: election,
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
      const { startTime, endTime } = req.body;
      console.log(startTime, endTime)
      const election = await Election.findOne({ electionAddress: req.params.id});

      if (!election) {
        return res.status(404).json({ message: 'Election not found' });
      }

      if (startTime && new Date(startTime) >= new Date(endTime)) {
        return res
          .status(400)
          .json({ message: 'Start time harus lebih kecil dari end time' });
      }

      election.startTime = startTime || election.startTime;
      election.endTime = endTime || election.endTime;

      await election.save();

      res.status(200).json({
        message: 'Election berhasil diupdate',
        data: election,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: error.message });
    }
  },
  getElectionStatus: async (req, res) => {
    try {
      const { address } = req.params;
      const election = await Election.findOne({ electionAddress: address });
      if (!election) {
        return res.status(404).json({ message: 'Election not found' });
      }
  
      const now = new Date();
      const localNow = new Date(now).toISOString()
      console.log(localNow)
      console.log(now)
      console.log(election.startTime.toLocaleString())
      let status = 'init';
  
      if (now >= election.startTime && now < election.endTime) {
        status = 'ongoing';
      } else if (now >= election.endTime) {
        status = 'completed';
      }
  
      election.currentPhase = status;
      await election.save();
  
      res.status(200).json({ status, message: `Election is currently in ${status} phase` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
