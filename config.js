/**
 * CONFIG.JS
 * ===========
 * This file contains all the configuration settings for the chatbot.
 * Your teammates can easily find and change settings here.
 */

// ============================================
// API CONFIGURATION
// ============================================

/**
 * Your Gemini API Key
 * Get one at: https://aistudio.google.com/app/apikey
 * 
 * SECURITY WARNING: This key is visible in the code!
 * - Use this setup for development/testing only
 * - For production, use environment variables or a backend server
 */
export const GEMINI_API_KEY = "AIzaSyBS0Q187lrD26SYWSWUHzUA4hlwJ5Ty_NE";

/**
 * Which Gemini AI model to use
 * Options:
 * - "gemini-2.0-flash-exp" (fastest, recommended)
 * - "gemini-pro" (balanced)
 * - "gemini-pro-vision" (can handle images)
 */
export const AI_MODEL = "gemini-2.0-flash-exp";


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
