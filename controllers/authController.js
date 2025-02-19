require("dotenv").config;
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || '9s24g665r3wt5321';

const authenticateUser = (req, res) => {
  const { username, password } = req.body;

  // Hardcoded credentials
  const validCredentials = {
    username: 'naval.ravikant',
    password: '05111974'
  };

  if(!validCredentials) {
    res.status(404).json({message: "validcredential not get"})
  }

  if (username === validCredentials.username && password === validCredentials.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({ JWT: token });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
};

module.exports = { authenticateUser };