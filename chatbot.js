/**
 * CHATBOT.JS
 * ===========
 * This file contains the main ChatBot component.
 * It handles the UI and user interactions.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import * as config from './config.js';

/**
 * Simple Markdown Parser
 * Converts markdown text to formatted HTML elements
 */
function parseMarkdown(text) {
  const lines = text.split('\n');
  const elements = [];
  let currentParagraph = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeBlockLanguage = '';

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      elements.push({
        type: 'p',
        content: currentParagraph.join('\n')
      });
      currentParagraph = [];
    }
  };

  lines.forEach((line, index) => {
    // Code block detection
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        flushParagraph();
        inCodeBlock = true;
        codeBlockLanguage = line.trim().slice(3);
        codeBlockContent = [];
      } else {
        inCodeBlock = false;
        elements.push({
          type: 'code',
          content: codeBlockContent.join('\n'),
          language: codeBlockLanguage
        });
        codeBlockContent = [];
        codeBlockLanguage = '';
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Headers
    if (line.startsWith('### ')) {
      flushParagraph();
      elements.push({ type: 'h3', content: line.slice(4) });
      return;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      elements.push({ type: 'h2', content: line.slice(3) });
      return;
    }
    if (line.startsWith('# ')) {
      flushParagraph();
      elements.push({ type: 'h1', content: line.slice(2) });
      return;
    }

    // Lists
    if (line.trim().match(/^[-*+]\s/)) {
      flushParagraph();
      elements.push({ type: 'li', content: line.trim().slice(2) });
      return;
    }
    if (line.trim().match(/^\d+\.\s/)) {
      flushParagraph();
      elements.push({ type: 'oli', content: line.trim().replace(/^\d+\.\s/, '') });
      return;
    }

    // Empty line
    if (line.trim() === '') {
      flushParagraph();
      return;
    }

    // Regular paragraph line
    currentParagraph.push(line);
  });

  flushParagraph();
  return elements;
}

/**
 * Format inline markdown (bold, italic, code, links)
 */
