# Triage Classification System

This application uses the Groq API with Llama model to classify patients into triage color codes based on their symptoms and conditions.

## Setup

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Groq API key:
```
GROQ_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter patient information in the text area
2. Click "Classify" to get the triage color code
3. The result will be displayed below the form

## Triage Color Codes

- RED (Immediate) - Immediate life-threatening conditions
- YELLOW (Urgent) - Serious but not immediately life-threatening
- GREEN (Minor) - Minor injuries or illnesses
- BLACK (Expectant) - Beyond help or dead

## Technologies Used

- Next.js
- React
- Chakra UI
- Groq API with Llama model 