const Candidate = require('../candidates/model');
const Voter = require('../voter/model');

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const companyId = req.company.id;

      const candidatesCount = await Candidate.countDocuments({ companyId });
      const votersCount = await Voter.countDocuments({ companyId });

      const votedCount = await Voter.countDocuments({ companyId, hasVoted: true });
      const notVotedCount = await Voter.countDocuments({ companyId, hasVoted: false });

      console.log(candidatesCount);

      res.status(200).json({
        data: {
          candidates: candidatesCount,
          voters: votersCount,
          voted: votedCount,
          notVoted: notVotedCount
        },
      });
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  },
};
