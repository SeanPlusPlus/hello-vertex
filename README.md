# Vertex AI Node.js Setup

This project demonstrates how to connect to **Google Cloud Vertex AI** using Node.js and generate responses from the **Gemini API**.

---

## **1. Prerequisites**

### **Install Google Cloud SDK**
Ensure you have the **Google Cloud CLI** installed:
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### **Enable Billing and APIs**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Billing** for your project
3. Enable the **Vertex AI API**:
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```

### **Create a Service Account**
```bash
gcloud iam service-accounts create hello-vertex \
    --description="Vertex AI service account" \
    --display-name="Vertex AI Service"
```

### **Grant IAM Permissions**
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:hello-vertex@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:hello-vertex@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.serviceAgent"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:hello-vertex@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

### **Generate and Download Service Account Key**
```bash
gcloud iam service-accounts keys create config/service-account.json \
    --iam-account=hello-vertex@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

---

## **2. Setup the Project**

### **Clone the Repository (If Applicable)**
```bash
git clone YOUR_REPO_URL
cd hello-vertex
```

### **Install Dependencies**
```bash
npm install dotenv @google-cloud/vertexai
```

### **Set Up Environment Variables**
Create a `.env` file:
```
GOOGLE_APPLICATION_CREDENTIALS=./config/service-account.json
```
Load the environment:
```bash
source .env
```

---

## **3. Run the Node.js Script**

### **`index.js` (Main Script)**
```javascript
import dotenv from 'dotenv';
import { VertexAI } from '@google-cloud/vertexai';
import path from 'path';

// Load environment variables
dotenv.config();

// Ensure credentials path is absolute
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Initialize Vertex AI client
const vertexAi = new VertexAI({ project: 'YOUR_PROJECT_ID', location: 'us-central1' });
const model = vertexAi.getGenerativeModel({ model: 'gemini-pro' });

async function generateText(prompt) {
  try {
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    console.log('Full Response:', JSON.stringify(response, null, 2));
    console.log('Extracted Text:', response?.response?.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (error) {
    console.error('Error:', error);
  }
}

generateText("Tell me a fun fact about space!");
```

### **Run the Script**
```bash
node index.js
```

Expected output:
```bash
Extracted Text: Did you know that there is a planet made entirely of diamond?...
```

---

## **4. Troubleshooting**

### **403 Permission Denied Errors**
If you see `PERMISSION_DENIED`, ensure:
1. The service account has **Vertex AI** roles.
2. You have **billing enabled**.
3. You are using the correct **project ID**.
4. Re-authenticate:
   ```bash
   gcloud auth activate-service-account hello-vertex@YOUR_PROJECT_ID.iam.gserviceaccount.com --key-file=$GOOGLE_APPLICATION_CREDENTIALS
   ```

### **Environment Variable Not Found**
Ensure `GOOGLE_APPLICATION_CREDENTIALS` is set:
```bash
echo $GOOGLE_APPLICATION_CREDENTIALS
```
If it’s empty, reload it:
```bash
source .env
```

---

## **5. Next Steps**
- Explore different models (`gemini-pro`, `gemini-1.5-pro`)
- Deploy as a REST API using **Express.js**
- Build a chatbot with real-time responses

---

**🎉 Congratulations! You have successfully set up Vertex AI with Node.js! 🚀**

