/**
 * APP.JS
 * ========
 * This is the main entry point of the application.
 * It initializes the chatbot with OpenAI API.
 */

import React from 'react';
import { createRoot } from 'react-dom';
import ChatBot from './chatbot.js';
import { OPENAI_API_KEY } from './config.js';


// ============================================
// RENDER THE APP
// ============================================

/**
 * Get the root element from the HTML
 */
const rootElement = document.getElementById('root');

/**
 * Create a React root and render the ChatBot component
 */
const root = createRoot(rootElement);

root.render(
  React.createElement(ChatBot, { openaiApiKey: OPENAI_API_KEY })
);

console.log('✅ ChatBot rendered with OpenAI');