function formatInlineMarkdown(text, isUser) {
  const parts = [];
  let currentText = text;
  let key = 0;

  // Process inline code first
  const codeRegex = /`([^`]+)`/g;
  const codeParts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(currentText)) !== null) {
    if (match.index > lastIndex) {
      codeParts.push({ type: 'text', content: currentText.slice(lastIndex, match.index) });
    }
    codeParts.push({ type: 'code', content: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < currentText.length) {
    codeParts.push({ type: 'text', content: currentText.slice(lastIndex) });
  }

  // Process bold, italic, links in each part
  codeParts.forEach((part, partIndex) => {
    if (part.type === 'code') {
      parts.push(
        React.createElement('code', {
          key: `code-${partIndex}`,
          style: {
            backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.9em'
          }
        }, part.content)
      );
      return;
    }

    let text = part.content;
    const segments = [];
    let currentPos = 0;

    // Bold
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let boldMatch;
    const withBold = [];
    let lastBoldIndex = 0;

    while ((boldMatch = boldRegex.exec(text)) !== null) {
      if (boldMatch.index > lastBoldIndex) {
        withBold.push({ type: 'text', content: text.slice(lastBoldIndex, boldMatch.index) });
      }
      withBold.push({ type: 'bold', content: boldMatch[1] });
      lastBoldIndex = boldMatch.index + boldMatch[0].length;
    }
    if (lastBoldIndex < text.length) {
      withBold.push({ type: 'text', content: text.slice(lastBoldIndex) });
    }

    // Process italic in each segment
    withBold.forEach((segment, segIndex) => {
      if (segment.type === 'bold') {
        parts.push(
          React.createElement('strong', {
            key: `bold-${partIndex}-${segIndex}`,
            style: { fontWeight: 'bold' }
          }, segment.content)
        );
        return;
      }

      let segText = segment.content;
      const italicRegex = /\*([^*]+)\*/g;
      let italicMatch;
      let lastItalicIndex = 0;

      while ((italicMatch = italicRegex.exec(segText)) !== null) {
        if (italicMatch.index > lastItalicIndex) {
          parts.push(segText.slice(lastItalicIndex, italicMatch.index));
        }
        parts.push(
          React.createElement('em', {
            key: `italic-${partIndex}-${segIndex}-${italicMatch.index}`,
            style: { fontStyle: 'italic' }
          }, italicMatch[1])
        );
        lastItalicIndex = italicMatch.index + italicMatch[0].length;
      }
      if (lastItalicIndex < segText.length) {
        parts.push(segText.slice(lastItalicIndex));
      }
    });
  });

  return parts.length > 0 ? parts : text;
}

/**
 * Render parsed markdown elements
 */
function renderMarkdown(elements, isUser) {
  return elements.map((element, index) => {
    const key = `${element.type}-${index}`;

    switch (element.type) {
      case 'h1':
        return React.createElement('h1', {
          key,
          style: { fontSize: '1.5em', fontWeight: 'bold', margin: '0.5em 0' }
        }, formatInlineMarkdown(element.content, isUser));

      case 'h2':
        return React.createElement('h2', {
          key,
          style: { fontSize: '1.3em', fontWeight: 'bold', margin: '0.5em 0' }
        }, formatInlineMarkdown(element.content, isUser));

      case 'h3':
        return React.createElement('h3', {
          key,
          style: { fontSize: '1.1em', fontWeight: 'bold', margin: '0.5em 0' }
        }, formatInlineMarkdown(element.content, isUser));

      case 'p':
        return React.createElement('p', {
          key,
          style: { margin: '0.5em 0' }
        }, formatInlineMarkdown(element.content, isUser));

      case 'code':
        return React.createElement('pre', {
          key,
          style: { margin: '0.5em 0' }
        }, React.createElement('code', {
          style: {
            display: 'block',
            backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
            padding: '10px',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '0.9em',
            overflowX: 'auto'
          }
        }, element.content));

      case 'li':
        return React.createElement('div', {
          key,
          style: { marginLeft: '1.5em', margin: '0.25em 0' }
        }, '• ', formatInlineMarkdown(element.content, isUser));

      case 'oli':
        return React.createElement('div', {
          key,
          style: { marginLeft: '1.5em', margin: '0.25em 0' }
        }, `${index + 1}. `, formatInlineMarkdown(element.content, isUser));

      default:
        return null;
    }
  });
}

/**
 * Main ChatBot Component
 * 
 * Props:
 * - geminiAI: The initialized Gemini AI instance
 */
export default function ChatBot({ geminiAI }) {
  
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  /**
   * All chat messages
   * Each message has: id, text, sender ('bot' or 'user'), timestamp
   */
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: config.WELCOME_MESSAGE,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  /**
   * Current text in the input box
   */
  const [inputValue, setInputValue] = useState('');
  
  /**
   * Whether the bot is currently "thinking" (typing)
   */
  const [isTyping, setIsTyping] = useState(false);
  
  // References to DOM elements
  const messagesEndRef = useRef(null);  // Used for auto-scrolling
  const inputRef = useRef(null);        // Reference to input field
  
  
  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  /**
   * Automatically scroll to the bottom of the chat
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  /**
   * Format a date object into a readable time string
   * Example: "2:30 PM"
   */
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  
  // ============================================
  // EFFECTS
  // ============================================
  
  /**
   * Auto-scroll to bottom whenever messages change
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  
  // ============================================
  // MAIN CHAT LOGIC
  // ============================================
  
  /**
   * Handle sending a message
   * This function:
   * 1. Adds the user's message to the chat
   * 2. Sends it to Gemini AI
   * 3. Displays the AI's response
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Don't send empty messages
    if (!inputValue.trim()) return;
    
    // 1. Create user message object
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    // 2. Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    
    // 3. Save the message and clear input
    const currentInput = inputValue;
    setInputValue('');
    
    // 4. Show typing indicator
    setIsTyping(true);
    
    try {
      // 5. Send message to Gemini AI
      const response = await geminiAI.models.generateContent({
        model: config.AI_MODEL,
        contents: currentInput,
      });
      
      // 6. Create bot response message
      const botMessage = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date()
      };
      
      // 7. Add bot response to chat
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      // Handle any errors (network issues, API problems, etc.)
      console.error('Error calling Gemini AI:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
    } finally {
      // 8. Always hide typing indicator when done
      setIsTyping(false);
    }
  };
  
  
  // ============================================
  // RENDER UI
  // ============================================
  
  return React.createElement('div', { className: "flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100" },
    // Header
    React.createElement(Header),
    
    // Messages Area  
    React.createElement(MessagesArea, {
      messages: messages,
      isTyping: isTyping,
      messagesEndRef: messagesEndRef,
      formatTime: formatTime
    }),
    
    // Input Area
    React.createElement(InputArea, {
      inputValue: inputValue,
      setInputValue: setInputValue,
      handleSendMessage: handleSendMessage,
      inputRef: inputRef
    })
  );
}


// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * Header Component
 * Shows the bot name and online status
 */
function Header() {
  return React.createElement('div', { className: "bg-white border-b border-slate-200 shadow-sm" },
    React.createElement('div', { className: "max-w-4xl mx-auto px-4 py-4 flex items-center gap-3" },
      // Bot Avatar
      React.createElement('div', { className: "relative" },
        React.createElement('div', { className: `w-10 h-10 bg-gradient-to-br from-${config.COLORS.primary} to-${config.COLORS.accent} rounded-full flex items-center justify-center` },
          React.createElement(Sparkles, { className: "w-5 h-5 text-white" })
        ),
        // Online indicator (green dot)
        React.createElement('div', { className: "absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" })
      ),
      // Bot Name and Status
      React.createElement('div', null,
        React.createElement('h1', { className: "text-lg font-semibold text-slate-800" }, config.BOT_NAME),
        React.createElement('p', { className: "text-xs text-slate-500" }, "Online")
      )
    )
  );
}


/**
 * Messages Area Component
 * Displays all chat messages and typing indicator
 */
function MessagesArea({ messages, isTyping, messagesEndRef, formatTime }) {
  return React.createElement('div', { className: "flex-1 overflow-y-auto" },
    React.createElement('div', { className: "max-w-4xl mx-auto px-4 py-6 space-y-6" },
      // Render each message
      ...messages.map((message) =>
        React.createElement(Message, {
          key: message.id,
          message: message,
          formatTime: formatTime
        })
      ),
      
      // Typing indicator (only shown when bot is thinking)
      config.SHOW_TYPING_INDICATOR && isTyping && React.createElement(TypingIndicator),
      
      // Invisible element for auto-scrolling
      React.createElement('div', { ref: messagesEndRef })
    )
  );
}


/**
 * Single Message Component
 * Displays one message bubble (either from user or bot)
 */
function Message({ message, formatTime }) {
  const isUser = message.sender === 'user';
  const parsedContent = parseMarkdown(message.text);
  
  return React.createElement('div', {
    className: `flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`
  },
    // Avatar
    React.createElement('div', {
      className: `flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-slate-600 to-slate-700'
          : `bg-gradient-to-br from-${config.COLORS.primary} to-${config.COLORS.accent}`
      }`
    },
      isUser
        ? React.createElement(User, { className: "w-5 h-5 text-white" })
        : React.createElement(Bot, { className: "w-5 h-5 text-white" })
    ),
    
    // Message Bubble
    React.createElement('div', {
      className: `flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`
    },
      React.createElement('div', {
        className: `px-4 py-3 rounded-2xl ${
          isUser
            ? `bg-gradient-to-br from-${config.COLORS.userMessage} to-${config.COLORS.userMessageDark} text-white shadow-md`
            : 'bg-white text-slate-800 shadow-sm border border-slate-200'
        }`,
        style: { fontSize: '14px', lineHeight: '1.6' }
      },
        React.createElement('div', null, renderMarkdown(parsedContent, isUser))
      ),
      
      // Timestamp
      config.SHOW_TIMESTAMPS && React.createElement('span', { className: "text-xs text-slate-400 mt-1 px-2" },
        formatTime(message.timestamp)
      )
    )
  );
}


/**
 * Typing Indicator Component
 * Shows animated dots when bot is thinking
 */
function TypingIndicator() {
  return React.createElement('div', { className: "flex gap-3" },
    React.createElement('div', {
      className: `flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-${config.COLORS.primary} to-${config.COLORS.accent} flex items-center justify-center`
    },
      React.createElement(Bot, { className: "w-5 h-5 text-white" })
    ),
    React.createElement('div', { className: "bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-200" },
      React.createElement('div', { className: "flex gap-1" },
        React.createElement('div', { className: "w-2 h-2 bg-slate-400 rounded-full animate-bounce" }),
        React.createElement('div', { 
          className: "w-2 h-2 bg-slate-400 rounded-full animate-bounce",
          style: { animationDelay: '0.2s' }
        }),
        React.createElement('div', {
          className: "w-2 h-2 bg-slate-400 rounded-full animate-bounce",
          style: { animationDelay: '0.4s' }
        })
      )
    )
  );
}


/**
 * Input Area Component
 * Contains the text input and send button
 */
function InputArea({ inputValue, setInputValue, handleSendMessage, inputRef }) {
  return React.createElement('div', { className: "bg-white border-t border-slate-200 shadow-lg" },
    React.createElement('div', { className: "max-w-4xl mx-auto px-4 py-4" },
      React.createElement('form', { onSubmit: handleSendMessage, className: "flex gap-3" },
        // Text Input
        React.createElement('input', {
          ref: inputRef,
          type: "text",
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          placeholder: config.INPUT_PLACEHOLDER,
          className: "flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder-slate-400 transition-all"
        }),
        
        // Send Button
        React.createElement('button', {
          type: "submit",
          disabled: !inputValue.trim(),
          className: `w-12 h-12 bg-gradient-to-br from-${config.COLORS.userMessage} to-${config.COLORS.userMessageDark} hover:from-${config.COLORS.userMessageDark} hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:shadow-none`
        },
          React.createElement(Send, { className: "w-5 h-5" })
        )
      ),
      
      // Disclaimer
      React.createElement('p', { className: "text-xs text-slate-400 text-center mt-3" },
        "AI can make mistakes. Verify important information."
      )
    )
  );
}