import OPENAI_CONFIG from './openai-config.js';

const fallbackResponses = {
    skills: "Shreyas is proficient in full-stack development with the MERN stack, including HTML5, CSS3, JavaScript, React, Node.js, Express.js, MongoDB, and more.",
    education: "Shreyas is pursuing B.Tech in CSE (AI/ML) at VIT Bhopal with a 9.0 GPA.",
    experience: "Shreyas is currently working as a MERN Stack Developer Intern at IIT Ropar.",
    default: "I can tell you about Shreyas's education, experience, skills, or projects. What would you like to know?"
};

class OpenAIService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.conversationHistory = [];
    }

    async generateResponse(userMessage) {
        try {
            // Add user message to conversation history
            this.conversationHistory.push({
                role: "user",
                content: userMessage
            });

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: OPENAI_CONFIG.model,
                    messages: [
                        {
                            role: "system",
                            content: OPENAI_CONFIG.systemPrompt
                        },
                        ...this.conversationHistory
                    ],
                    temperature: OPENAI_CONFIG.temperature,
                    max_tokens: OPENAI_CONFIG.max_tokens
                })
            });

            if (!response.ok) {
                throw new Error('OpenAI API call failed');
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // Add AI response to conversation history
            this.conversationHistory.push({
                role: "assistant",
                content: aiResponse
            });

            // Keep conversation history limited to last 10 messages
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = this.conversationHistory.slice(-10);
            }

            return aiResponse;

        } catch (error) {
            console.error('Error calling OpenAI:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    getFallbackResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        
        if (msg.includes('skill') || msg.includes('tech')) {
            return fallbackResponses.skills;
        }
        if (msg.includes('education') || msg.includes('study')) {
            return fallbackResponses.education;
        }
        if (msg.includes('experience') || msg.includes('work')) {
            return fallbackResponses.experience;
        }
        
        return fallbackResponses.default;
    }

    clearConversation() {
        this.conversationHistory = [];
    }
}

export default OpenAIService; 