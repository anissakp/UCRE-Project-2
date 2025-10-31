/**
 * CONFIG.JS
 * ===========
 * This file contains all the configuration settings for the chatbot.
 * Your teammates can easily find and change settings here.
 */

// ============================================
// API CONFIGURATION
// ============================================


// Import API keys from separate file
import { OPENAI_API_KEY, GEMINI_API_KEY } from './keys.js';

// Export the keys so other files can use them
export { OPENAI_API_KEY, GEMINI_API_KEY };

/**
 * Which Gemini AI model to use
 * Options:
 * - "gemini-2.0-flash-exp" (fastest, recommended)
 * - "gemini-pro" (balanced)
 * - "gemini-pro-vision" (can handle images)
 */
//export const AI_MODEL = "gemini-2.0-flash-exp";

export const AI_MODEL = 'gpt-4o-mini'; // or 'gpt-4', 'gpt-3.5-turbo', etc.


// ============================================
// CHATBOT SETTINGS
// ============================================

/**
 * The name displayed in the chat header
 */
export const BOT_NAME = "gAIa";

/**
 * The welcome message shown when the chat loads
 */
export const WELCOME_MESSAGE = "Hello! I'm gAIa, your AI assistant. How can I help you today?";

/**
 * Placeholder text in the input box
 */
export const INPUT_PLACEHOLDER = "Type your message...";


// ============================================
// UI COLORS (Tailwind Classes)
// ============================================

/**
 * You can customize the look by changing these Tailwind color classes
 * Examples: blue-500, purple-600, green-600, pink-500, red-600
 */
export const COLORS = {
  // Primary color for bot elements
  primary: "blue-500",
  primaryDark: "blue-600",
  primaryLight: "blue-400",
  
  // Accent color (used in gradients)
  accent: "purple-600",
  
  // User message bubble color
  userMessage: "blue-600",
  userMessageDark: "blue-700",
};


// ============================================
// ADVANCED SETTINGS
// ============================================

/**
 * Maximum number of messages to keep in history
 * Set to null for unlimited
 */
export const MAX_MESSAGE_HISTORY = null;

/**
 * Enable/disable message timestamps
 */
export const SHOW_TIMESTAMPS = true;

/**
 * Enable/disable typing indicator
 */
export const SHOW_TYPING_INDICATOR = true;
