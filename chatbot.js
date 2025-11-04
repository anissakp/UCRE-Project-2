/**
 * CHATBOT.JS
 * ===========
 * This file contains the main ChatBot component.
 * It handles the UI and user interactions - NO TAILWIND!
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import * as config from './config.js';

/**
 * Color schemes for different tasks (PASTELS!)
 */
const TASK_COLORS = {
  'Neutral': {
    primary: '#a8c5e8',      // Soft Blue
    secondary: '#c8b8db',    // Light Purple
    userBg: '#a8c5e8',
    userBgDark: '#8bb3d9',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)'
  },
  'Condescending': {
    primary: '#f5a5a5',      // Soft Red/Pink
    secondary: '#ffc1a8',    // Peachy
    userBg: '#f5a5a5',
    userBgDark: '#e88d8d',
    background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)'
  },
  'Agreeable': {
    primary: '#b8e6b8',      // Soft Green
    secondary: '#a8d8c8',    // Mint
    userBg: '#b8e6b8',
    userBgDark: '#9dd49d',
    background: 'linear-gradient(135deg, #f0fff0 0%, #e8f5e8 100%)'
  }
};

/**
 * API Key Prompt Component
 */
function ApiKeyPrompt({ onSubmit, colors }) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }
    if (!apiKey.startsWith('sk-')) {
      setError('API key should start with "sk-"');
      return;
    }
    onSubmit(apiKey.trim());
  };

  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }
  },
    React.createElement('div', {
      style: {
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }
    },
      React.createElement('h2', {
        style: {
          fontSize: '24px',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '12px'
        }
      }, 'Enter Your OpenAI API Key'),
      React.createElement('p', {
        style: {
          fontSize: '14px',
          color: '#64748b',
          marginBottom: '24px',
          lineHeight: '1.6'
        }
      }, 'To use this chatbot, you\'ll need to provide your own OpenAI API key.'),
      React.createElement('form', {
        onSubmit: handleSubmit
      },
        React.createElement('input', {
          type: 'password',
          value: apiKey,
          onChange: (e) => {
            setApiKey(e.target.value);
            setError('');
          },
          placeholder: 'sk-...',
          style: {
            width: '100%',
            padding: '12px 16px',
            fontSize: '14px',
            border: `2px solid ${error ? '#ef4444' : '#e2e8f0'}`,
            borderRadius: '8px',
            outline: 'none',
            marginBottom: '8px',
            fontFamily: 'monospace'
          }
        }),
        error && React.createElement('p', {
          style: {
            fontSize: '12px',
            color: '#ef4444',
            marginBottom: '16px'
          }
        }, error),
        React.createElement('button', {
          type: 'submit',
          style: {
            width: '100%',
            padding: '12px',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '8px'
          }
        }, 'Start Chatting'),
        React.createElement('p', {
          style: {
            fontSize: '12px',
            color: '#94a3b8',
            marginTop: '16px',
            textAlign: 'center'
          }
        }, 
          'Don\'t have an API key? ',
          React.createElement('a', {
            href: 'https://platform.openai.com/api-keys',
            target: '_blank',
            rel: 'noopener noreferrer',
            style: {
              color: colors.primary,
              textDecoration: 'underline'
            }
          }, 'Get one here')
        )
      )
    )
  );
}

// [Rest of your existing functions: parseMarkdown, formatInlineMarkdown, renderMarkdown - keep them exactly as they are]

/**
 * Simple Markdown Parser
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

    if (line.trim() === '') {
      flushParagraph();
      return;
    }

    currentParagraph.push(line);
  });

  flushParagraph();
  return elements;
}

/**
 * Format inline markdown
 */
