/**
 * APP-TASK2.JS
 * ============
 * Entry point for Task 2 (Condescending Tone)
 */

import React from 'react';
import { createRoot } from 'react-dom';
import ChatBot from './chatbot.js';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  React.createElement(ChatBot, { 
    tone: 'Condescending',
    botIcon: 'pink.png'
  })
);

console.log('✅ Task 2 ChatBot rendered (Condescending Tone)');