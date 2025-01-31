import dotenv from 'dotenv';
import { VertexAI } from '@google-cloud/vertexai';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Ensure the credentials path is absolute
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Initialize Vertex AI client
const vertexAi = new VertexAI({ project: 'csvai-407816', location: 'us-central1' });

// Load the text model (Gemini)
const model = vertexAi.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function generateText(prompt) {
  try {
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // console.log('Full Response:', JSON.stringify(response, null, 2)); // Debugging output

    console.log('Extracted Text:', response?.response?.candidates?.[0]?.content?.parts?.[0]?.text);

  } catch (error) {
    console.error('Error:', error);
  }
}


// Run a test prompt
generateText("Tell me a fun fact about space!");
