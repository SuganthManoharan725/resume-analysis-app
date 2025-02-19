const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    name: String,
    email: String,
    education: {
      degree: String,
      branch: String,
      institution: String,
      year: String
    },
    experience: {
      job_title: String,
      company: String,
      start_date: String,
      end_date: String
    },
    skills: [String],
    summary: String
  });

  const Applicant = mongoose.model('applicant', applicantSchema );
module.exports = Applicant