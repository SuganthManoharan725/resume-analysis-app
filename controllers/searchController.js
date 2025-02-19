const Applicant = require('../models/applicant');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || '9s24g665r3wt5321';

const searchResumes = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, SECRET_KEY);

    const { name } = req.body;
    const applicants = await Applicant.find({ name: { $regex: name, $options: 'i' } });

    if (!applicants.length) {
      return res.status(404).json({ error: 'No matching records found' });
    }

    return res.status(200).json(applicants);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { searchResumes };
