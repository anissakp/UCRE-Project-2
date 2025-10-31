/**
 * APP-TASK2.JS
 * ============
 * Entry point for Task 2 (Condescending Tone)
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
    tone: 'Condescending'  // Task 2 uses Condescending tone
  })
);

console.log('✅ Task 2 ChatBot rendered (Condescending Tone)');