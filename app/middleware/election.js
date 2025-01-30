const Election = require('../election/model');

const checkElectionMiddleware = async (req, res, next) => {
  try {
    const companyId = req.company.id;
    console.log('check: ' + companyId)

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID not found' });
    }

    const existingElection = await Election.find({ companyId });

    if (existingElection && existingElection.length > 0) {
      return res.status(400).json({
        message: 'You already have an election',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkElectionMiddleware;
