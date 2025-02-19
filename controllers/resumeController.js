require("dotenv").config();
const pdf = require('pdf-parse');
const axios = require('axios');
const mongoose = require('mongoose');
const Applicant = require('../models/applicant');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const SECRET_KEY = process.env.JWT_SECRET || '9s24g665r3wt5321';

const GEMINI_API_URL = process.env.GEMINI_API_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Enrich resume data (enrichResumeData)
const enrichResumeData = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log("web token:", token); // Log token for debugging
  console.log("secret key:", SECRET_KEY);
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Decoded JWT:', decoded); // Log decoded token to check user details

    // Fetch PDF from the provided URL
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Bad Request: No URL provided' });
    }

    console.log("Fetching PDF from URL:", url);

    const response = await axios.get(url, { responseType: 'arraybuffer' });

    // Ensure that we are getting a valid PDF
    if (response.headers['content-type'] !== 'application/pdf') {
      return res.status(400).json({ error: 'Bad Request: Invalid file type, expected PDF' });
    }

    // Parse PDF content
    const pdfData = await pdf(response.data);

    if (!pdfData.text || pdfData.text.trim() === '') {
      return res.status(500).json({ error: 'Internal Server Error: No text extracted from PDF' });
    }

    console.log("Extracted PDF text:", pdfData.text); // Log extracted text for debugging

    // Step 2: Send extracted PDF text to Google Gemini for processing
    const prompt = `
      Extract the following details from the resume:
      - Name
      - Email
      - Education: Degree, Branch, Institution, Year
      - Experience: Job Title, Company, Start Date, End Date
      - Skills: List of skills
      - Summary: Write a short professional summary

      Resume Text:
      ${pdfData.text}
    `;

    const geminiResponse = await axios.post(
      GEMINI_API_URL,
      { prompt: prompt },
      {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Gemini API response:', geminiResponse.data);

    // Step 3: Extract the structured data from the Gemini response
    const geminiData = geminiResponse.data; // Assuming Gemini response structure is like this:
    const applicantData = {
      name: geminiData.name,
      email: geminiData.email,
      education: geminiData.education,
      experience: geminiData.experience,
      skills: geminiData.skills,
      summary: geminiData.summary
    };

    // Store applicant data in MongoDB
    const applicant = new Applicant(applicantData);
    await applicant.save();

    // Return response with stored applicant data
    return res.status(200).json({ message: 'Resume enriched and saved successfully', applicant });
  } catch (err) {
    console.error('Error processing resume:', err); // Log error for debugging
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

module.exports = { enrichResumeData };
