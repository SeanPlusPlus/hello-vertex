import dotenv from 'dotenv';
import { VertexAI } from '@google-cloud/vertexai';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Ensure the credentials path is absolute
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Initialize Vertex AI client
const vertexAi = new VertexAI({ project: 'csvai-407816', location: 'us-central1' });

// Load the text model (Gemini 1.5 Flash for faster responses)
const model = vertexAi.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function generateStructuredResponse(prompt) {
  try {
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // Extract text from response
    const extractedText = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const responseId = response?.response?.responseId || "unknown";
    const modelVersion = response?.response?.modelVersion || "unknown";

    // Structure output as JSON
    const structuredOutput = {
      response_id: responseId,
      model_version: modelVersion,
      prompt: prompt,
      output: extractedText,
      timestamp: new Date().toISOString()
    };

    console.log(JSON.stringify(structuredOutput, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run a test prompt
generateStructuredResponse("Tell me a fun fact about space!");
