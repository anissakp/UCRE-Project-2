# gAIa
This project was completed as part of Carnegie Mellon University’s 05-610: User-Centered Research and Evaluation Course. The goal is to explore how AI chatbots can thoughtfully engage with and challenge pre-existing beliefs in women's health conversations.

## Deployed Page
https://anissakp.github.io/UCRE-Project-2/index.html

## Installation and Usage

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/anissakp/UCRE-Project-2.git
cd UCRE-Project-2
```

### 2. Set Up Your OpenAI API Key

Create a new file called `keys.js` in the root directory and add your OpenAI API key:

```javascript
export const OPENAI_API_KEY = 'sk-your-actual-api-key-here';
```

### 3. Run a Local Server

Using Python (Built-in):

```bash
# For Python 3
python3 -m http.server 8000
```

Then open your browser and go to: `http://localhost:8000/index.html`

### 4. Navigate the Site

- **Home Page** (`index.html`) - Welcome page with three task tiles
- **Task 1** (`task1.html`) - Neutral tone chatbot
- **Task 2** (`task2.html`) - Condescending tone chatbot
- **Task 3** (`task3.html`) - Agreeable tone chatbot

Click on any task tile to interact with the corresponding AI chatbot.