function formatInlineMarkdown(text, isUser) {
  const parts = [];
  const codeRegex = /`([^`]+)`/g;
  const codeParts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      codeParts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    codeParts.push({ type: 'code', content: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    codeParts.push({ type: 'text', content: text.slice(lastIndex) });
  }

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
 * Render markdown elements
 */
function renderMarkdown(elements, isUser) {
  return elements.map((element, index) => {
    const key = `${element.type}-${index}`;

    switch (element.type) {
      case 'h1':
        return React.createElement('h1', {
          key,
          style: { 
            fontSize: '2.2em', 
            fontWeight: 'bold', 
            margin: '1em 0 0.6em 0',
            lineHeight: '1.3'
          }
        }, formatInlineMarkdown(element.content, isUser));

      case 'h2':
        return React.createElement('h2', {
          key,
          style: { 
            fontSize: '1.9em', 
            fontWeight: 'bold', 
            margin: '0.9em 0 0.5em 0',
            lineHeight: '1.3'
          }
        }, formatInlineMarkdown(element.content, isUser));

      case 'h3':
        return React.createElement('h3', {
          key,
          style: { 
            fontSize: '1.6em', 
            fontWeight: 'bold', 
            margin: '0.8em 0 0.4em 0',
            lineHeight: '1.3'
          }
        }, formatInlineMarkdown(element.content, isUser));

      case 'p':
        return React.createElement('p', {
          key,
          style: { margin: '0.8em 0' }
        }, formatInlineMarkdown(element.content, isUser));

      case 'code':
        return React.createElement('pre', {
          key,
          style: { margin: '1em 0' }
        }, React.createElement('code', {
          style: {
            display: 'block',
            backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
            padding: '12px',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '0.9em',
            overflowX: 'auto'
          }
        }, element.content));

      case 'li':
        return React.createElement('div', {
          key,
          style: { marginLeft: '1.5em', margin: '0.4em 0 0.4em 1.5em' }
        }, '• ', formatInlineMarkdown(element.content, isUser));

      case 'oli':
        return React.createElement('div', {
          key,
          style: { marginLeft: '1.5em', margin: '0.4em 0 0.4em 1.5em' }
        }, `${index + 1}. `, formatInlineMarkdown(element.content, isUser));

      default:
        return null;
    }
  });
}

/**
 * Main ChatBot Component
 */
export default function ChatBot({ tone = 'Neutral', botIcon = 'logo.jpeg' }) {
  const [apiKey, setApiKey] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: config.WELCOME_MESSAGE,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Get colors based on tone
  const colors = TASK_COLORS[tone] || TASK_COLORS['Neutral'];
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const buildToneInstruction = (toneType) => {
    switch (toneType) {
      case 'Neutral':
        return "You are a helpful AI assistant. Respond naturally and clearly in a neutral, factual tone. Be informative and professional when discussing women's health topics.";
      case 'Condescending':
        return "You are a condescending AI assistant. Respond in an instructional tone. The user is probably not as right as you are!";
      case 'Agreeable':
        return "You are an agreeable AI assistant. Be extremely supportive and don't hurt the users feelings.";
      default:
        return "You are a helpful AI assistant. Respond naturally and clearly in a neutral tone.";
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Show API key prompt if not set
  if (!apiKey) {
    return React.createElement(ApiKeyPrompt, { 
      onSubmit: setApiKey,
      colors: colors
    });
  }
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    
    try {
      const conversationHistory = messages
        .filter(msg => msg.sender !== 'bot' || msg.id !== 1)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      const apiMessages = [
        {
          role: 'system',
          content: buildToneInstruction(tone)
        },
        ...conversationHistory,
        {
          role: 'user',
          content: currentInput
        }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: config.AI_MODEL || 'gpt-4o-mini',
          messages: apiMessages,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
    } finally {
      setIsTyping(false);
    }
  };
  
  return React.createElement('div', { 
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 70px)',
      background: colors.background,
      marginTop: '70px'
    }
  },
    React.createElement(MessagesArea, {
      messages: messages,
      isTyping: isTyping,
      messagesEndRef: messagesEndRef,
      formatTime: formatTime,
      colors: colors,
      botIcon: botIcon
    }),
    React.createElement(InputArea, {
      inputValue: inputValue,
      setInputValue: setInputValue,
      handleSendMessage: handleSendMessage,
      inputRef: inputRef,
      colors: colors
    })
  );
}

// [Keep all your existing components: MessagesArea, Message, TypingIndicator, InputArea exactly as they are]

/**
 * Messages Area Component
 */
function MessagesArea({ messages, isTyping, messagesEndRef, formatTime, colors, botIcon }) {
  return React.createElement('div', { 
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  },
    React.createElement('div', { 
      style: {
        maxWidth: '1024px',
        margin: '0 auto',
        padding: '24px 16px'
      }
    },
      ...messages.map((message) =>
        React.createElement(Message, {
          key: message.id,
          message: message,
          formatTime: formatTime,
          colors: colors,
          botIcon: botIcon
        })
      ),
      config.SHOW_TYPING_INDICATOR && isTyping && React.createElement(TypingIndicator, { colors, botIcon }),
      React.createElement('div', { ref: messagesEndRef })
    )
  );
}

/**
 * Single Message Component
 */
function Message({ message, formatTime, colors, botIcon }) {
  const isUser = message.sender === 'user';
  const parsedContent = parseMarkdown(message.text);
  
  return React.createElement('div', {
    style: {
      display: 'flex',
      gap: '12px',
      flexDirection: isUser ? 'row-reverse' : 'row',
      marginBottom: '24px'
    }
  },
    isUser 
      ? React.createElement('div', {
          style: {
            flexShrink: 0,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #d4d4d8 0%, #a1a1aa 100%)'
          }
        },
        React.createElement(User, { style: { width: '20px', height: '20px', color: 'white' }})
      )
      : React.createElement('img', {
          src: botIcon,
          alt: 'Bot',
          style: {
            flexShrink: 0,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            objectFit: 'cover'
          }
        }),
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '70%',
        alignItems: isUser ? 'flex-end' : 'flex-start'
      }
    },
      React.createElement('div', {
        style: {
          padding: '12px 16px',
          borderRadius: '16px',
          background: isUser
            ? `linear-gradient(135deg, ${colors.userBg} 0%, ${colors.userBgDark} 100%)`
            : 'white',
          color: isUser ? 'white' : '#1e293b',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: isUser ? 'none' : '1px solid #e2e8f0',
          fontSize: '14px',
          lineHeight: '1.6'
        }
      },
        React.createElement('div', null, renderMarkdown(parsedContent, isUser))
      ),
      config.SHOW_TIMESTAMPS && React.createElement('span', { 
        style: {
          fontSize: '12px',
          color: '#94a3b8',
          marginTop: '4px',
          padding: '0 8px'
        }
      },
        formatTime(message.timestamp)
      )
    )
  );
}

/**
 * Typing Indicator Component
 */
function TypingIndicator({ colors, botIcon }) {
  return React.createElement('div', { 
    style: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px'
    }
  },
    React.createElement('img', {
      src: botIcon,
      alt: 'Bot',
      style: {
        flexShrink: 0,
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        objectFit: 'cover'
      }
    }),
    React.createElement('div', { 
      style: {
        backgroundColor: 'white',
        padding: '12px 16px',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }
    },
      React.createElement('div', { style: { display: 'flex', gap: '4px' }},
        React.createElement('div', { 
          style: {
            width: '8px',
            height: '8px',
            backgroundColor: '#94a3b8',
            borderRadius: '50%',
            animation: 'bounce 1.4s infinite ease-in-out'
          }
        }),
        React.createElement('div', { 
          style: {
            width: '8px',
            height: '8px',
            backgroundColor: '#94a3b8',
            borderRadius: '50%',
            animation: 'bounce 1.4s infinite ease-in-out 0.2s'
          }
        }),
        React.createElement('div', {
          style: {
            width: '8px',
            height: '8px',
            backgroundColor: '#94a3b8',
            borderRadius: '50%',
            animation: 'bounce 1.4s infinite ease-in-out 0.4s'
          }
        })
      )
    )
  );
}

/**
 * Input Area Component
 */
function InputArea({ inputValue, setInputValue, handleSendMessage, inputRef, colors }) {
  return React.createElement('div', { 
    style: {
      backgroundColor: 'white',
      borderTop: '1px solid #e2e8f0',
      boxShadow: '0 -4px 6px rgba(0,0,0,0.05)'
    }
  },
    React.createElement('div', { 
      style: {
        maxWidth: '1024px',
        margin: '0 auto',
        padding: '16px'
      }
    },
      React.createElement('form', { 
        onSubmit: handleSendMessage,
        style: {
          display: 'flex',
          gap: '12px'
        }
      },
        React.createElement('input', {
          ref: inputRef,
          type: "text",
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          placeholder: config.INPUT_PLACEHOLDER,
          style: {
            flex: 1,
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            outline: 'none',
            fontSize: '14px',
            color: '#1e293b',
            transition: 'all 0.2s'
          }
        }),
        React.createElement('button', {
          type: "submit",
          disabled: !inputValue.trim(),
          style: {
            width: '48px',
            height: '48px',
            background: inputValue.trim() 
              ? `linear-gradient(135deg, ${colors.userBg} 0%, ${colors.userBgDark} 100%)`
              : 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
            color: 'white',
            borderRadius: '50%',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
            boxShadow: inputValue.trim() ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s'
          }
        },
          React.createElement(Send, { style: { width: '20px', height: '20px' }})
        )
      ),
      React.createElement('p', { 
        style: {
          fontSize: '12px',
          color: '#94a3b8',
          textAlign: 'center',
          marginTop: '12px'
        }
      },
        "AI can make mistakes. Verify important information."
      )
    )
  );
}
