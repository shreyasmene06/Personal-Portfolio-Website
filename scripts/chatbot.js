import OpenAIService from './openai-service.js';
import config from '../config.js';

// Initialize OpenAI service with API key from config
const openAI = new OpenAIService(config.OPENAI_API_KEY);

// Initialize variables at module scope
let chatbotToggle;
let chatbotWindow;
let chatbotClose;
let chatMessages;
let chatInput;
let sendButton;
let chatbotOpen = false;

// Bot responses (keeping as fallback)
const botResponses = {
    greetings: [
        "Hello! I'm here to help you learn more about Shreyas's work and experience.",
        "Hi there! What would you like to know about Shreyas?",
        "Hey! I'm Shreyas's AI assistant. How can I help you today?"
    ],
    skills: {
        general: [
            "Shreyas has a diverse skill set in both frontend and backend development. His key skills include:",
            "• Frontend: HTML5, CSS3, JavaScript, React, TypeScript, Node.js",
            "• Backend: Express.js, Python, MongoDB, MySQL",
            "• Programming: Java, C++, Python",
            "• Tools: Git, GitHub, Postman, CI/CD",
            "\nWould you like to know more about any specific area of his expertise?"
        ],
        frontend: [
            "In frontend development, Shreyas is proficient in:",
            "• HTML5 & CSS3 for modern, responsive layouts",
            "• JavaScript and TypeScript for dynamic web applications",
            "• React for building interactive user interfaces",
            "• Node.js for runtime environment",
            "\nHe uses these skills in his current internship at IIT Ropar."
        ],
        backend: [
            "Shreyas's backend development skills include:",
            "• Express.js for building robust APIs",
            "• Python for server-side applications",
            "• MongoDB for NoSQL database management",
            "• MySQL for relational database systems",
            "\nHe applies these in creating full-stack applications."
        ]
    },
    education: [
        "Shreyas is currently pursuing his B.Tech in CSE (AI/ML) at VIT Bhopal with a 9.0 GPA.",
        "His academic focus is on Artificial Intelligence and Machine Learning."
    ],
    experience: [
        "Shreyas is currently working as a MERN Stack Developer Intern at IIT Ropar.",
        "He's gaining valuable industry experience working with modern web technologies."
    ]
};

async function getBotResponse(message) {
    try {
        const response = await openAI.generateResponse(message);
        return response;
    } catch (error) {
        console.error('Error getting bot response:', error);
        return getFallbackResponse(message);
    }
}

function getFallbackResponse(message) {
    const msg = message.toLowerCase().trim();
    
    if (msg.includes('skill') || msg.includes('tech')) {
        return botResponses.skills.general.join('\n');
    }
    if (msg.includes('education') || msg.includes('study')) {
        return botResponses.education[0];
    }
    if (msg.includes('experience') || msg.includes('work')) {
        return botResponses.experience[0];
    }
    
    return botResponses.greetings[0];
}

async function handleMessage(event) {
    if (event.key === 'Enter' && !sendButton.disabled) {
        await sendMessage();
    }
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    chatInput.value = '';
    sendButton.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
        const response = await getBotResponse(message);
        hideTypingIndicator();
        addMessage(response);
    } catch (error) {
        console.error('Error in sendMessage:', error);
        hideTypingIndicator();
        addMessage("I apologize, but I'm having trouble processing your request. Please try again.");
    } finally {
        sendButton.disabled = false;
        chatInput.focus();
    }
}

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    // Handle array of messages
    if (Array.isArray(content)) {
        const formattedContent = content
            .map(line => line.trim()) // Trim each line
            .join('<br>') // Join with line breaks
            .replace(/\n/g, '<br>'); // Replace newlines with line breaks
        
        messageDiv.innerHTML = `
            <div>${formattedContent}</div>
            <div class="message-time">${getCurrentTime()}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div>${content}</div>
            <div class="message-time">${getCurrentTime()}</div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <span>AI is typing</span>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function toggleChat() {
    chatbotOpen = !chatbotOpen;
    chatbotWindow.style.display = chatbotOpen ? 'flex' : 'none';
    if (chatbotOpen) {
        chatInput.focus();
    }
}

function closeChat() {
    chatbotOpen = false;
    chatbotWindow.style.display = 'none';
}

// Initialize chatbot
function initializeChatbot() {
    // Get DOM elements
    chatbotToggle = document.getElementById('chatbotToggle');
    chatbotWindow = document.getElementById('chatbotWindow');
    chatbotClose = document.getElementById('chatbotClose');
    chatMessages = document.getElementById('chatMessages');
    chatInput = document.getElementById('chatInput');
    sendButton = document.getElementById('sendMessage');

    if (!chatbotToggle || !chatbotWindow || !chatbotClose || !chatMessages || !chatInput || !sendButton) {
        console.error('Could not find all required chatbot elements');
        return;
    }

    // Event listeners
    chatbotToggle.addEventListener('click', toggleChat);
    chatbotClose.addEventListener('click', closeChat);
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', handleMessage);

    // Initialize timestamp for initial message
    const timestamp = document.getElementById('timestamp');
    if (timestamp) {
        timestamp.textContent = getCurrentTime();
    }

    console.log('Chatbot initialized successfully');
}

// Wait for DOM to load before initializing
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing chatbot...');
    initializeChatbot();
});

// Export functions for potential external use
export {
    sendMessage,
    toggleChat,
    closeChat,
    initializeChatbot
}; 