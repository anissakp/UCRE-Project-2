/**
 * APP-TASK3.JS
 * ============
 * Entry point for Task 3 (Agreeable Tone)
 */

import React from 'react';
import { createRoot } from 'react-dom';
import ChatBot from './chatbot.js';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  React.createElement(ChatBot, { 
    tone: 'Agreeable',
    botIcon: 'green.png'
  })
);

console.log('✅ Task 3 ChatBot rendered (Agreeable Tone)');