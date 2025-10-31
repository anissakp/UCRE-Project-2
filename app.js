/**
 * APP.JS
 * ========
 * This is the main entry point of the application.
 * It initializes the Gemini AI and renders the chatbot.
 */

import React from 'react';
import { createRoot } from 'react-dom';
import { GoogleGenAI } from '@google/genai';
import ChatBot from './chatbot.js';
import { GEMINI_API_KEY } from './config.js';


// ============================================
// INITIALIZE GEMINI AI
// ============================================

/**
 * Create a new Gemini AI instance with your API key
 */
const geminiAI = new GoogleGenAI({ 
  apiKey: GEMINI_API_KEY 
});

console.log('✅ Gemini AI initialized');


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
  React.createElement(ChatBot, { geminiAI: geminiAI })
);

console.log('✅ ChatBot rendered');
