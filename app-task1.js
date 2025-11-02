/**
 * APP-TASK1.JS
 * ============
 * Entry point for Task 1 (Neutral Tone)
 */

import React from 'react';
import { createRoot } from 'react-dom';
import ChatBot from './chatbot.js';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  React.createElement(ChatBot, { 
    tone: 'Neutral',
    botIcon: 'blue.png'
  })
);

console.log('✅ Task 1 ChatBot rendered (Neutral Tone)');