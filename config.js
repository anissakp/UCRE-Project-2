/**
 * CONFIG.JS
 * ===========
 * Configuration settings for the chatbot.
 */

import { OPENAI_API_KEY } from './keys.js';
export { OPENAI_API_KEY };

export const AI_MODEL = 'gpt-4o-mini';

export const BOT_NAME = "gAIa";
export const WELCOME_MESSAGE = "Hello! I'm gaia, your AI assistant. How can I help you today?";
export const INPUT_PLACEHOLDER = "Type your message...";

export const COLORS = {
  primary: "blue-500",
  primaryDark: "blue-600",
  primaryLight: "blue-400",
  accent: "purple-600",
  userMessage: "blue-600",
  userMessageDark: "blue-700",
};

export const MAX_MESSAGE_HISTORY = null;
export const SHOW_TIMESTAMPS = true;
export const SHOW_TYPING_INDICATOR = true;