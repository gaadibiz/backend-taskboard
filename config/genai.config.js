const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
require('dotenv').config();

// console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY);

exports.model = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-flash',
  temperature: 0.1,
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
});
