/**
 * APP-TASK1.JS
 * ============
 * Entry point for Task 1 (Neutral Tone)
 */

import React from 'react';
import { createRoot } from 'react-dom';
import ChatBot from './chatbot.js';
import { OPENAI_API_KEY } from './config.js';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  React.createElement(ChatBot, { 
    openaiApiKey: OPENAI_API_KEY,
    tone: 'Neutral'  // Task 1 uses Neutral tone
  })
);

console.log('✅ Task 1 ChatBot rendered (Neutral Tone)');